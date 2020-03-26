import { AsyncStorage } from 'react-native';

import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { exhaustMap, shareReplay } from 'rxjs/operators';

import { Storage, ReportToAdd } from '../interface';
import { Report } from '../../models/report.model';

export class LocalStorage implements Storage {
  private updateTrigger$ = new Subject<void>();

  private static readonly KEY = 'reports';

  public reports$ = this.createReportsSource();
  private loadingState$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.createLoadingInfo();

  async addReport(report: ReportToAdd) {
    const reports = await this.getReports();
    const targetReports: Report[] = [
      { ...report, id: String(report.date) },
      ...reports
    ];
    await AsyncStorage.setItem(LocalStorage.KEY, JSON.stringify(targetReports));
  }

  async deleteReport(id: string) {
    const reports = await this.getReports();
    const targetReports = reports.filter(report => report.id !== id);
    await AsyncStorage.setItem(LocalStorage.KEY, JSON.stringify(targetReports));
  }

  refresh() {
    this.updateTrigger$.next();
  }

  private async getReports(): Promise<Report[]> {
    this.loadingState$.next(true);
    let reports: Report[] = null;
    try {
      const raw = await AsyncStorage.getItem(LocalStorage.KEY);
      reports = JSON.parse(raw) || [];
    } catch (e) {
      console.error(e);
      reports = [];
    }
    this.loadingState$.next(false);
    return reports;
  }

  private createReportsSource(): Observable<Report[]> {
    return this.updateTrigger$.pipe(
      exhaustMap(() => this.getReports()),
      shareReplay()
    );
  }

  private createLoadingInfo(): Observable<boolean> {
    return this.loadingState$.asObservable();
  }
}
