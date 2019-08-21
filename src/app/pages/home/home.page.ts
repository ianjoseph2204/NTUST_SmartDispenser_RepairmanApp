import {Component, ViewChild} from '@angular/core';
import {IonSlides, ModalController, NavController} from '@ionic/angular';
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
  slideOpts = { initialSlide: 1 };

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
  employee_picture_string = null;

  // constant array
  dayNameArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  monthNameArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Desember"];
  fragmentTitleArray = ["What I've Done", "Today's Mission", "Future"];

  constructor(
      private navCtrl: NavController,
      public modalController: ModalController,
      private api: DispenserAPIService,
      private pref: PreferenceManagerService
  ) { }

  async ngOnInit() {

    // initialize
    this.loadReady = false;
    this.fragmentTitle = this.fragmentTitleArray[1];
    this.currentTime = UnitConverter.convertDateToApiTimeFormat(new Date());

    // get id from preference
    this.employee_id = await this.pref.getData(StaticVariables.KEY__LOGIN_EMPLOYEE_ID);

    if (this.employee_id !== null) {
      
      // set profile
      await this.api.getRepairmanProfile(this.employee_id).then((getProfile) => {
        if (getProfile['Picture'] !== null) {
          this.employee_picture_string = UnitConverter.convertBase64ToImage(getProfile['Picture']);
        }
      });

      // set Done Mission
      let doneMissionRawData = await this.api.getAssignmentDone(this.employee_id);
      if (doneMissionRawData.length !== 0) {
        this.doneMissionList = await this.processDataDoneMission(doneMissionRawData);
      } else {
        this.doneMissionList = null;
      }    

      // set Today Mission
      let todayMissionRawData = await this.api.getAssignmentToday(this.employee_id, this.currentTime);
      if (todayMissionRawData.length !== 0) {
        this.todayMissionList = await this.processDataTodayMission(todayMissionRawData);
      } else {
        this.todayMissionList = null;
      }

      // set Future Mission
      let futureMissionRawData = await this.api.getAssignmentNext(this.employee_id, this.currentTime);
      if (futureMissionRawData.length !== 0) {
        this.futureMissionList = await this.processDataFutureMission(futureMissionRawData);
      } else {
        this.futureMissionList = null;
      }

    } else {

      // set profile to null
      this.employee_id = null;
      this.employee_picture_string = null;

      // set all missions to null
      this.doneMissionList = null;
      this.todayMissionList = null;
      this.futureMissionList = null;
    }

    this.loadReady = true;
  }

  /**
   * Route the repairman to go to profile page
   */
  profile() {
    this.navCtrl.navigateForward(['profile']);
  }

  /**
   * Get the index of ion-slides when being
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
   * Sort the array by using Date, only for missions because parameter
   * being used is dateInDateClass inside the JSON object after each
   * data has been added some details by addDetailsToJSON function.
   * 
   * @param myArray       Data array being to sort, it will globally affect
   * @param isFromLatest  Boolean value to check the sorting point of view
   */
  async sortFunction (myArray: any, isFromLatest: boolean) {
    await myArray.sort((a: any, b: any) => {
      let dateA = new Date(a['dateInDateClass']), dateB = new Date(b['dateInDateClass']);
  
      if (isFromLatest){

        // sort from the latest Date
        if (dateB > dateA)
          return 1;
        if (dateB < dateA)
          return -1;
      } else {

        // sort from the newest Date
        if (dateB < dateA)
          return 1;
        if (dateB > dateA)
          return -1;
      }

      return 0;
    });
  }

  /**
   * Safe the Report Detail to Preference, triggered when the repairman
   * click one of the missions in today missions list.
   * 
   * @param   data    Data from mission
   */
  async setDetailReportToPref(data: any){
    await this.pref.setData(StaticVariables.KEY__DEVICE_ID, data['DeviceID']);
    await this.pref.setData(StaticVariables.KEY__DEVICE_TYPE, data['DeviceType']);
    await this.pref.setData(StaticVariables.KEY__EMPLOYEE_NAME, data['Repairman']);
    await this.pref.setData(StaticVariables.KEY__DEVICE_BUILDING_LOC, data['DeviceBuildingLocation']);
    await this.pref.setData(StaticVariables.KEY__DEVICE_PLACEMENT_LOC, data['DevicePlacementPosition']);
    await this.pref.setData(StaticVariables.KEY__PROBLEM_DESCRIPTION, data['ProblemDescription']);
    await this.pref.setData(StaticVariables.KEY__MISSION_NUMBER, data['MissionNumber'])
  }

  /**
   * Open mission detail as Modal page, a small pop-up page without route
   * the repairman into another page, that display the detail mission
   * information. This is used in today missions and done missions.
   * 
   * @param missionNumber The mission number to fetch information from API
   * @param isDoneMission Boolean identification which is from Today or Done Mission page
   */
  async openDetail(mission: any, isDoneMission: boolean) {

    // set some details to preference for complete/uncomplete the mission
    await this.setDetailReportToPref(mission);

    // create object property for Modal page
    let buildNewMission = {
      'Date': await UnitConverter.convertApiTimeToDate(mission['MissionTime']),
      'Data': mission,
      'DoneMission': isDoneMission
    };

    // create the modal page
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
   * 
   * @param   dateString  Date in string format "YEAR-MONTH-DATE HOUR:MINUTE:SECOND"
   * 
   * @returns JSON        Json object of year, month, dan date
   * 
   * @example
   * 
   * {
   *    "Year": 2019,
   *    "Month": 1,
   *    "Day": 21
   * }
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
   * Group the missions into the same date, use this only for 
   * done and future missions. This function will return the list
   * of missions.
   * 
   * @param   dataArray   Array of missions
   * 
   * @returns JSON        Json array of missions with grouped by Date
   * 
   * @example
   * 
   * [
   *    {
   *        "dateDetails": {
   *            "Day": 21,
   *            "Month": 11,
   *            "Year": 2019,
   *        },
   *        "Data": {
   *            [
   *                { ... },
   *                { ... },
   *                ...
   *            ]
   *        }
   *    },
   * 
   *    ...
   * ]
   */
  static groupByDate (dataArray: any) {

    // initial date, month, year based on first data
    let lastDate = dataArray[0]['dateDetails']['Day'];
    let lastMonth = dataArray[0]['dateDetails']['Month'];
    let lastYear = dataArray[0]['dateDetails']['Year'];

    // initialize data array
    let arrayData = [];
    let arrayPerDate = [];

    // for every data inside the parameter
    for (let i = 0 ; i < dataArray.length ; i++) {

      // set current data from array
      let currentData = dataArray[i];
      let currentDate = currentData['dateDetails']['Day'];
      let currentMonth = currentData['dateDetails']['Month'];
      let currentYear = currentData['dateDetails']['Year'];

      // check if it has the same as last Date (Y, M, D) stored
      if (
          currentDate === lastDate &&
          currentMonth === lastMonth &&
          currentYear === lastYear
      ) {

        // push data into arrayPerDate
        arrayPerDate.push({
          "Data": currentData['Data'],
          "machineDetails": currentData['machineDetails']
        });
      } else {

        // if not same then set dateDetails as the last being checked
        let dateDetails = dataArray[i-1]['dateDetails'];

        // push the data into new group array with same date
        arrayData.push({
          "Data": arrayPerDate,
          dateDetails
        });

        // clear the arrayPerDate first
        arrayPerDate = [];

        // then push current data into arrayPerDate
        arrayPerDate.push({
          "Data": currentData['Data'],
          "machineDetails": currentData['machineDetails']
        });

        // set new last Date (Y, M, D)
        lastDate = dataArray[i]['dateDetails']['Day'];
        lastMonth = dataArray[i]['dateDetails']['Month'];
        lastYear = dataArray[i]['dateDetails']['Year'];
      }
    }

    // after loop when last data still not included
    let dateDetails = dataArray[dataArray.length - 1]['dateDetails'];

    // push the last data into arrayPerDate
    arrayData.push({
      "Data": arrayPerDate,
      dateDetails
    });

    return arrayData;
  }

  /**
   * Adding the time details to JSON, this will include the Date in
   * string format, the name of the Day, e.g. Saturday or Tuesday,
   * Date in Date classformat, and the data being fetched. This
   * function will return new JSON with added time details.
   * 
   * @param   Data    Json object to be added by time details
   * 
   * @returns JSON    New Json object which has been added by time details
   * 
   * @example
   * 
   * {
   *    "DateString": "August 20" ,
   *    "DayString": "Tuesday" ,
   *    "Date": ... ,
   *    "Data": [ ... ]
   * }
   */
  addTimeToJSON (Data: any){

    // create new Date class object using the date from MissionTime
    let newDate = UnitConverter.convertApiTimeToDate(Data[0]['MissionTime']);

    // create new Day name based on array
    let newDayString = this.dayNameArray[newDate.getDay()];

    // create new Month name based on array
    let newMonthString = this.monthNameArray[newDate.getMonth()];

    // create new Date in string format
    let DateString = newMonthString + " " + newDate.getDate();

    return {
      "DateString": DateString ,
      "DayString": newDayString ,
      "Date": newDate ,
      "Data": Data
    };
  }

  /**
   * Add some details into JSON object, this will include Date details
   * and Machine details, e.g. type, location, and the data itself. This
   * function will return new Json object.
   * 
   * @param   dataJSON    Data in json array format
   * 
   * @returns JSON array  New data has been added by Date and Machine details
   * 
   * @example
   * 
   * [
   *    {
   *        "dateDetails": { ... },
   *        "Data": { ... },
   *        "machineDetails": { ... }
   *    },
   * 
   *    ...
   * ]
   */
  async addDetailsToJSON(dataJSON: any){
    
    let dataAddOn = [];

    // for every data inside dataJSON array
    for (let i = 0 ; i < dataJSON.length ; i++) {
      let Data = dataJSON[i];
      
      // create new Date details
      let dateDetails = HomePage.getDateDetail(Data['RepairCallTime']);

      // create new Machine details
      let machineDetails = await this.api.getDispenserDetail(Data['Device_ID']);

      let dateInDateClass = UnitConverter.convertApiTimeToDate(Data['RepairCallTime']);

      let newJson = {
        dateInDateClass,
        dateDetails,
        Data,
        machineDetails
      };

      dataAddOn.push(newJson);
    }

    return dataAddOn;
  }

  /**
   * Function to process data for Done Mission, it will need raw data
   * from Done Mission API and will return the result that ready to
   * be displayed.
   * 
   * @param   dataJson    Raw data from Done Mission API
   * 
   * @returns JSON array  Result data which ready to be displayed
   */
  async processDataDoneMission (dataJson: any) {

    // add some details to each data
    let dataAddDetails = await this.addDetailsToJSON(dataJson);

    // sort the array from the latest
    await this.sortFunction(dataAddDetails, true);

    // group the data into the same Date
    let dataGroupingDate = await HomePage.groupByDate(dataAddDetails);

    // for every data being processed will put into resultArray array
    let resultArray = [];
    for (let i = 0 ; i < dataGroupingDate.length ; i++) {

      // fetch data from same group
      let getObject = dataGroupingDate[i];
      let Data = [];

      // for every data inside the same group will put into Data array
      for (let j = 0 ; j < getObject['Data'].length ; j++) {
        let getData = getObject['Data'][j]['Data'];
        let ReportImages = [];

        // put the Complete Picture from three attributes into one array
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
          "ClientName": getData['Name'] ,
          "ClientAddress": getData['Address'] ,
          "MissionTime": getData['RepairCallTime'] ,
          "MissionTimeOnlyHour": MissionTimeOnlyHour ,
          "ClientPhone": getData['Tel'] ,
          "ClientContactPerson": getData['Name'] ,
          "DeviceID": getData['Device_ID'],
          "DeviceType": getData['Type'] ,
          "DeviceBuildingLocation": getData['Building'] ,
          "DevicePlacementPosition": getData['Position'] ,
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
   * Function to process data for Today Mission, it will need raw data
   * from Today Mission API and will return the result that ready to
   * be displayed.
   * 
   * @param   dataJson      Raw data from Today Mission API
   * 
   * @returns JSON object   Result data which ready to be displayed
   */
  async processDataTodayMission (dataJson: any) {

    // add some details to each data
    let dataAddOn = await this.addDetailsToJSON(dataJson);
    
    // sort the array from the newest
    await this.sortFunction(dataAddOn, false);

    // for every data being processed will put into resultArray array
    let resultArray = [];
    for (let i = 0 ; i < dataAddOn.length ; i++) {
      let getObject = dataAddOn[i]['Data'];

      let MissionTimeOnlyHour = UnitConverter.convertDateStringToHourMinuteOnly(getObject['RepairCallTime']);
      let newData = {
        "ClientName": getObject['Name'] ,
        "ClientAddress": getObject['Address'] ,
        "MissionTime": getObject['RepairCallTime'] ,
        "MissionTimeOnlyHour": MissionTimeOnlyHour ,
        "ClientPhone": getObject['Tel'] ,
        "ClientContactPerson": getObject['Name'] ,
        "DeviceID": getObject['Device_ID'],
        "DeviceType": getObject['Type'] ,
        "DeviceBuildingLocation": getObject['Building'] ,
        "DevicePlacementPosition": getObject['Position'] ,
        "ErrorCode": getObject['ErrorType'] ,
        "ProblemDescription": getObject['Description'] ,
        "NotificationTime": getObject['NotifyTime'] ,
        "Repairman": getObject['Maintainer'] ,
        "ClientNumber": "..." ,
        "MissionNumber": getObject['MissionNumber'] ,
      };

      resultArray.push(newData);
    }

    // create new Date for Today Mission and add to become new Json object
    let newDate = this.monthNameArray[dataAddOn[0]['dateDetails']['Month'] - 1] + " " + dataAddOn[0]['dateDetails']['Day'];
    return {
      "Date": newDate,
      "Data": resultArray
    };
  }

  /**
   * Function to process data for Done Mission, it will need raw data
   * from Done Mission API and will return the result that ready to
   * be displayed.
   * 
   * @param   dataJson    Raw data from Done Mission API
   * 
   * @returns JSON array  Result data which ready to be displayed
   */
  async processDataFutureMission(dataJson: any) {

    // add some details to each data
    let dataAddDetails = await this.addDetailsToJSON(dataJson);

    // sort the array from the newest
    await this.sortFunction(dataAddDetails, false);

    // group the data into the same Date
    let dataGroupingDate = await HomePage.groupByDate(dataAddDetails);

    // for every data being processed will put into resultArray array
    let resultArray = [];
    for (let i = 0 ; i < dataGroupingDate.length ; i++) {

      // fetch data from same group
      let getObject = dataGroupingDate[i];
      let Data = [];

      // for every data inside the same group will put into Data array
      for (let j = 0 ; j < getObject['Data'].length ; j++) {
        let getData = getObject['Data'][j]['Data'];

        let MissionTimeOnlyHour = UnitConverter.convertDateStringToHourMinuteOnly(getData['RepairCallTime']);
        let newData = {
          "ClientName": getData['Name'] ,
          "ClientAddress": getData['Address'] ,
          "MissionTime": getData['RepairCallTime'] ,
          "MissionTimeOnlyHour": MissionTimeOnlyHour ,
          "ClientPhone": getData['Tel'] ,
          "ClientContactPerson": getData['Name'] ,
          "DeviceID": getData['Device_ID'],
          "DeviceType": getData['Type'] ,
          "DeviceBuildingLocation": getData['Building'] ,
          "DevicePlacementPosition": getData['Position'] ,
          "ErrorCode": getData['ErrorType'] ,
          "ProblemDescription": getData['Description'] ,
          "NotificationTime": getData['NotifyTime'] ,
          "Repairman": getData['Maintainer'] ,
          "ClientNumber": "..." ,
          "MissionNumber": getData['MissionNumber'] ,
        };

        Data.push(newData);
      }
      
      resultArray.push(await this.addTimeToJSON(Data));
    }

    return resultArray;
  }
}
