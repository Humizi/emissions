import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { Component, ViewChild } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { Fields, FormType } from './data.models';
import { FormBuilder, NgForm, Validators } from '@angular/forms';

import { DataService } from './data.service';
import { format } from 'date-fns';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('coalForm', { static: false }) coalForm!: NgForm;
  @ViewChild('gasForm', { static: false }) gasForm!: NgForm;
  @ViewChild('chart') chart!: ChartComponent;

  public formCoal = this.fb.nonNullable.group<FormType>({
    [Fields.Value]: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.min(0),
      Validators.max(1000),
    ]),
    [Fields.Date]: this.fb.nonNullable.control('', Validators.required),
  });

  public formGas = this.fb.nonNullable.group<FormType>({
    [Fields.Value]: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.min(0),
      Validators.max(1000),
    ]),
    [Fields.Date]: this.fb.nonNullable.control('', Validators.required),
  });

  public chartOption: EChartsOption = {
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: function (value) {
          return format(new Date(value).getTime(), 'yyyy-MM-dd');
        },
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'scatter',
      },
      {
        type: 'scatter',
      },
    ],
  };

  public chartOptions2: Partial<ChartOptions>;

  public merge!: any;

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.chartOptions2 = {
      series: [
        {
          name: 'Уголь',
          data: [],
        },
        {
          name: 'Газ',
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
      },
      tooltip: {
        x: {
          format: 'yyyy-MM-dd',
        },
      },
    };
  }

  onChartInit(ec: ECharts) {
    this.dataService.getCoalData$().subscribe((data) => {
      this.merge = { ...this.chartOption };
      this.merge.series[0]!.data = data;
      const newData: any = this.chart.series;
      newData[0].data = data;

      this.chart.updateSeries(newData);
    });

    this.dataService.getGasData$().subscribe((data) => {
      this.merge = { ...this.chartOption };
      this.merge.series[1]!.data = data;
      const newData: any = this.chart.series;
      newData[1].data = data;

      this.chart.updateSeries(newData);
    });
  }

  addCoalData(): void {
    this.dataService.addCoalData(this.formCoal.getRawValue());
    this.coalForm.resetForm();
  }

  addGasData(): void {
    this.dataService.addGasData(this.formGas.getRawValue());
    this.gasForm.resetForm();
  }

  isChartDataEmpty(): boolean {
    return (
      !!this.dataService.getCoalData().length ||
      !!this.dataService.getGasData().length
    );
  }
}
