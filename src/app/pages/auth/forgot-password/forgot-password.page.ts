import { Component, OnInit } from '@angular/core';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { LoginSessionService } from 'src/app/services/LoginSession/login-session.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  // field variable to store input
  credential = "";

  // loadCtrl var
  makeLoading: any;

  constructor(
    private navCtrl: NavController,
    private api: DispenserAPIService,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private chk: LoginSessionService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter () {
    this.chk.blockToAuthPages();
  }

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

  /**
   * Reset function to route into Reset Password page. There are
   * two condition: one is when the repairman click the CONTINUE
   * button, it will send the credential to API and route the
   * repairman to Reset Password page, and the other one when the
   * repairman click the RESET link on bottom, it only route into
   * Reset Password page.
   * 
   * @param hasCredential True if repairman click CONTINUE button, false
   *                      for click RESET button 
   */
  async reset (hasCredential: boolean) {

    if (!hasCredential){

      // if user click RESET button
      this.navCtrl.navigateForward(['reset-password']);

    } else {

      // initial local variables
      let myToast: any;
      let myToastMessage: string = "";
      const {credential} = this;

      // check if email address or ID form is filled
      if (credential === "") {
        myToastMessage = "Please fill in all the required form!"
      } else {
        
        // create loading screen
        await this.createLoadCtrl();

        // send data into API to generate verification code
        // success is 1 and failed is others
        let resultData = await this.api.forgotPassword(credential);
        if (resultData === 1) {
          myToastMessage = "Verification code has been sent to your email address!";
          this.navCtrl.navigateForward(['reset-password']);
        } else if (resultData === 0) {
          myToastMessage = "Email address or employee ID is not found, please try again!";
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
  }
}