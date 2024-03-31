import { FormControl } from '@angular/forms';

interface IChartData {
  value: number;
  date: number;
}

interface IData {
  value: string;
  date: string;
}

const enum Fields {
  Value = 'value',
  Date = 'date',
}

interface FormType {
  [Fields.Value]: FormControl<string>;
  [Fields.Date]: FormControl<string>;
}

export { IData, Fields, FormType, IChartData };
