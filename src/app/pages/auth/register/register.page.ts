import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  // form attributes
  fullname = "";
  employee_id = "";
  email = "";
  password = "";
  re_password = "";

  // image upload attributes
  urlImage: any;
  fileImage: any = null;
  alreadyUpload = false;

  // email and password checking attributes
  emailFalse = false;
  passwordFalse = false;

  // loadCtrl var
  makeLoading: any;

  constructor(
    private navCtrl: NavController,
    private api: DispenserAPIService,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private AlertCtrl: AlertController
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
   * When profile picture being clicked and select a picture
   * to assigned to be profile picture.
   * 
   * @param event Event when being click and upload picture
   */
  async onFileSelect(event: any) {

    // check if target file is bigger than 10 MB
    if (event.target.files[0].size <= 10485760) {

      // Check image length, image cannot empty
      if (event.target.files.length > 0) {
        this.fileImage = event.target.files[0];
        var reader = new FileReader();

        // Read file as data url
        reader.readAsDataURL(event.target.files[0]);

        // Called once readAsDataURL is completed
        reader.onload = async () => {
          this.urlImage = reader.result;
        }
        this.alreadyUpload = true;
      }

    } else {

      // Send message if data is to big
      const toBig = await this.AlertCtrl.create({
        mode: "ios",
        header: 'File Size is to Big',
        message: 'Please upload file below 10 Mb!',
        buttons: [
          {
            text: 'OK',
            handler: () => {
            }
          }
        ]
      });
      toBig.present();
    }
  }

  /**
   * Sign Up button is clicked and route repairman to Register Page.
   * This function will send the data into the API and return a value
   * to know if success or failed.
   */
  async signUp() {

    // create variable to store alertCtrl
    let alert: any;
    let respondNum: number;
    let alertHeader: string;
    let alertMessage: string;

    // Check if any input is empty
    if (
      this.fullname === "" ||
      this.employee_id === "" ||
      this.email === "" ||
      this.password === "" ||
      this.re_password === "" ||
      this.urlImage === null ||
      this.urlImage === undefined ||
      this.emailFalse ||
      this.passwordFalse
    ) {
      alertHeader = "Form not complete";
      alertMessage = "Please fill all form input include upload profile picture!";
    } else {

      // create loading screen
      await this.createLoadCtrl();

      // remove "data:image/jpeg;base64," from url
      let splitUrlImage = this.urlImage.split("base64,");
      let profile_picture = splitUrlImage[1];

      // Send data from API
      let register = await this.api.registerRepairman(
        this.fullname,
        this.email,
        this.password,
        this.re_password,
        this.employee_id,
        profile_picture
      );

      respondNum = register['RepsondNum'];
      alertMessage = register['Message'];
    }

    if (respondNum === 1) {
      alertHeader = "Registration complete"
      alertMessage = "Thank you, your registration form has been submitted!";
      this.navCtrl.back();
    } else {
      alertHeader = "Registration failed"
    }

    // make alert object
    alert = await this.AlertCtrl.create({
      mode: "ios",
      header: alertHeader,
      message: alertMessage,
      buttons: [
        {
          text: 'OK',
          handler: () => {  }
        }
      ]
    });
    
    // display the alert
    alert.present();

    // dismiss the loading screen
    this.dismissLoadCtrl();
  }

  /**
   * Check the input email address inside the form
   * with regex, it must have 'AT' symbol and domain.
   * 
   * @param email Email address being inputed and checked
   */
  checkEmail (email: string) {
    
    // regex logic for Email address
    let regexString = '[^@]+@[^\.\..+]+';
    let reg = new RegExp(regexString);

    // set emailFalse value with testing regex from input
    this.emailFalse = !reg.test(email);
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