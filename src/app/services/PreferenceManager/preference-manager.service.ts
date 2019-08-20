import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PreferenceManagerService {

  constructor(private storage: Storage) { }
  
  /**
   * This function is to get the data from the preference. It will
   * return the data from the key pair given if present and will 
   * return null if not present.
   * 
   * @param     key         Key to check if data is present
   * 
   * @returns   value       Return the value if present, null if not
   */
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
  
  /**
   * This function is to save or store the data to preference with
   * the key pair. It check promise and return boolean value as true
   * if success and false if failed.
   * 
   * @param     key         Key to save the data to preference
   * @param     data        Data will be stored in preference
   * 
   * @returns   boolean     Return true if success, false if failed
   */
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