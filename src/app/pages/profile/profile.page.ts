import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';
import { PreferenceManagerService } from 'src/app/services/PreferenceManager/preference-manager.service';
import { StaticVariables } from 'src/app/classes/StaticVariables/static-variables';
import { UnitConverter } from 'src/app/classes/UnitConverter/unit-converter';
import { LoginSessionService } from 'src/app/services/LoginSession/login-session.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  // field variable
  employee_id = null;
  employee_name = null;
  employee_email = null;
  employee_picture_string = null;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private api: DispenserAPIService,
    private pref: PreferenceManagerService,
    private chk: LoginSessionService
  ) { }

  async ngOnInit() {
    
    // get id from preference and create profile information
    this.employee_id = await this.pref.getData(StaticVariables.KEY__LOGIN_EMPLOYEE_ID);
    this.createProfile(this.employee_id);
  }

  ionViewDidEnter () {
    this.chk.blockToInternalPages();
  }

  /**
   * Get the Employee profile from the database.
   * @param employee_id The ID of the employee.
   */
  async createProfile(employee_id: any){
    if (employee_id !== null) {
     
      // get profile from API
      let getProfile = await this.api.getRepairmanProfile(employee_id);

      // set attributes
      this.employee_name = getProfile['FullName'];
      this.employee_email = await this.pref.getData(StaticVariables.KEY__LOGIN_EMPLOYEE_EMAIL);
      if (getProfile['Picture'] !== null) {
        this.employee_picture_string = UnitConverter.convertBase64ToImage(getProfile['Picture']);
      }
    } else {
      // set all into null
      this.employee_id = null;
      this.employee_name = null;
      this.employee_email = null;
      this.employee_picture_string = null;
    }
  }

  /**
   * To going back, or route back, to the previous
   * opened page.
   */
  backFunc () {
    this.navCtrl.back();
  }

  /**
   * To perform logout, remove email address and ID from preference,
   * and bring the repairman into Login page.
   */
  async logout () {
    
    // create alert when perform logout
    let myAlert = await this.alertCtrl.create({
      mode: "ios",
      header: "Log Out",
      message: "Are you sure want to sign out?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Sign Out',
          handler: async () => {

            // reset repairman email address and ID value from preference
            await this.pref.setData(StaticVariables.KEY__LOGIN_EMPLOYEE_EMAIL, null);
            await this.pref.setData(StaticVariables.KEY__LOGIN_EMPLOYEE_ID, null);

            await this.navCtrl.navigateRoot(['login']);
          }
        }
      ]
    });
    
    await myAlert.present();
  }
}
