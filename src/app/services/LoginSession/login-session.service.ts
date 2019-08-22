import { Injectable } from '@angular/core';
import { PreferenceManagerService } from '../PreferenceManager/preference-manager.service';
import { StaticVariables } from 'src/app/classes/StaticVariables/static-variables';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoginSessionService {

  constructor(
    private pref: PreferenceManagerService,
    private navCtrl: NavController
  ) { }

  /**
   * Check email address and employee ID from preference.
   * This function will return true if both value are present
   * and false if just one of them is missing.
   */
  async checkLoginStatus () {
    let email = await this.pref.getData(StaticVariables.KEY__LOGIN_EMPLOYEE_EMAIL);
    let id = await this.pref.getData(StaticVariables.KEY__LOGIN_EMPLOYEE_ID);
    if (
      email !== "" && email !== null && email !== undefined &&
      id !== "" && id !== null && id !== undefined
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Block repairman to access Login page, Register page,
   * Forgot Password page, and Reset Password page once
   * has been logged in. This function will automatically
   * route repairman to Home page. Status has to be true.
   */
  async blockToAuthPages () {
    if (await this.checkLoginStatus())
      this.navCtrl.navigateForward(['home']);
  }

  /**
   * Block repairman to access Home page, Report Repair page,
   * Profile page, and Detail modal page when no login status.
   * This function will automatically route repairman to Login
   * page. Status has to be false
   */
  async blockToInternalPages () {
    if (!await this.checkLoginStatus())
      this.navCtrl.navigateForward(['login'])
  }
}