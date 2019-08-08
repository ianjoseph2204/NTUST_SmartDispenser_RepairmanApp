import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';
import { PreferenceManagerService } from 'src/app/services/PreferenceManager/preference-manager.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // field variable to store input
  credential: string = "";
  password: string = "";

  constructor(
    private navCtrl: NavController,
    private api: DispenserAPIService,
    private pref: PreferenceManagerService
  ) { }

  ngOnInit() {
  }

  async login() {
    
    const { credential, password } = this;
    
    let resultData: any;
    resultData = await this.api.loginRepairmanUsingEmail(credential, password);

    if (resultData === 0 || resultData === -1)
      resultData = await this.api.loginRepairmanUsingEmployeeId(credential, password);

    console.log(resultData);
  }

  registerLink() {
    this.navCtrl.navigateForward(['register']);
  }

}
