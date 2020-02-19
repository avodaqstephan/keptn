import * as Highcharts from "highcharts";

declare var require: any;
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const Heatmap = require("highcharts/modules/heatmap");
const Treemap = require("highcharts/modules/treemap");


Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);
Heatmap(Highcharts);
Treemap(Highcharts);

import * as moment from 'moment';
import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {DtChartSeriesVisibilityChangeEvent} from "@dynatrace/barista-components/chart";

import {DataService} from "../../_services/data.service";
import DateUtil from "../../_utils/date.utils";
import {AxisOptions} from "highcharts";

@Component({
  selector: 'ktb-evaluation-details',
  templateUrl: './ktb-evaluation-details.component.html',
  styleUrls: ['./ktb-evaluation-details.component.scss']
})
export class KtbEvaluationDetailsComponent implements OnInit {

  public _evaluationData: any;
  public _evaluationSource: string;

  public _selectedEvaluationData: any;

  public _view: string = "singleevaluation";
  public _comparisonView: string = "heatmap";

  public _chartOptions: Highcharts.Options = {
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        title: null,
        labels: {
          format: '{value}',
        },
        min: 0,
        max: 100,
        tickInterval: 10,
      },
      {
        title: null,
        labels: {
          format: '{value}',
        },
        opposite: true,
        tickInterval: 50,
      },
    ],
    plotOptions: {
      column: {
        stacking: 'normal',
        pointWidth: 5,
        minPointLength: 2,
        point: {
          events: {
            click: (event) => {
              this._chartSeriesClicked(event);
              return true;
            }
          }
        },
      },
    },
  };
  public _chartSeries: Highcharts.IndividualSeriesOptions[] = [
    {
      name: 'Evaluation passed',
      type: 'column',
      data: [],
      color: '#006bb8',
      cursor: 'pointer'
    },
    {
      name: 'Evaluation failed',
      type: 'column',
      data: [],
      color: '#c41425',
      cursor: 'pointer'
    },
  ];

  public _heatmapOptions: Highcharts.Options = {
    chart: {
      type: 'heatmap',
      height: 400
    },

    title: {
      text: 'Heatmap',
      align: 'left'
    },

    subtitle: {
      text: 'Evalution results',
      align: 'left'
    },

    xAxis: [{
      categories: []
    }],

    yAxis: [{
      categories: ["Score"],
      title: null,
      labels: {
        format: '{value}'
      },
      minPadding: 0,
      maxPadding: 0,
      startOnTick: false,
      endOnTick: false,
    }],

    colorAxis: {
      stops: [
        [0, '#00ff00'],
        [0.5, '#ffaa00'],
        [1, '#ff0000']
      ],
      min: 0
    },

    plotOptions: {
    },
  };
  public _heatmapSeries: Highcharts.IndividualSeriesOptions[] = [];

  public _evaluationColor = {
    'fail': '#ff0000',
    'pass': '#00ff00',
    'warning': '#ff9900',
    'info': '#ffff00'
  };

  @Input()
  get evaluationData(): any {
    return this._evaluationData;
  }
  set evaluationData(evaluationData: any) {
    if (this._evaluationData !== evaluationData) {
      this._evaluationData = evaluationData;
      this._changeDetectorRef.markForCheck();
    }
  }

  @Input()
  get evaluationSource(): any {
    return this._evaluationSource;
  }
  set evaluationSource(evaluationSource: any) {
    if (this._evaluationSource !== evaluationSource) {
      this._evaluationSource = evaluationSource;
      this._changeDetectorRef.markForCheck();
    }
  }

  constructor(private _changeDetectorRef: ChangeDetectorRef, private dataService: DataService) { }

  ngOnInit() {
    this.dataService.evaluationResults.subscribe((evaluationData) => {
      if(this.evaluationData === evaluationData) {
        this.updateChartData(evaluationData.evaluationHistory);
        this._changeDetectorRef.markForCheck();
      }
    });
  }

  updateChartData(evaluationHistory) {
    let chartSeries = [];

    let evaluationPassed = [];
    let evaluationFailed = [];

    evaluationHistory.forEach((evaluation) => {
      let data = {
        x: moment(evaluation.time).unix()*1000,
        y: evaluation.data.evaluationdetails ? evaluation.data.evaluationdetails.score : 0,
        evaluationData: evaluation
      };
      if(evaluation.data.result == 'pass')
        evaluationPassed.push(data);
      else
        evaluationFailed.push(data);

      let scoreChartSeries = chartSeries.find(series => series.name == "Score");
      if(!scoreChartSeries) {
        scoreChartSeries = {
          name: "Score",
          type: 'line',
          yAxis: 1,
          data: [],
        };
        chartSeries.push(scoreChartSeries);
      }
      scoreChartSeries.data.push({
        x: moment(evaluation.time).unix()*1000,
        y: evaluation.data.evaluationdetails.score,
        evaluation: evaluation
      });

      if(evaluation.data.evaluationdetails.indicatorResults) {
        evaluation.data.evaluationdetails.indicatorResults.forEach((indicatorResult) => {
          let indicatorData = {
            x: moment(evaluation.time).unix()*1000,
            y: indicatorResult.value.value,
            indicatorResult: indicatorResult
          };
          let indicatorChartSeries = chartSeries.find(series => series.name == indicatorResult.value.metric);
          if(!indicatorChartSeries) {
            indicatorChartSeries = {
              name: indicatorResult.value.metric,
              type: 'line',
              yAxis: 1,
              data: [],
            };
            chartSeries.push(indicatorChartSeries);
          }
          indicatorChartSeries.data.push(indicatorData);
        });
      }
    });
    this._chartSeries = [
      {
        name: 'Evaluation passed',
        type: 'column',
        data: evaluationPassed,
        color: '#7dc540',
        cursor: 'pointer'
      },
      {
        name: 'Evaluation failed',
        type: 'column',
        data: evaluationFailed,
        color: '#c41425',
        cursor: 'pointer'
      },
      ...chartSeries
    ];

    this.updateHeatmapOptions(chartSeries);
    this._heatmapSeries = [
      {
        name: 'Heatmap',
        data: chartSeries.reverse().reduce((r, d, i) => [...r, ...d.data.map((s) => {
          if(s.indicatorResult) {
            let time = moment(s.x).format();
            let index = this._heatmapOptions.yAxis[0].categories.indexOf(s.indicatorResult.value.metric);
            let x = this._heatmapOptions.xAxis[0].categories.indexOf(time);
            return {
              x: x,
              y: index,
              z: s.indicatorResult.score,
              color: this._evaluationColor[s.indicatorResult.status]
            };
          } else if(s.evaluation) {
            let time = moment(s.x).format();
            let index = this._heatmapOptions.yAxis[0].categories.indexOf("Score");
            let x = this._heatmapOptions.xAxis[0].categories.indexOf(time);
            return {
              x: x,
              y: index,
              z: s.y,
              color: this._evaluationColor[s.evaluation.data.result]
            };
          }
        })], [])
      }
    ];
  }

  updateHeatmapOptions(chartSeries) {
    chartSeries.forEach((d) =>
      d.data.forEach((s) => {
        if(s.indicatorResult) {
          let time = moment(s.x).format();
          if(this._heatmapOptions.yAxis[0].categories.indexOf(s.indicatorResult.value.metric) == -1)
            this._heatmapOptions.yAxis[0].categories.unshift(s.indicatorResult.value.metric);
          if(this._heatmapOptions.xAxis[0].categories.indexOf(time) == -1)
            this._heatmapOptions.xAxis[0].categories.splice(this.binarySearch(this._heatmapOptions.xAxis[0].categories, time, (a, b) => moment(a).unix() - moment(b).unix()), 0, time);
        }
      })
    )
  }

  switchEvaluationView(event) {
    this._view = this._view == "singleevaluation" ? "evaluationcomparison" : "singleevaluation";
    if(this._view == "evaluationcomparison") {
      this.dataService.loadEvaluationResults(this._evaluationData, this._evaluationSource);
      this._changeDetectorRef.markForCheck();
    }
  }

  seriesVisibilityChanged(_: DtChartSeriesVisibilityChangeEvent): void {
    // NOOP
  }

  _chartSeriesClicked(event): boolean {
    this._selectedEvaluationData = event.point.evaluationData.data;
    return true;
  }

  getCalendarFormat() {
    return DateUtil.getCalendarFormats().sameElse;
  }

  log(tooltip){
    console.log("tooltip", tooltip);
    return tooltip.points;
  }

  private binarySearch(ar, el, compare_fn) {
    if(compare_fn(el, ar[0]) < 0)
      return 0;
    if(compare_fn(el, ar[ar.length-1]) > 0)
      return ar.length;
    var m = 0;
    var n = ar.length - 1;
    while (m <= n) {
      var k = (n + m) >> 1;
      var cmp = compare_fn(el, ar[k]);
      if (cmp > 0) {
        m = k + 1;
      } else if(cmp < 0) {
        n = k - 1;
      } else {
        return k;
      }
    }
    return -m - 1;
  }

}