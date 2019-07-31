import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailPage } from '../detail/detail.page';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';
import { PreferenceManagerService } from 'src/app/services/PreferenceManager/preference-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // initial configuration for ion-slide
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  // field variable
  doneMissionList = [];
  todayMissionList: any;
  nextMissionList = [];
  todayDate: any;
  missionTodayDate: string;

  // constant array
  monthNameArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Desember"];

  constructor(
    public modalController: ModalController,
    private api: DispenserAPIService,
    private pref: PreferenceManagerService
  ) { }

  ngOnInit() {

    // initialize current date
    this.todayDate = new Date();
    this.missionTodayDate = (this.monthNameArray[this.todayDate.getMonth()] + " " + this.todayDate.getDate()).toUpperCase();    
    let tempArray = [];

    // create dummy item for today mission
    for (let i = 0 ; i < 3 ; i++) {

      let number = i + 1;
      let month = this.todayDate.getMonth() + 1;

      let item = {
        'ClientName': "Client No.00" + number,
        'ClientAddress': "Taipei, Keelung Rd. No. " + number,
        'MissionTime': this.todayDate.getFullYear() + "-" + month + "-" + this.todayDate.getDate() + " " + "23:59:59",
        'MissionTimeOnlyHour': "23:59",
        'ClientPhone': "+886 123 345 90" + number,
        'ClientContactPerson': "Mr. 00" + number,
        'MachineType': "UN-1321AG-" + number + "-L",
        'MachineNumber': "45670" + number,
        'ErrorCode': "1",
        'ProblemOccured': "Your Lie in April 1st",
        'NotificationTime': "2019-30-29 11:41:00",
        'Repairman': "198503302003121001",
        'ClientNumber': "13240" + number,
        'MissionNumber': "05"+ number
      };

      tempArray.push(item);
    }

    this.todayMissionList = {
      'Date': this.missionTodayDate,
      'Data': tempArray
    };
  }

  /**
   * This function is to display modal for every item
   */
  async openDetail(missionNumber: number) {

    let missionList = this.todayMissionList['Data'];
    let getMission: any;

    for (let i = 0 ; i < missionList.length ; i++) {

      if (missionList[i]['MissionNumber'] === missionNumber) {
        getMission = missionList[i];
        break;
      }
    }

    let buildNewMission = {
      'Date': this.missionTodayDate,
      'Data': getMission
    }

    const modal = await this.modalController.create({
      component: DetailPage,
      componentProps: buildNewMission,
      cssClass: 'my-custom-modal-css'
    });

    modal.present();
  }

}
