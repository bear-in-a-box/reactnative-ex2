import React, { useState, useEffect, useRef } from 'react';

import { StorageType, getStorage } from '../index';
import { Storage } from '../interface';
import { Report } from '../../models/report.model';

interface UseStorageData {
  reports: Report[];
  loading: boolean;
  refresh(): void;
  addReport(report: Report): Promise<void>;
  deleteReport(id: string): Promise<void>;
}

type UseStorage = (storageType: StorageType) => UseStorageData;

const useStorage: UseStorage = storageType => {
  const [storage, setStorage] = useState(getStorage(storageType));
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => setStorage(getStorage(storageType)), [storageType]);

  useEffect(() => {
    const reportsSub = storage.reports$.subscribe(setReports);
    const loadingSub = storage.loading$.subscribe(setLoading);
    return () => {
      if (reportsSub && !reportsSub.closed) {
        reportsSub.unsubscribe();
      }
      if (loadingSub && !loadingSub.closed) {
        loadingSub.unsubscribe();
      }
    };
  }, [storage]);

  return {
    reports,
    loading,
    refresh: () => storage.refresh(),
    addReport: report => storage.addReport(report),
    deleteReport: id => storage.deleteReport(id)
  };
};

export default useStorage;
