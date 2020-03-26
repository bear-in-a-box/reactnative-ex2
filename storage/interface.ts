import { Observable } from 'rxjs';

import { Report } from '../models/report.model';

export type ReportToAdd = Omit<Report, 'id'>;

export interface Storage {
  addReport(report: ReportToAdd): Promise<void>;
  deleteReport(id: string): Promise<void>;
  refresh(): void;
  reports$: Observable<Report[]>;
  loading$: Observable<boolean>;
}
