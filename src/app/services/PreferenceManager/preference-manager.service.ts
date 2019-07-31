import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PreferenceManagerService {

  constructor(private storage: Storage) { }
  
  async getData (key: string) {

    return await this.storage.get(key).then((result) => {
      return result;
    }, () => {
      console.error("Promise rejected: unable to get value from: " + key + "!");
      return null;
    })
    .catch((e) => {
      console.error("Function error: on getData => " + e);
      return null;
    });
  }
  
  async setData (key: string, data: any) {

    return await this.storage.set(key, data).then(() => {
      return true;
    }, () => {
      console.error("Promise rejected: unable to save value to: " + key + "!");
      return false;
    })
    .catch((e) => {
      console.error("Function error: on saveData => " + e);
      return false;
    });
  }
  
}