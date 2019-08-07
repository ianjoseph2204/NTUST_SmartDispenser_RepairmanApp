import { Component, ViewChild } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
import { DetailPage } from '../detail/detail.page';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';
import { PreferenceManagerService } from 'src/app/services/PreferenceManager/preference-manager.service';
import { UnitConverter } from 'src/app/classes/UnitConverter/unit-converter';

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
    }

    const modal = await this.modalController.create({
      component: DetailPage,
      componentProps: buildNewMission,
      cssClass: 'my-custom-modal-css'
    });

    modal.present();
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
    let result = {
      'Year': splitDateDetails[0],
      'Month': splitDateDetails[1],
      'Day': splitDateDetails[2]
    }

    return result;
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
    if (doneMissionRawData !== []) {
      this.doneMissionList = await this.processDataDoneMission(doneMissionRawData);
    } else {
      this.doneMissionList = null;
    }

    let todayMissionRawData = await this.api.getAssignmentToday(this.device_id, this.employee_id, this.currentTime);
    if (todayMissionRawData !== []) {
      this.todayMissionList = await this.processDataTodayMission(todayMissionRawData);
    } else {
      this.todayMissionList = null;
    }

    let futureMissionRawData = await this.api.getAssignmentNext(this.device_id, this.employee_id, this.currentTime);
    if (futureMissionRawData !== []) {
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
      }

      resultArray.push(newData);
    }

    let newDate = this.monthNameArray[dataAddOn[0]['dateDetails']['Month'] - 1] + " " + dataAddOn[0]['dateDetails']['Day'];
    let resultObject = {
      "Date": newDate,
      "Data": resultArray
    }

    return resultObject;
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

  setDataDone () {

    // initialize
    let data = [
      {
        'DateString': "July 24",
        'DayString': "Wednesday",
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
            'MissionNumber': "051",
            'ReportIndex': 3,
            'ReportImages': [
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              },
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              },
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              }
            ]
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
            'MissionNumber': "052",
            'ReportIndex': 2,
            'ReportImages': [
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              },
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              }
            ]
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
            'MissionNumber': "053",
            'ReportIndex': 3,
            'ReportImages': [
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              },
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              },
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              }
            ]
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
            'MissionNumber': "054",
            'ReportIndex': 1,
            'ReportImages': [
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              }
            ]
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
            'MissionNumber': "055",
            'ReportIndex': 2,
            'ReportImages': [
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              },
              {
                'ReportImage': this.convertBase64ToImage(this.imagetest)
              }
            ]
          }
        ]
      }
    ]

    this.doneMissionList = data;
  }
  setDataNext () {

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

  getRawDataDoneMission (device_id: string) {
    
    // generate raw dummy data
    let rawData = {
        "code":200,
        "msg":"success",
        "success":"true",
        "result":"ok",
        "Data":[
            {
                "MissionNumber": 1 ,
                "Device_ID": "T4_04_01" ,
                "Email": "test@example.com" ,
                "ErrorType": 1 ,
                "Description": "Button does not respond" ,
                "Status": 7 ,
                "UploadTime": "2019-03-08 12:00:00" ,
                "NotifyTime": "2019-03-09 08:00:00" ,
                "ConfirmTIme": "2019-03-09 10:00:00" ,
                "RepairCallTime": "2019-03-09 16:00:00" ,
                "RepairDoneTime": "2019-03-10 10:00:00" ,
                "MaintenanceDoneTime": "2019-03-10 11:00:00" ,
                "CompleteTime": "2019-03-10 12:00:00" ,
                "Maintainer": "Mr. Johnny" ,
                "Maintainer_ID": "1234567890" ,
                "Result": "Old button, replace with new one" ,
                "Index": 0 ,
                "Source": null ,
                "Source2": null ,
                "Source3": null ,
                "ArriveTime": "2019-03-10 08:00:00" ,
                "Complete_Index": 1 ,
                "Complete_Source": this.imagetest ,
                "Complete_Source2": null ,
                "Complete_Source3": null ,
                "Archive": false ,
                "Delete": false ,
            },
            {
                "MissionNumber": 2 ,
                "Device_ID": "MA_03_01" ,
                "Email": "test@example.com" ,
                "ErrorType": 1 ,
                "Description": "Button does not respond" ,
                "Status": 7 ,
                "UploadTime": "2019-03-08 12:00:00" ,
                "NotifyTime": "2019-03-09 08:00:00" ,
                "ConfirmTIme": "2019-03-09 10:00:00" ,
                "RepairCallTime": "2019-03-09 16:00:00" ,
                "RepairDoneTime": "2019-03-10 18:00:00" ,
                "MaintenanceDoneTime": "2019-03-10 20:00:00" ,
                "CompleteTime": "2019-03-10 22:00:00" ,
                "Maintainer": "Mr. Johnny" ,
                "Maintainer_ID": "1234567890" ,
                "Result": "Old button, replace with new one" ,
                "Index": 0 ,
                "Source": null ,
                "Source2": null ,
                "Source3": null ,
                "ArriveTime": "2019-03-10 19:00:00" ,
                "Complete_Index": 3 ,
                "Complete_Source": this.imagetest ,
                "Complete_Source2": this.imagetest ,
                "Complete_Source3": this.imagetest ,
                "Archive": false ,
                "Delete": false ,
            },
            {
              "MissionNumber": 3 ,
              "Device_ID": "EE_08_01" ,
              "Email": "test@example.com" ,
              "ErrorType": 1 ,
              "Description": "Button does not respond" ,
              "Status": 7 ,
              "UploadTime": "2019-03-18 12:00:00" ,
              "NotifyTime": "2019-03-19 08:00:00" ,
              "ConfirmTIme": "2019-03-19 10:00:00" ,
              "RepairCallTime": "2019-03-19 16:00:00" ,
              "RepairDoneTime": "2019-03-20 10:00:00" ,
              "MaintenanceDoneTime": "2019-03-20 11:00:00" ,
              "CompleteTime": "2019-03-20 12:00:00" ,
              "Maintainer": "Mr. Johnny" ,
              "Maintainer_ID": "1234567890" ,
              "Result": "Old button, replace with new one" ,
              "Index": 1 ,
              "Source": this.imagetest ,
              "Source2": null ,
              "Source3": null ,
              "ArriveTime": "2019-03-10 08:00:00" ,
              "Complete_Index": 2 ,
              "Complete_Source": this.imagetest ,
              "Complete_Source2": this.imagetest ,
              "Complete_Source3": null ,
              "Archive": false ,
              "Delete": false ,
          }
        ]
    };

    return rawData;
  }
  getRawDataTodayMission (device_id: string) {
    
    // generate raw dummy data
    let rawData = {
        "code":200,
        "msg":"success",
        "success":"true",
        "result":"ok",
        "Data":[
            {
                "MissionNumber": 11 ,
                "Device_ID": device_id ,
                "Email": "test@example.com" ,
                "ErrorType": 4 ,
                "Description": "Button does not respond" ,
                "Status": 4 ,
                "UploadTime": "2019-03-24 12:00:00" ,
                "NotifyTime": "2019-03-25 08:00:00" ,
                "ConfirmTIme": "2019-03-25 10:00:00" ,
                "RepairCallTime": "2019-03-25 16:00:00" ,
                "RepairDoneTime": "2019-03-26 10:00:00" ,
                "MaintenanceDoneTime": "" ,
                "CompleteTime": "" ,
                "Maintainer": "Mr. Johnny" ,
                "Maintainer_ID": "1234567890" ,
                "Result": "Old button, replace with new one" ,
                "Index": 0 ,
                "Source": null ,
                "Source2": null ,
                "Source3": null ,
                "ArriveTime": "" ,
                "Complete_Index": 0 ,
                "Complete_Source": null ,
                "Complete_Source2": null ,
                "Complete_Source3": null ,
                "Archive": false ,
                "Delete": false ,
            },            
            {
              "MissionNumber": 12 ,
              "Device_ID": device_id ,
              "Email": "test@example.com" ,
              "ErrorType": 4 ,
              "Description": "Button does not respond" ,
              "Status": 7 ,
              "UploadTime": "2019-03-24 12:00:00" ,
              "NotifyTime": "2019-03-25 08:00:00" ,
              "ConfirmTIme": "2019-03-25 10:00:00" ,
              "RepairCallTime": "2019-03-25 16:00:00" ,
              "RepairDoneTime": "2019-03-26 16:00:00" ,
              "MaintenanceDoneTime": "" ,
              "CompleteTime": "" ,
              "Maintainer": "Mr. Johnny" ,
              "Maintainer_ID": "1234567890" ,
              "Result": "Old button, replace with new one" ,
              "Index": 0 ,
              "Source": null ,
              "Source2": null ,
              "Source3": null ,
              "ArriveTime": "" ,
              "Complete_Index": 0 ,
              "Complete_Source": null ,
              "Complete_Source2": null ,
              "Complete_Source3": null ,
              "Archive": false ,
              "Delete": false ,
          }
        ]
    };

    return rawData;
  }
  getRawDataFutureMission (device_id: string) {
    
    // generate raw dummy data
    let rawData = {
        "code":200,
        "msg":"success",
        "success":"true",
        "result":"ok",
        "Data":[
              {
                  "MissionNumber": 21 ,
                  "Device_ID": device_id ,
                  "Email": "test@example.com" ,
                  "ErrorType": 1 ,
                  "Description": "Button does not respond" ,
                  "Status": 4 ,
                  "UploadTime": "2019-03-24 12:00:00" ,
                  "NotifyTime": "2019-03-25 08:00:00" ,
                  "ConfirmTIme": "2019-03-25 10:00:00" ,
                  "RepairCallTime": "2019-03-25 16:00:00" ,
                  "RepairDoneTime": "2019-03-30 10:00:00" ,
                  "MaintenanceDoneTime": "" ,
                  "CompleteTime": "" ,
                  "Maintainer": "Mr. Johnny" ,
                  "Maintainer_ID": "1234567890" ,
                  "Result": "Old button, replace with new one" ,
                  "Index": 0 ,
                  "Source": null ,
                  "Source2": null ,
                  "Source3": null ,
                  "ArriveTime": "" ,
                  "Complete_Index": 0 ,
                  "Complete_Source": null ,
                  "Complete_Source2": null ,
                  "Complete_Source3": null ,
                  "Archive": false ,
                  "Delete": false ,
              },            
              {
                "MissionNumber": 22 ,
                "Device_ID": device_id ,
                "Email": "test@example.com" ,
                "ErrorType": 1 ,
                "Description": "Button does not respond" ,
                "Status": 4 ,
                "UploadTime": "2019-03-24 12:00:00" ,
                "NotifyTime": "2019-03-25 08:00:00" ,
                "ConfirmTIme": "2019-03-25 10:00:00" ,
                "RepairCallTime": "2019-03-25 16:00:00" ,
                "RepairDoneTime": "2019-04-02 10:00:00" ,
                "MaintenanceDoneTime": "" ,
                "CompleteTime": "" ,
                "Maintainer": "Mr. Johnny" ,
                "Maintainer_ID": "1234567890" ,
                "Result": "Old button, replace with new one" ,
                "Index": 0 ,
                "Source": null ,
                "Source2": null ,
                "Source3": null ,
                "ArriveTime": "" ,
                "Complete_Index": 0 ,
                "Complete_Source": null ,
                "Complete_Source2": null ,
                "Complete_Source3": null ,
                "Archive": false ,
                "Delete": false ,
            },
            {
              "MissionNumber": 23 ,
              "Device_ID": device_id ,
              "Email": "test@example.com" ,
              "ErrorType": 1 ,
              "Description": "Button does not respond" ,
              "Status": 4 ,
              "UploadTime": "2019-03-24 12:00:00" ,
              "NotifyTime": "2019-03-25 08:00:00" ,
              "ConfirmTIme": "2019-03-25 10:00:00" ,
              "RepairCallTime": "2019-03-25 16:00:00" ,
              "RepairDoneTime": "2019-04-02 10:00:00" ,
              "MaintenanceDoneTime": "" ,
              "CompleteTime": "" ,
              "Maintainer": "Mr. Johnny" ,
              "Maintainer_ID": "1234567890" ,
              "Result": "Old button, replace with new one" ,
              "Index": 0 ,
              "Source": null ,
              "Source2": null ,
              "Source3": null ,
              "ArriveTime": "" ,
              "Complete_Index": 0 ,
              "Complete_Source": null ,
              "Complete_Source2": null ,
              "Complete_Source3": null ,
              "Archive": false ,
              "Delete": false ,
          }
        ]
    };

    return rawData;
  }

  // test image to perform dummy data for doneMissionList
  imagetest = "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"
}
