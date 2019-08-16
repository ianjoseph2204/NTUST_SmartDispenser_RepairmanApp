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

  async onFileSelect(event: any) {

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
      this.urlImage === undefined
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

  checkEmail (email) {

  }

  checkPassword (password) {
    
  }
}