import {Component, ViewChild} from '@angular/core';
import {IonSlides, ModalController} from '@ionic/angular';
import {DetailPage} from '../detail/detail.page';
import {DispenserAPIService} from 'src/app/services/DispenserAPI/dispenser-api.service';
import {PreferenceManagerService} from 'src/app/services/PreferenceManager/preference-manager.service';
import {UnitConverter} from 'src/app/classes/UnitConverter/unit-converter';
import {StaticVariables} from '../../classes/StaticVariables/static-variables';

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
  doneMissionList = null;
  todayMissionList = null;
  futureMissionList = null;

  missionTodayDate: string;
  fragmentTitle: string;
  device_id: string;
  employee_id: string;
  loadReady: boolean = false;
  currentTime: string;

  // constant array
  dayNameArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  monthNameArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Desember"];
  fragmentTitleArray = ["What I've Done", "Today's Mission", "Future"];

  constructor(
      public modalController: ModalController,
      private api: DispenserAPIService,
      private pref: PreferenceManagerService
  ) { }

  async ngOnInit() {

    // initialize
    this.loadReady = false;
    this.fragmentTitle = this.fragmentTitleArray[1];
    this.currentTime = UnitConverter.convertDateToApiTimeFormat(new Date());

    // dummy data
    this.device_id = "MA_03_01";
    this.employee_id = "1";

    let doneMissionRawData = await this.api.getAssignmentDone(this.device_id, this.employee_id);
    if (doneMissionRawData.length !== 0) {
      this.doneMissionList = await this.processDataDoneMission(doneMissionRawData);
    } else {
      this.doneMissionList = null;
    }

    let todayMissionRawData = await this.api.getAssignmentToday(this.device_id, this.employee_id, this.currentTime);

    if (todayMissionRawData.length !== 0) {
      this.todayMissionList = await this.processDataTodayMission(todayMissionRawData);
    } else {
      this.todayMissionList = null;
    }

    let futureMissionRawData = await this.api.getAssignmentNext(this.device_id, this.employee_id, this.currentTime);

    if (futureMissionRawData.length !== 0) {
      this.futureMissionList = await this.processDataFutureMission(futureMissionRawData);
    } else {
      this.futureMissionList = null;
    }

    this.loadReady = true;
  }

  /**
   * gETet the index of ion-slides when being
   * drag and changes slide occured by the user. Initial slide is 1
   * and will change the value to up or down based on user does.
   * Also this function is to choose the title of the Home page where
   * is it Done, Today, or Future mission.
   *
   * Using @ViewChild class to get detect slides index from HTML
   * and IonSlides to use getActiveIndex function.
   */
  @ViewChild('slides') slides: IonSlides;
  async slideChanges () {

    let index = await this.slides.getActiveIndex();
    this.fragmentTitle = this.fragmentTitleArray[index];
  }

  /**
   * Safe the Report Detail to Preference.
   */
  async setDetailReportToPref(data: any){
    await this.pref.setData(StaticVariables.KEY__DEVICE_ID, data['DeviceID']);
    await this.pref.setData(StaticVariables.KEY__DEVICE_TYPE, data['DeviceType']);
    await this.pref.setData(StaticVariables.KEY__EMPLOYEE_NAME, data['Repairman']);
    await this.pref.setData(StaticVariables.KEY__DEVICE_BUILDING_LOC, data['DeviceBuildingLocation']);
    await this.pref.setData(StaticVariables.KEY__DEVICE_PLACEMENT_LOC, data['DevicePlacementPosition']);
    await this.pref.setData(StaticVariables.KEY__PROBLEM_DESCRIPTION, data['ProblemDescription']);
  }

  /**
   * Display the modal for of every quest.
   */
  async openDetail(missionNumber: number, isDoneMission: boolean) {

    let missionList = [];
    let getMission: any;

    if (isDoneMission) {
      for (let i = 0 ; i < this.doneMissionList.length ; i++) {

        let dataInsideDoneMissionList = this.doneMissionList[i]['Data'];
        for (let j = 0 ; j < dataInsideDoneMissionList.length ; j++) {

          missionList.push(dataInsideDoneMissionList[j]);
        }
      }
    } else {
      missionList = this.todayMissionList['Data'];
    }

    for (let i = 0 ; i < missionList.length ; i++) {

      if (missionList[i]['MissionNumber'] === missionNumber) {
        getMission = missionList[i];
        break;
      }
    }

    await this.setDetailReportToPref(getMission);

    let buildNewMission = {
      'Date': this.missionTodayDate,
      'Data': getMission,
      'DoneMission': isDoneMission
    };

    const modal = await this.modalController.create({
      component: DetailPage,
      componentProps: buildNewMission,
      cssClass: 'my-custom-modal-css'
    });

    await modal.present();
  }

  /**
   * Get year, month, and date from API in String format
   * and return each of them in JSON format.
   * @param dateString
   * @returns new array of json contains date divided by day,
   * month, and year
   */
  static getDateDetail (dateString: string) {

    let splitDate = dateString.split(" ");
    let getDate = splitDate[0];

    let splitDateDetails = getDate.split("-");
    return {
      'Year': splitDateDetails[0],
      'Month': splitDateDetails[1],
      'Day': splitDateDetails[2]
    };
  }

  /**
   * Group by the quest order by the same date.
   * @param dataArray
   * @returns new array of json with grouping by date
   */
  static groupByDate (dataArray: any) {

    // initial date, month, year based on first data
    let lastDate = dataArray[0]['dateDetails']['Day'];
    let lastMonth = dataArray[0]['dateDetails']['Month'];
    let lastYear = dataArray[0]['dateDetails']['Year'];

    // initialize data array
    let arrayData = [];
    let arrayPerDate = [];

    for (let i = 0 ; i < dataArray.length ; i++) {

      let currentData = dataArray[i];

      let currentDate = currentData['dateDetails']['Day'];
      let currentMonth = currentData['dateDetails']['Month'];
      let currentYear = currentData['dateDetails']['Year'];

      if (
          currentDate === lastDate &&
          currentMonth === lastMonth &&
          currentYear === lastYear
      ) {
        arrayPerDate.push({
          "Data": currentData['Data'],
          "machineDetails": currentData['machineDetails']
        });
      } else {

        let dateDetails = dataArray[i-1]['dateDetails'];

        arrayData.push({
          "Data": arrayPerDate,
          dateDetails
        });

        arrayPerDate = [];
        arrayPerDate.push({
          "Data": currentData['Data'],
          "machineDetails": currentData['machineDetails']
        });

        lastDate = dataArray[i]['dateDetails']['Day'];
        lastMonth = dataArray[i]['dateDetails']['Month'];
        lastYear = dataArray[i]['dateDetails']['Year'];
      }
    }

    // after loop when last data still not included
    let dateDetails = dataArray[dataArray.length - 1]['dateDetails'];

    arrayData.push({
      "Data": arrayPerDate,
      dateDetails
    });

    return arrayData;
  }

  /**
   * Add after processed time stamp data into JSON.
   * @param Data Array of processed data.
   */
  addTimeToJSON (Data: any){
    let newDate = UnitConverter.convertApiTimeToDate(Data[0]['MissionTime']);
    let newDayString = this.dayNameArray[newDate.getDay()];
    let newMonthString = this.monthNameArray[newDate.getMonth()];
    let DateString = newMonthString + " " + newDate.getDate();

    return {
      "DateString": DateString ,
      "DayString": newDayString ,
      "Date": newDate ,
      "Data": Data
    };
  }

  /**
   * Add time stamp & machine detail to JSON.
   * @param dataJSON rawData from api.
   */
  async addDetailsToJSON(dataJSON: any){
    // add time stamp and machine details into json
    let dataAddOn = [];
    for (let i = 0 ; i < dataJSON.length ; i++) {
      let Data = dataJSON[i];
      let dateDetails = HomePage.getDateDetail(Data['RepairCallTime']);
      let machineDetails = await this.api.getDispenserDetail(Data['Device_ID']);

      let newJson = {
        dateDetails,
        Data,
        machineDetails
      };

      dataAddOn.push(newJson);
    }

    // grouping by date
    return dataAddOn;
  }

  /**
   * Process the data for Done Mission page.
   * @param dataJson The raw data for Done Mission page.
   */
  async processDataDoneMission (dataJson: any) {

    // grouping by date
    let dataAddDetails = await this.addDetailsToJSON(dataJson);
    let dataGroupingDate = await HomePage.groupByDate(dataAddDetails);

    // processing data into new json form
    let resultArray = [];
    for (let i = 0 ; i < dataGroupingDate.length ; i++) {
      let getObject = dataGroupingDate[i];
      let Data = [];

      for (let j = 0 ; j < getObject['Data'].length ; j++) {
        let getData = getObject['Data'][j]['Data'];
        let ReportImages = [];

        if (getData['Complete_Index'] === 3) {
          ReportImages.push({"ReportImage": UnitConverter.convertBase64ToImage(getData['Complete_Source'])});
          ReportImages.push({"ReportImage": UnitConverter.convertBase64ToImage(getData['Complete_Source2'])});
          ReportImages.push({"ReportImage": UnitConverter.convertBase64ToImage(getData['Complete_Source3'])});
        } else if (getData['Complete_Index'] === 2) {
          ReportImages.push({"ReportImage": UnitConverter.convertBase64ToImage(getData['Complete_Source'])});
          ReportImages.push({"ReportImage": UnitConverter.convertBase64ToImage(getData['Complete_Source2'])});
        } else if (getData['Complete_Index'] === 1) {
          ReportImages.push({"ReportImage": UnitConverter.convertBase64ToImage(getData['Complete_Source'])});
        }

        let MissionTimeOnlyHour = UnitConverter.convertDateStringToHourMinuteOnly(getData['RepairCallTime']);
        let newData = {
          "ClientName": "..." ,
          "ClientAddress": "..." ,
          "MissionTime": getData['RepairCallTime'] ,
          "MissionTimeOnlyHour": MissionTimeOnlyHour ,
          "ClientPhone": "..." ,
          "ClientContactPerson": "..." ,
          "DeviceID": "MA_04_01",
          "DeviceType": getObject['Data'][j]['machineDetails']['Type'] ,
          "DeviceNumber": "..." ,
          "DeviceBuildingLocation": "Management Building 4F",
          "DevicePlacementPosition": "next to the elevator",
          "ErrorCode": getData['ErrorType'] ,
          "ProblemDescription": getData['Description'] ,
          "NotificationTime": getData['NotifyTime'] ,
          "Repairman": getData['Maintainer'] ,
          "ClientNumber": "..." ,
          "MissionNumber": getData['MissionNumber'] ,
          "ReportIndex": getData['Complete_Index'] ,
          "ReportImages": ReportImages
        };

        Data.push(newData);
      }

      resultArray.push(this.addTimeToJSON(Data));
    }

    return resultArray;
  }

  /**
   * Process the data for Today Mission page.
   * @param dataJson The raw data for Today Mission.
   */
  async processDataTodayMission (dataJson: any) {

    let dataAddOn = await this.addDetailsToJSON(dataJson);

    // processing data into new json form
    let resultArray = [];
    for (let i = 0 ; i < dataAddOn.length ; i++) {
      let getObject = dataAddOn[i];

      let MissionTimeOnlyHour = UnitConverter.convertDateStringToHourMinuteOnly(getObject['Data']['RepairCallTime']);
      let newData = {
        "ClientName": "..." ,
        "ClientAddress": "..." ,
        "MissionTime": getObject['Data']['RepairCallTime'] ,
        "MissionTimeOnlyHour": MissionTimeOnlyHour ,
        "ClientPhone": "..." ,
        "ClientContactPerson": "..." ,
        "DeviceID": "...",
        "DeviceType": getObject['machineDetails']['Type'] ,
        "DeviceNumber": "..." ,
        "DeviceBuildingLocation": "...",
        "DevicePlacementPosition": "...",
        "ErrorCode": getObject['Data']['ErrorType'] ,
        "ProblemDescription": getObject['Data']['Description'] ,
        "NotificationTime": getObject['Data']['NotifyTime'] ,
        "Repairman": getObject['Data']['Maintainer'] ,
        "ClientNumber": "..." ,
        "MissionNumber": getObject['Data']['MissionNumber'] ,
      };

      resultArray.push(newData);
    }

    let newDate = this.monthNameArray[dataAddOn[0]['dateDetails']['Month'] - 1] + " " + dataAddOn[0]['dateDetails']['Day'];
    return {
      "Date": newDate,
      "Data": resultArray
    };
  }

  /**
   * Process the data for Future Mission page.
   * @param dataJson The raw data for Future Mission.
   */
  async processDataFutureMission(dataJson: any) {

    let dataAddDetails = await this.addDetailsToJSON(dataJson);
    let dataGroupingDate = await HomePage.groupByDate(dataAddDetails);

    // processing data into new json form
    let resultArray = [];
    for (let i = 0 ; i < dataGroupingDate.length ; i++) {
      let getObject = dataGroupingDate[i];
      let Data = [];

      for (let j = 0 ; j < getObject['Data'].length ; j++) {
        let getData = getObject['Data'][j]['Data'];

        let MissionTimeOnlyHour = UnitConverter.convertDateStringToHourMinuteOnly(getData['RepairCallTime']);
        let newData = {
          "ClientName": "..." ,
          "ClientAddress": "..." ,
          "MissionTime": getData['RepairCallTime'] ,
          "MissionTimeOnlyHour": MissionTimeOnlyHour ,
          "ClientPhone": "..." ,
          "ClientContactPerson": "..." ,
          "DeviceID": "...",
          "DeviceType": getObject['Data'][j]['machineDetails']['Type'] ,
          "DeviceNumber": "..." ,
          "DeviceBuildingLocation": "...",
          "DevicePlacementPosition": "...",
          "ErrorCode": getData['ErrorType'] ,
          "ProblemDescription": getData['Description'] ,
          "NotificationTime": getData['NotifyTime'] ,
          "Repairman": getData['Maintainer'] ,
          "ClientNumber": "..." ,
          "MissionNumber": getData['MissionNumber'] ,
        };

        Data.push(newData);
      }

      let newDate = UnitConverter.convertApiTimeToDate(Data[0]['MissionTime']);
      let newDayString = this.dayNameArray[newDate.getDay()];
      let newMonthString = this.monthNameArray[newDate.getMonth()];
      let DateString = newMonthString + " " + newDate.getDate();

      let newData = {
        "DateString": DateString ,
        "DayString": newDayString ,
        "Date": newDate ,
        "Data": Data
      };

      resultArray.push(newData);
    }

    return resultArray;
  }
}
