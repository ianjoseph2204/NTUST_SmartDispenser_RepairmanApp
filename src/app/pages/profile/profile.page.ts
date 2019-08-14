import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
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
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Sign Out',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    
    myAlert.present();
  }
}