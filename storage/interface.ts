import { Observable } from 'rxjs';

import { Report } from '../models/report.model';

export interface Storage {
  addReport(report: Report): Promise<void>;
  refresh(): void;
  reports$: Observable<Report[]>;
  loading$: Observable<boolean>;
}
