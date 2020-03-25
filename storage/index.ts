import { Storage } from './interface';
import { LocalStorage } from './implementation/local';
import { FirestoreStorage } from './implementation/firestore';

export enum StorageType {
  Firestore = 'Firestore',
  Local = 'Local'
}

const storageCache: Record<StorageType, Storage> = {
  [StorageType.Firestore]: null,
  [StorageType.Local]: null
};

function createStorage(type: StorageType): Storage {
  switch (type) {
    case StorageType.Local:
      return new LocalStorage();
    case StorageType.Firestore:
      return new FirestoreStorage();
    default:
      throw new Error('Unknown storage');
  }
}

export function getStorage(type: StorageType): Storage {
  if (!storageCache[type]) {
    storageCache[type] = createStorage(type);
  }
  return storageCache[type];
}
