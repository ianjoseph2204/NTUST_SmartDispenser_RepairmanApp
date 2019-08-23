import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController, ToastController, NavController } from '@ionic/angular';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';
import { PreferenceManagerService } from 'src/app/services/PreferenceManager/preference-manager.service';
import { StaticVariables } from 'src/app/classes/StaticVariables/static-variables';
import { LoginSessionService } from 'src/app/services/LoginSession/login-session.service';
// import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  data: any;
  doneMission: boolean;
  disabledButton: boolean;
  inputCamera = false;
  arrived: boolean = null;
  image: any = [];
  reader: any = [];

  // loadCtrl var
  makeLoading: any;

  constructor(
    public navParams: NavParams,
    private navCtrl: NavController,
    private modalController: ModalController,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private api: DispenserAPIService,
    private pref: PreferenceManagerService,
    private chk: LoginSessionService,
    // private callNumber: CallNumber
  ) {
    this.data = navParams.get('Data');
    this.doneMission = navParams.get('DoneMission');
    this.disabledButton = navParams.get('Disabled');
  }

  ngOnInit () {
    this.arrived = false;
  }

  ionViewDidEnter () {
    this.chk.blockToInternalPages();
    if (this.data['ArriveTime'] !== "") {
      this.arrived = true;
    } else {
      this.arrived = false;
    }    
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

  dismiss () {
    this.modalController.dismiss();
  }

  setArrival () {
    this.openQRCodeScanner();
  }

  openQRCodeScanner(){
    this.navCtrl.navigateForward(['qrcode-scanner']);
  }

  async repairmanArrived () {
    
    // create loading screen
    await this.createLoadCtrl();

    let myToast: any;
    let toastMessage: string;
    let missionNum = this.data['MissionNumber'];
    
    let result = await this.api.repairmanHasArrived(missionNum);
    if (result === 1) {
      this.arrived = true;
      toastMessage = "You have successfully arrived on this mission!";
      StaticVariables.MISSION_UPDATE = true;
    } else {
      toastMessage = "Failed to arrived on this mission, please try again!";
    }

    // create Toast with myToastMessage as message display
    myToast = await this.toastCtrl.create({
      message: toastMessage,
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

  getDeviceIdFromQRCode(){

    let url = "";

    const words = url.split('/');
    console.log(words);

    let device_id = words[words.length - 1];
    console.log("device id: " + device_id);
  }

  async wantToClearMission (isMissionDone: boolean) {
    await this.dismiss();
    await this.pref.setData(StaticVariables.KEY__MISSION_DONE_UNDONE__BOOLEAN, isMissionDone);
    this.navCtrl.navigateForward(['report-repair']);
  }

  // callClient (phoneNumber: string) {
  //   this.callNumber.callNumber(phoneNumber, true);
  // }
}
