import firebase from 'firebase';
import '@firebase/firestore';
import { encode, decode } from 'base-64';

if (!(global as any).btoa) {
  (global as any).btoa = encode;
}

if (!(global as any).atob) {
  (global as any).atob = decode;
}

import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { exhaustMap, shareReplay } from 'rxjs/operators';

import { Storage } from '../interface';
import { Report } from '../../models/report.model';
import { FIRESTORE_CONFIG } from './config.firestore';

export class FirestoreStorage implements Storage {
  private static readonly CONFIG = FIRESTORE_CONFIG;

  private static readonly COLLECTION = 'reports';

  private app: firebase.app.App;
  private store: firebase.firestore.Firestore;

  private updateTrigger$ = new Subject<void>();

  public reports$ = this.createReportsSource();
  private loadingState$ = new BehaviorSubject<boolean>(false);
  public loading$ = this.createLoadingInfo();

  constructor() {
    this.app =
      firebase.apps.length === 0
        ? firebase.initializeApp(FirestoreStorage.CONFIG)
        : firebase.app();
    this.store = firebase.firestore(this.app);
  }

  async addReport(report: Report) {
    await this.store.collection(FirestoreStorage.COLLECTION).add(report);
  }

  refresh() {
    this.updateTrigger$.next();
  }

  private async getReports(): Promise<Report[]> {
    this.loadingState$.next(true);
    let reports: Report[] = null;
    try {
      const snapshot = await this.store
        .collection(FirestoreStorage.COLLECTION)
        .get();
      reports = snapshot.docs.map(doc => {
        const sourceDate = doc.data().date;
        const date =
          typeof sourceDate === 'number' ? sourceDate : sourceDate.toMillis();
        return {
          ...doc.data(),
          date
        } as Report;
      });
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
