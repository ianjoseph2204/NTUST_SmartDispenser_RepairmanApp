import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';
import { PreferenceManagerService } from 'src/app/services/PreferenceManager/preference-manager.service';
import { StaticVariables } from 'src/app/classes/StaticVariables/static-variables';
import { UnitConverter } from 'src/app/classes/UnitConverter/unit-converter';

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
    private pref: PreferenceManagerService
  ) { }

  async ngOnInit() {
    
    // get id from preference
    this.employee_id = await this.pref.getData(StaticVariables.KEY__LOGIN_EMPLOYEE_ID);

    if (this.employee_id !== null) {
      
      // get profile from API
      let getProfile = await this.api.getRepairmanProfile(this.employee_id);

      // set attributes
      this.employee_name = getProfile['FullName'];
      this.employee_email = getProfile['Email'];
      this.employee_picture_string = UnitConverter.convertBase64ToImage(getProfile['Picture']);
    } else {

      // set all into null
      this.employee_id = null;
      this.employee_name = null;
      this.employee_email = null;
      this.employee_picture_string = null;
    }
  }

  backFunc () {
    this.navCtrl.back();
  }

  async logout () {
    
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
            await this.pref.setData(StaticVariables.KEY__LOGIN_EMPLOYEE_EMAIL, null);
            await this.pref.setData(StaticVariables.KEY__LOGIN_EMPLOYEE_ID, null);

            this.navCtrl.navigateRoot(['login']);
          }
        }
      ]
    });
    
    myAlert.present();
  }
}