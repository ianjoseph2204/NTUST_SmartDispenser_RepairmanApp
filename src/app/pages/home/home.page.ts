import {Component, ViewChild} from '@angular/core';
import {IonSlides, ModalController} from '@ionic/angular';
import {DetailPage} from '../detail/detail.page';
import {DispenserAPIService} from 'src/app/services/DispenserAPI/dispenser-api.service';
import {PreferenceManagerService} from 'src/app/services/PreferenceManager/preference-manager.service';
import {UnitConverter} from 'src/app/classes/UnitConverter/unit-converter';

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

  todayDate: any;
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

  /**
   * This function is to get the index of ion-slides when being
   * drag and changes slide occured by the user. Initial slide is 1
   * and will change the value to up or down based on user does.
   * Also this function is to choose the title of the Home page where
   * is it Done, Today, or Future mission.
   * 
   * Using @ViewChild class to get detect slides index from HTML
   * and IonSlides to use getActiveIndex function.
   */
  @ViewChild('slides') slides: IonSlides
  async slideChanges () {
    
    let index = await this.slides.getActiveIndex();
    this.fragmentTitle = this.fragmentTitleArray[index];
  }
  
  /**
   * This function is to display modal for every item
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
   * This function is to get year, month, and date from API
   * with string format and return each of them in JSON
   * format.
   * 
   * @param dateString 
   * 
   * @returns new array of json contains date divided by day, 
   * month, and year
   */
  getDateDetail (dateString: string) {

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
   * 
   * @param dataArray 
   * 
   * @returns new array of json with grouping by date
   */
  groupByDate (dataArray: any) {

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

  async ngOnInit() {    

    // initialize
    this.loadReady = false;
    this.fragmentTitle = this.fragmentTitleArray[1];
    this.currentTime = UnitConverter.convertDateToApiTimeFormat(new Date());

    // dummy data
    this.device_id = "MA_03_01";
    this.employee_id = "1";    

    ///////////////////////////////////////////
    // SET TEST 1                            //
    ///////////////////////////////////////////

    // get raw data
    // let doneMissionRawData = this.getRawDataDoneMission(this.device_id);
    // let todayMissionRawData = this.getRawDataTodayMission(this.device_id);
    // let futureMissionRawData = this.getRawDataFutureMission(this.device_id);

    // process the data
    // let processedDoneMission = await this.processDataDoneMission(doneMissionRawData['Data']);
    // console.log(processedDoneMission);

    // let processedTodayMission = await this.processDataTodayMission(todayMissionRawData['Data']);
    // console.log(processedTodayMission);

    // let processedFutureMission = await this.processDataFutureMission(futureMissionRawData['Data']);
    // console.log(processedFutureMission);

    // this.setDataNext();
    // this.setDataToday();
    // this.setDataDone();

    ///////////////////////////////////////////
    // SET TEST 2                            //
    ///////////////////////////////////////////

    let doneMissionRawData = await this.api.getAssignmentDone(this.device_id, this.employee_id);
    if (doneMissionRawData.length !== 0) {
      this.doneMissionList = await this.processDataDoneMission(doneMissionRawData);
    } else {
      this.doneMissionList = null;
    }

    let todayMissionRawData = await this.api.getAssignmentToday(this.device_id, this.employee_id, this.currentTime);
    console.log(todayMissionRawData);
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
   * 
   * @param dataJson 
   */
  async processDataDoneMission (dataJson: any) {
    
    // add time stamp and machine details into json
    let dataAddOn = [];
    for (let i = 0 ; i < dataJson.length ; i++) {
      let Data = dataJson[i];
      let dateDetails = this.getDateDetail(Data['RepairCallTime']);
      let machineDetails = await this.api.getDispenserDetail(Data['Device_ID']);
      
      let newJson = {
        dateDetails,
        Data,
        machineDetails
      };

      dataAddOn.push(newJson);
    }
    
    // grouping by date
    let dataGroupingDate = this.groupByDate(dataAddOn);
    
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
          "MachineType": getObject['Data'][j]['machineDetails']['Type'] ,
          "MachineNumber": "..." ,
          "ErrorCode": getData['ErrorType'] ,
          "ProblemOccured": getData['Description'] ,
          "NotificationTime": getData['NotifyTime'] ,
          "Repairman": getData['Maintainer'] ,
          "ClientNumber": "..." ,
          "MissionNumber": getData['MissionNumber'] ,
          "ReportIndex": getData['Complete_Index'] ,
          "ReportImages": ReportImages
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

  /**
   * 
   * @param dataJson 
   */
  async processDataTodayMission (dataJson: any) {

    // add time stamp and machine details into json
    let dataAddOn = [];
    for (let i = 0 ; i < dataJson.length ; i++) {
      let Data = dataJson[i];
      let dateDetails = this.getDateDetail(Data['RepairCallTime']);
      let machineDetails = await this.api.getDispenserDetail(Data['Device_ID']);
      
      let newJson = {
        dateDetails,
        Data,
        machineDetails
      };

      dataAddOn.push(newJson);
    }

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
        "MachineType": getObject['machineDetails']['Type'] ,
        "MachineNumber": "..." ,
        "ErrorCode": getObject['Data']['ErrorType'] ,
        "ProblemOccured": getObject['Data']['Description'] ,
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
   * 
   * @param dataJson 
   */
  async processDataFutureMission(dataJson: any) {
    
    // add time stamp and machine details into json
    let dataAddOn = [];
    for (let i = 0 ; i < dataJson.length ; i++) {
      let Data = dataJson[i];
      let dateDetails = this.getDateDetail(Data['RepairCallTime']);
      let machineDetails = await this.api.getDispenserDetail(Data['Device_ID']);
      
      let newJson = {
        dateDetails,
        Data,
        machineDetails
      };

      dataAddOn.push(newJson);
    }
    
    // grouping by date
    let dataGroupingDate = this.groupByDate(dataAddOn);
    
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
          "MachineType": getObject['Data'][j]['machineDetails']['Type'] ,
          "MachineNumber": "..." ,
          "ErrorCode": getData['ErrorType'] ,
          "ProblemOccured": getData['Description'] ,
          "NotificationTime": getData['NotifyTime'] ,
          "Repairman": getData['Maintainer'] ,
          "ClientNumber": "..." ,
          "MissionNumber": getData['MissionNumber'] ,
        }

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
