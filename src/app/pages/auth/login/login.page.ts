import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';
import { PreferenceManagerService } from 'src/app/services/PreferenceManager/preference-manager.service';
import { StaticVariables } from 'src/app/classes/StaticVariables/static-variables';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // field variable to store input
  credential: string = "";
  password: string = "";

  // loadCtrl var
  makeLoading: any;

  constructor(
    private navCtrl: NavController,
    private api: DispenserAPIService,
    private pref: PreferenceManagerService,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController
  ) { }

  /**
   * To going back, or route back, to the previous
   * opened page.
   */
  backFunc() {
    this.navCtrl.back();
  }

  /**
   * Create the loading controller
   */
  async createLoadCtrl () {

    // insert component of loading controller
    this.makeLoading = await this.loadCtrl.create({
      message: 'Loading data ...',
      spinner: 'crescent',
      duration: 10000
    });

    // display the loading controller
    await this.makeLoading.present();
  }

  /**
   * Dismiss the loading controller
   */
  async dismissLoadCtrl () {
    this.makeLoading.dismiss();
  }

  ngOnInit() {
  }

  /**
   * When LOGIN button was clicked, this function is to perform
   * login system on Repairman App.
   */
  async login() {
    
    // initial local variables
    let myToast: any;
    let myToastMessage: string = "";
    let resultData: any;
    let email: string;
    let id: string;
    const { credential, password } = this;
    
    // check if email address/ID and password form is filled
    if (credential === "" || password === "") {
      myToastMessage = "Please fill in all the required form!"
    } else {

      // create loading screen
      await this.createLoadCtrl();

      // send data into API
      // success is 1 and failed is others
      resultData = await this.api.loginRepairman(credential, password);
      if (resultData === 1) {
        myToastMessage = "Login success!"

        // use Get Repairman Profile API to get the details and set into Preference
        await this.api.getRepairmanProfile(credential).then(
          async (result) => {
            await this.pref.setData(StaticVariables.KEY__LOGIN_EMPLOYEE_EMAIL, result['Email']);
            await this.pref.setData(StaticVariables.KEY__LOGIN_EMPLOYEE_ID, result['EmployeeID']);
            this.navCtrl.navigateForward(['home']);
          }
        );
      } else if (resultData === 0) {
        myToastMessage = "Email address or password is incorrect!";
      } else {
        myToastMessage = "There is an unexpected error, please try again later!";
      }
    }

    // create Toast with myToastMessage as message display
    myToast = await this.toastCtrl.create({
      message: myToastMessage,
      duration: 2000,
      position: 'top',
      showCloseButton: true,
      closeButtonText: 'Close'
    });

    // display the Toast
    await myToast.present();

    // dismiss the loading screen
    this.dismissLoadCtrl();
  }

  /**
   * Link to Register page
   */
  registerLink() {
    this.navCtrl.navigateForward(['register']);
  }

  /**
   * Link to Forgot Password page
   */
  recovery () {
    this.navCtrl.navigateForward(['forgot-password'])
  }
}
