import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
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

  constructor(
    private NavCtrl: NavController,
    private AlertCtrl: AlertController,
    private api: DispenserAPIService
  ) { }

  ngOnInit() {
  }

  backFunc () {
    this.NavCtrl.back();
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

      if (register['RepsondNum'] === 1) {
        alertHeader = "Registration complete"
        alertMessage = "Thank you, your registration form has been submitted!";
      } else {
        alertHeader = "Registration failed"
        alertMessage = register['Message'];
      }
      
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
  }

  checkEmail (email) {

  }

  checkPassword (password) {
    
  }
}