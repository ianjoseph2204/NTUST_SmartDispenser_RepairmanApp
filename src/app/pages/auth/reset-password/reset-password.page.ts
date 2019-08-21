import { Component, OnInit } from '@angular/core';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';
import { NavController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  // form attributes
  credential = "";
  new_password = "";
  re_new_password = "";
  verif_code = "";
  
  // password checking attributes
  passwordFalse = false;

  // loadCtrl var
  makeLoading: any;

  constructor(
    private navCtrl: NavController,
    private api: DispenserAPIService,
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
   * Repairman confirm the Reset Password by click the RESET
   * button, it will send the data to API and return a value
   * to know if it success or failed.
   */
  async reset () {
    
    // initial local variables
    let myToast: any;
    let myToastRespond: number;
    let myToastMessage: string = "";
    const { credential, new_password, re_new_password, verif_code } = this;

    // check if input form is complete
    if (
      credential === "" ||
      new_password === "" ||
      re_new_password === "" ||
      verif_code === ""
    ) {
      myToastMessage = "Please fill in all the required form!"
    } else {

      // create loading screen
      await this.createLoadCtrl();
      
      // send data into API with return value
      // success is 1 and failed is others with result Message
      let resultData = await this.api.resetPassword(credential, new_password, re_new_password, verif_code);
      myToastRespond = resultData['RepsondNum']
      myToastMessage = resultData['Message'];
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

    // if success go back to login page
    if (myToastRespond === 1) {
      this.navCtrl.back();
      this.navCtrl.back();
    }
  }
  
  /**
   * Check the input password inside the form with regex,
   * it must have at least 1 alphabet, 1 number, and minimum
   * with 6 characters.
   * 
   * @param email Email address being inputed and checked
   */
  checkPassword (password: string) {
    
    // regex logic for Password
    let regexString = '^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,}$';
    let reg = new RegExp(regexString);

    // set emailFalse value with testing regex from input
    this.passwordFalse = !reg.test(password);    
  }
}