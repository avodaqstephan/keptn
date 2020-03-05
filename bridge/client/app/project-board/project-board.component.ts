import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {filter, map, startWith, switchMap} from "rxjs/operators";
import {Observable, Subscription, timer} from "rxjs";
import {ActivatedRoute} from "@angular/router";

import * as moment from 'moment';

import {Root} from "../_models/root";
import {Project} from "../_models/project";

import {DataService} from "../_services/data.service";
import DateUtil from "../_utils/date.utils";
import {Service} from "../_models/service";
import {Trace} from "../_models/trace";
import {Stage} from "../_models/stage";

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.scss']
})
export class ProjectBoardComponent implements OnInit, OnDestroy {

  public project$: Observable<Project>;
  public currentRoot: Root;
  public error: boolean = false;

  private _projectSub: Subscription = Subscription.EMPTY;
  private _routeSubs: Subscription = Subscription.EMPTY;
  private _rootEventsTimer: Subscription = Subscription.EMPTY;
  private _rootEventsTimerInterval = 30;

  private _tracesTimer: Subscription = Subscription.EMPTY;
  private _tracesTimerInterval = 10;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    this._routeSubs = this.route.params.subscribe(params => {
      if(params['projectName']) {
        this.currentRoot = null;

        this.project$ = this.dataService.projects.pipe(
          map(projects => projects ? projects.find(project => {
            return project.projectName === params['projectName'];
          }) : null)
        );

        this._projectSub = this.project$.subscribe(projects => {
          this.error = false;
        }, error => {
          this.error = true;
        });

        this._rootEventsTimer = timer(0, this._rootEventsTimerInterval*1000)
          .pipe(
            startWith(0),
            switchMap(() => this.project$),
            filter(project => !!project && !!project.getServices())
          )
          .subscribe(project => {
            project.getServices().forEach(service => {
              this.dataService.loadRoots(project, service);
            });
          });
      }
    });
  }

  loadTraces(root): void {
    this._tracesTimer.unsubscribe();
    if(moment().subtract(1, 'day').isBefore(root.time)) {
      this._tracesTimer = timer(0, this._tracesTimerInterval*1000)
        .subscribe(() => {
          this.dataService.loadTraces(root);
        });
    } else {
      this.dataService.loadTraces(root);
      this._tracesTimer = Subscription.EMPTY;
    }
  }

  getCalendarFormats() {
    return DateUtil.getCalendarFormats(true);
  }

  getLatestDeployment(project: Project, service: Service, stage?: Stage): Trace {
    let currentService = project.getServices()
      .find(s => s.serviceName == service.serviceName);

    if(currentService.roots)
      return currentService.roots
        .reduce((traces: Trace[], root: Root) => {
          return [...traces, ...root.traces];
        }, [])
        .find(trace => trace.type == 'sh.keptn.events.deployment-finished' && (!stage || trace.data.stage == stage.stageName));
    else
      return null;
  }

  getShortImageName(image) {
    let parts = image.split("/");
    return parts[parts.length-1];
  }

  getRootsLastUpdated(project: Project, service: Service): Date {
    return this.dataService.getRootsLastUpdated(project, service);
  }

  getTracesLastUpdated(root: Root): Date {
    return this.dataService.getTracesLastUpdated(root);
  }

  showReloadButton(root: Root) {
    return moment().subtract(1, 'day').isAfter(root.time);
  }

  loadProjects() {
    this.dataService.loadProjects();
  }

  trackStage(index: number, stage: Stage) {
    return stage.stageName;
  }

  ngOnDestroy(): void {
    this._projectSub.unsubscribe();
    this._routeSubs.unsubscribe();
    this._tracesTimer.unsubscribe();
    this._rootEventsTimer.unsubscribe();
  }

}
