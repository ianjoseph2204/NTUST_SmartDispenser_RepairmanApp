import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { NavController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  data: any;
  doneMission: boolean;
  Arrived = false;
  inputCamera = false;

  image: any = [];
  reader: any = [];

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public navCtrl: NavController
  ) {
    this.data = navParams.get('Data');
    this.doneMission = navParams.get('DoneMission');
  }

  ngOnInit() {
    console.log(this.data);
    console.log(this.doneMission);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  arrived() {
    this.Arrived = true;
  }

  applyForComponent() {
  }

  completeRepair() {
    //this.inputCamera = true;
    this.dismiss();
    this.navCtrl.navigateForward(['report-repair']);
  }

  uploadImage(event) { // called each time file input changes

    console.log(event.target.files.FileList);
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.reader[i] = new FileReader();
        this.reader[i].readAsDataURL(event.target.files[i]); // read file as data url
        this.reader[i].onload = (event) => { // called once readAsDataURL is completed
          this.image[i] = this.reader[i].result;
        }
      }
      console.log(this.image);
    }
  }
}

class DetailPageImpl extends DetailPage {
}
