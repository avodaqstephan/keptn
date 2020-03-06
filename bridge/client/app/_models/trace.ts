import {Stage} from "./stage";

let labels = {
  "sh.keptn.internal.event.service.create": "Service create",
  "sh.keptn.event.configuration.change": "Configuration change",
  "sh.keptn.event.monitoring.configure": "Configure monitoring",
  "sh.keptn.events.deployment-finished": "Deployment finished",
  "sh.keptn.events.tests-finished": "Tests finished",
  "sh.keptn.events.evaluation-done": "Evaluation done",
  "sh.keptn.internal.event.get-sli": "Start SLI retrieval",
  "sh.keptn.internal.event.get-sli.done": "SLI retrieval done",
  "sh.keptn.events.done": "Done",
  "sh.keptn.event.problem.open": "Problem open",
  "sh.keptn.events.problem": "Problem detected",
  "sh.keptn.event.problem.close": "Problem closed"
};
let icons = {
  "sh.keptn.event.configuration.change": "duplicate",
  "sh.keptn.events.deployment-finished": "deploy",
  "sh.keptn.events.tests-finished": "perfromance-health",
  "sh.keptn.events.evaluation-done": "traffic-light",
  "sh.keptn.internal.event.get-sli": "collector",
  "sh.keptn.internal.event.get-sli.done": "collector",
  "sh.keptn.event.problem.open": "criticalevent",
  "sh.keptn.events.problem": "criticalevent",
  "sh.keptn.event.problem.close": "applicationhealth"
};

export class Trace {
  id: string;
  shkeptncontext: string;
  source: string;
  time: Date;
  type: string;
  label: string;
  icon: string;
  plainEvent: string;
  data: {
    project: string;
    service: string;
    stage: string;

    deploymentURILocal: string;
    deploymentURIPublic: string;

    deploymentstrategy: string;
    labels: Map<any, any>;
    result: string;
    teststrategy: string;

    start: Date;
    end: Date;

    canary: {
      action: string;
      value: number;
    };
    eventContext: {
      shkeptncontext: string;
      token: string;
    };
    valuesCanary: {
      image: string;
    };

    evaluationdetails: {
      indicatorResults: any;
      result: string;
      score: number;
      sloFileContent: string;
      timeEnd: Date;
      timeStart: Date;
    };

    ProblemTitle: string;
    ImpactedEntity: string;
    ProblemDetails: {
      tagsOfAffectedEntities: {
        key: string;
        value: string;
      }
    };
    Tags: string;
    State: string;
  };

  isFaulty(): string {
    let result: string = null;
    if(this.data) {
      if(this.data.result == 'fail' || this.type.indexOf('problem.open') != -1) {
        result = this.data.stage;
      }
    }
    return result;
  }

  isSuccessful(): boolean {
    let result: boolean = false;
    if(this.data) {
      if(this.data.result == 'pass') {
        result = true;
      }
    }
    return !this.isFaulty() && result;
  }

  getLabel(): string {
    if(!this.label) {
      // TODO: use translation file
      this.label = labels[this.type] || this.type;
    }
    return this.label;
  }

  getIcon() {
    if(!this.icon) {
      this.icon = icons[this.type] || "information";
    }
    return this.icon;
  }

  static fromJSON(data: any) {
    return Object.assign(new this, data);
  }
}
