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

  ngOnInit () {
    console.log(this.data);
    console.log(this.doneMission);
  }

  dismiss () {
    this.modalController.dismiss();
  }

  arrived () {
    this.getDeviceIdFromQRCode();
  }
s
  wantToClearMission (isMissionDone: boolean) {
    console.log(isMissionDone);
  }

  getDeviceIdFromQRCode(){
    let url = "https://smartcampus.et.ntust.edu.tw:5000/dashboard/MA_04_01";

    const words = url.split('/');
    console.log(words);

    let device_id = words[words.length - 1];
    console.log("device id: " + device_id);
  }
}
