import { BehaviorSubject, Observable } from 'rxjs';

import { IData } from './data.models';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private coalData$ = new BehaviorSubject<Array<number[]>>([]);
  private gasData$ = new BehaviorSubject<Array<number[]>>([]);

  addCoalData(newData: IData): void {
    const data = this.getCoalData();
    const pushData = [
      new Date(newData.date).getTime(),
      +(+newData.value * 0.768 * 2.76).toFixed(2),
    ];
    data.push(pushData);

    this.coalData$.next(data);
  }

  getCoalData$(): Observable<Array<number[]>> {
    return this.coalData$.asObservable();
  }

  getCoalData(): Array<number[]> {
    return this.coalData$.getValue();
  }

  addGasData(newData: IData): void {
    const data = this.getGasData();
    const pushData = [
      new Date(newData.date).getTime(),
      +(+newData.value * 1.129 * 1.59).toFixed(2),
    ];
    data.push(pushData);

    this.gasData$.next(data);
  }

  getGasData$(): Observable<Array<number[]>> {
    return this.gasData$.asObservable();
  }

  getGasData(): Array<number[]> {
    return this.gasData$.getValue();
  }
}
