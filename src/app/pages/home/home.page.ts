import { Component, ViewChild } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
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
    initialSlide: 1
  };

  // field variable
  doneMissionList = [];
  todayMissionList: any;
  futureMissionList = [];
  todayDate: any;
  missionTodayDate: string;
  fragmentTitle: string;

  // constant array
  monthNameArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Desember"];
  fragmentTitleArray = ["What I've Done", "Today's Mission", "Future"];

  constructor(
    public modalController: ModalController,
    private api: DispenserAPIService,
    private pref: PreferenceManagerService
  ) { }

  ngOnInit() {

    this.fragmentTitle = this.fragmentTitleArray[1];

    this.setDataNext();
    this.setDataToday();
  }

  async setDataNext () {

    // initialize
    let data = [
      {
        'DateString': "August 1",
        'DayString': "Thursday",
        'Date': "...",
        'Data': [
          {
            'ClientName': "Client No. 001",
            'ClientAddress': "Taipei, Keelung Rd. No. 01",
            'MissionTime': "2019-07-01 12:00:00",
            'MissionTimeOnlyHour': "12:00",
            'ClientPhone': "+886 123 345 901",
            'ClientContactPerson': "Mr. 010",
            'MachineType': "UN-1321AG-1-L",
            'MachineNumber': "456701",
            'ErrorCode': "1",
            'ProblemOccured': "Your Lie in April 1st",
            'NotificationTime': "2019-30-29 11:41:00",
            'Repairman': "198503302003121001",
            'ClientNumber': "132401",
            'MissionNumber': "051"
          },
          {
            'ClientName': "Client No. 002",
            'ClientAddress': "Taipei, Keelung Rd. No. 02",
            'MissionTime': "2019-07-01 18:00:00",
            'MissionTimeOnlyHour': "18:00",
            'ClientPhone': "+886 123 345 902",
            'ClientContactPerson': "Mr. 020",
            'MachineType': "UN-1321AG-1-L",
            'MachineNumber': "456701",
            'ErrorCode': "1",
            'ProblemOccured': "Your Lie in April 1st",
            'NotificationTime': "2019-30-29 11:41:00",
            'Repairman': "198503302003121001",
            'ClientNumber': "132402",
            'MissionNumber': "052"
          }
        ]
      },
      {
        'DateString': "August 3",
        'DayString': "Saturday",
        'Date': "...",
        'Data': [
          {
            'ClientName': "Client No. 003",
            'ClientAddress': "Taipei, Keelung Rd. No. 03",
            'MissionTime': "2019-07-01 15:00:00",
            'MissionTimeOnlyHour': "15:00",
            'ClientPhone': "+886 123 345 903",
            'ClientContactPerson': "Mr. 030",
            'MachineType': "UN-1321AG-1-L",
            'MachineNumber': "456701",
            'ErrorCode': "1",
            'ProblemOccured': "Your Lie in April 1st",
            'NotificationTime': "2019-30-29 11:41:00",
            'Repairman': "198503302003121001",
            'ClientNumber': "132403",
            'MissionNumber': "053"
          }
        ]
      },
      {
        'DateString': "August 4",
        'DayString': "Sunday",
        'Date': "...",
        'Data': [
          {
            'ClientName': "Client No. 004",
            'ClientAddress': "Taipei, Keelung Rd. No. 04",
            'MissionTime': "2019-07-01 12:00:00",
            'MissionTimeOnlyHour': "12:00",
            'ClientPhone': "+886 123 345 904",
            'ClientContactPerson': "Mr. 040",
            'MachineType': "UN-1321AG-1-L",
            'MachineNumber': "456701",
            'ErrorCode': "1",
            'ProblemOccured': "Your Lie in April 1st",
            'NotificationTime': "2019-30-29 11:41:00",
            'Repairman': "198503302003121001",
            'ClientNumber': "132404",
            'MissionNumber': "054"
          },
          {
            'ClientName': "Client No. 005",
            'ClientAddress': "Taipei, Keelung Rd. No. 05",
            'MissionTime': "2019-07-01 10:00:00",
            'MissionTimeOnlyHour': "10:00",
            'ClientPhone': "+886 123 345 905",
            'ClientContactPerson': "Mr. 050",
            'MachineType': "UN-1321AG-1-L",
            'MachineNumber': "456701",
            'ErrorCode': "1",
            'ProblemOccured': "Your Lie in April 1st",
            'NotificationTime': "2019-30-29 11:41:00",
            'Repairman': "198503302003121001",
            'ClientNumber': "132405",
            'MissionNumber': "055"
          }
        ]
      }
    ]

    this.futureMissionList = data;
  }

  setDataToday () {
    
    // initialize current date
    this.todayDate = new Date();
    this.missionTodayDate = (this.monthNameArray[this.todayDate.getMonth()] + " " + this.todayDate.getDate()).toUpperCase();    
    let tempArray = [];

    // create dummy item for today mission
    for (let i = 0 ; i < 5 ; i++) {

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

  @ViewChild('slides') slides: IonSlides
  async slideChanges () {
    
    let index = await this.slides.getActiveIndex();
    this.fragmentTitle = this.fragmentTitleArray[index];
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
