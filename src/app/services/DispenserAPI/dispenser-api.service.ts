import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DispenserAPIService {

  // domain used
  private domain: string = 'https://smartcampus.et.ntust.edu.tw:5425/';
  
  // constant url List
  /* 01 */ private urlGetToken: string = this.domain + 'Login';
  /* 02 */ private urlCreateUser: string = this.domain + 'CreateUser';
  /* 03 */ private urlUserLogin: string = this.domain + 'UserLogin';
  /* 04 */ private urlDispenserDetail: string = this.domain + 'Dispenser/Detail?Device_ID=';
  /* 05 */ private urlGetDispenserRepairCondition: string = this.domain + 'Dispenser/Repair?Device_ID=';

  // function list
  /*
    async getToken ()
    async registerNewUser (fullname: string, email: string, password: string, repassword: string, employee_id: string, photo: any)
    async loginUser (email: string, password: string)
    async getDispenserDetail (device_id: string)
    async getDispenserRepairCondition (device_id: string)
    async getAssignmentDone (device_id: string, employee_id: string)
    async getAssignmentNext (device_id: string, employee_id: string)
    async getAssignmentToday (device_id: string, employee_id: string, nowTime: string)
    convertApiTimeToJson (time: string)
  */

  constructor(private http: HttpClient) { }

  /**
   * This function is for get the token from API.
   * 
   * @returns   token   This return the token value
   * 
   * @example   
   * 
   * eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTE5NjU1NzksImlhdCI6MTU1MTk2MTk3OSwidXNlciI6InB3YV91c2VyMDAxIn0.PXnfohRsONkwct08w3mV00lHOjeb6JtK2Sje6Ofc16o
   */
  async getToken () {
    
    let url = this.urlGetToken;

    const postDataToken = {
      "UserName": "pwa_user001",
      "Password": "password"
    };

    let token: string = "";
    await this.http.post(url, postDataToken).toPromise()
      .then((success) => {
        token = success['token'];
      }, () => {
        console.error("Promise rejected: unable to get token!");
      })
      .catch((e) => {
        console.error("Function error: on getToken => " + e);
      });
  
    return token;
  }

  /**
   * This function is for registering new user using
   * email and password. The password should be input
   * again in the page to confirm password is same and
   * no mistake.
   * 
   * @param     email       Email address of the user
   * @param     password    Password of the user
   * @param     repassword  Re type the password
   * 
   * @returns   json        Return json object with respond number and message
   * 
   * @example
   * 
   * {
   *    "RepsondNum": 1,
   *    "Message": "Registration success!"
   * }
   */
  async registerNewUser (
    fullname: string, 
    email: string, 
    password: string, 
    repassword: string, 
    employee_id: string, 
    photo: any
  ) {
    
    let url = this.urlCreateUser;
    let token: string = "";
    let returnValue = {
      "RepsondNum": -1,
      "Message": "Null message."
    }

    try {
      token = await this.getToken();
    } catch (e) {
      console.error("Function error: on registerNewUser while getToken => " + e);
      returnValue = {
        "RepsondNum": -1,
        "Message": "There is an error from server, please try again later!"
      };
    }

    const postDataRegister = {
      "Email" : email,
      "Password" : password
    }
      
    if (password !== repassword) {
      returnValue = {
        "RepsondNum": 0,
        "Message": "Password not match!"
      };
    } else {
      let httpOption = await {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      };

      await this.http.post(url, postDataRegister, httpOption).toPromise()
      .then((result) => {
        console.log("Msg: " + result['msg']);

        if (result['code'] === 200){
          returnValue = {
            "RepsondNum": 1,
            "Message": "Registration success!"
          };
        } else {
          console.error("Error while sending request: " + result['msg']);
          
          returnValue = {
            "RepsondNum": 0,
            "Message": result['msg']
          };
        }
      }, (result) => {     
        
        console.error("Promise rejected: unable to register!");
        
        returnValue = {
          "RepsondNum": -1,
          "Message": result['error']['msg']
        };
      })
      .catch((e) => {
        console.error("Function error: on registerNewUser => " + e);
        
        returnValue = {
          "RepsondNum": -1,
          "Message": "There is an unexpected error, please try again later!"
        };
      });
    }  

    return returnValue; 
  }
  
  /**
   * This function is for login the user with email and password.
   * Before do login, the email should be verified after register,
   * the server will send the verification email to user email
   * address.
   * 
   * @param     email     Email address of the user
   * @param     password  Password of the user
   * 
   * @returns   number    Return 1 if success, 0 if not match, -1 if failed/error
   */
  async loginUser (email: string, password: string) {
    
    let url = this.urlUserLogin;

    const postBody = {
      "Email": email,
      "Password": password
    };

    return await this.http.post(url, postBody).toPromise()
      .then((result) => {
        if (result['code'] === 200) {
          return 1;
        } else {
          console.error("Error while log in: " + result['msg']);
          return 0;
        }
      }, () => {
        console.error("Promise rejected: unable to login!");
        return 0;
      })
      .catch((e) => {
        console.error("Function error: on loginUser => " + e);
        return -1;
      });
  }

  /**
   * This function is to get details of the target dispenser from
   * the API. It returns the json format.
   * 
   * @param     device_id   The device ID of target dispenser
   * 
   * @returns   value       The json object of data
   * 
   * @example
   *
   * {
    *   "Device_ID": "EE_07_01",
    *   "Building": "Electrical and Computer Engineering Building 7F",
    *   "Position": "Next to the elevator",
    *   "Type": "UW-9615AG-1"
    * }
    */
  async getDispenserDetail (device_id: string) {
    
    let url = this.urlDispenserDetail + device_id;

    let returnValue = {
      "Device_ID": device_id,
      "Building": "",
      "Position": "",
      "Type": ""
    }

    await this.http.get(url).toPromise()
      .then((result) => {
        returnValue = result['Data'];
      }, () => {
        console.error("Promise rejected: unable to get dispenser detail!");
      })
      .catch((e) => {
        console.error("Function error: on getDispenserDetail => " + e);
      });

    return returnValue;
  }

  /**
   * This function is to get the repair condition of the target
   * dispenser from the API. It contains the problem that still
   * under maintenance where the status is not 7 until it being
   * complete or status equal to 7. It returns the json format.
   * 
   * @param     device_id   The device ID of target dispenser
   * 
   * @returns   value       The json object of data
   * 
   * @example   
   * 
   * *noted that the  email with "at" because using
   * symbol will break the comment line
   *
   * [
   *    {
   *      Archive: false,
   *      ArriveTime: "",
   *      CompleteTime: "2019-01-02 24:00:00",
   *      Complete_Index: 0,
   *      Complete_Source: "",
   *      Complete_Source2: "",
   *      Complete_Source3: "",
   *      ConfirmTIme: "",
   *      Delete: false,
   *      Description: "Leaking water",
   *      Device_ID: "T4_04_01",
   *      Email: "ntust.smartcampus@gmail.com",
   *      ErrorType: 3,
   *      Index: 0,
   *      Maintainer: "Mr.Pang",
   *      MaintenanceDoneTime: "",
   *      MissionNumber: 3,
   *      NotifyTime: "2019-01-02 20:16:00",
   *      RepairCallTime: "",
   *      RepairDoneTime: "",
   *      Result: "Fan and Compressor are broken",
   *      Source: "",
   *      Source2: "",
   *      Source3: "",
   *      Status: 7,
   *      UploadTime: "2019-01-02 20:16:00"
   *    },
   *    {
   *      Archive: false,
   *      ArriveTime: "",
   *      CompleteTime: "",
   *      Complete_Index: 0,
   *      Complete_Source: "",
   *      Complete_Source2: "",
   *      Complete_Source3: "",
   *      ConfirmTIme: "",
   *      Delete: false,
   *      Description: "Uable to water",
   *      Device_ID: "T4_04_01",
   *      Email: "muhamadaldy17@gmail.com",
   *      ErrorType: 2,
   *      Index: 0,
   *      Maintainer: "",
   *      MaintenanceDoneTime: "",
   *      MissionNumber: 54,
   *      NotifyTime: "",
   *      RepairCallTime: "",
   *      RepairDoneTime: "",
   *      Result: null,
   *      Source: "",
   *      Source2: "",
   *      Source3: "",
   *      Status: 1,
   *      UploadTime: "2019-07-30 10:12:17"
   *    },
   *    ...
   * ]
   */
  async getDispenserRepairCondition (device_id: string) {
    
    let url = this.urlGetDispenserRepairCondition + device_id;

    let returnValue = [{}];

    await this.http.get(url).toPromise()
      .then((result) => {
        returnValue = result['Data'];
      }, () => {
        console.error("Promise rejected: unable to get dispenser repair condition!");
      })
      .catch((e) => {
        console.error("Function error: on getDispenserRepairCondition => " + e);
      });

    return returnValue;
  }

  async getAssignmentDone (device_id: string, employee_id: string) {
    
    // get data from RepairCondition
    let data = await this.getDispenserRepairCondition(device_id);
    let returnArray = [];

    // for every data will be filtered to get what have been done
    for (let i = 0 ; i < data.length ; i++) {

      // if data contains the employee id we need
      if (data[i]['Employee_ID'] === employee_id) {

        // if data contains status above-equal to 5 and has repair time done
        if (data[i]['Status'] >= 5 && data[i]['RepairDoneTime'] !== "") {
          
          returnArray.push(data[i]);
        }  
      }
    }

    return returnArray;
  }

  async getAssignmentNext (device_id: string, employee_id: string) {
    
    // get data from RepairCondition
    let data = await this.getDispenserRepairCondition(device_id);
    let returnArray = [];

    // for every data will be filtered to get what have been done
    for (let i = 0 ; i < data.length ; i++) {

      // if data contains the employee id we need
      if (data[i]['Employee_ID'] === employee_id) {

        // if data contains status = 4 but has repair time done
        if (data[i]['Status'] === 4 && data[i]['RepairDoneTime'] !== "") {
          
          returnArray.push(data[i]);
        }  
      }
    }

    return returnArray;
  }

  async getAssignmentToday (device_id: string, employee_id: string, nowTime: string) {
    
    // get data from RepairCondition
    let data = await this.getDispenserRepairCondition(device_id);
    let returnArray = [];

    // for every data will be filtered to get what have been done
    for (let i = 0 ; i < data.length ; i++) {

      // if data contains the employee id we need
      if (data[i]['Employee_ID'] === employee_id) {

        // if data contains status = 5 and has repair time done
        if (data[i]['Status'] === 4 && data[i]['RepairDoneTime'] !== "") {

          let missionTime = this.convertApiTimeToJson(data[i]['RepairDoneTime']);
          let currentTime = this.convertApiTimeToJson(nowTime);
          
          // if data has same day as mission deadline
          if (
            missionTime['Year'] === currentTime['Year'] &&
            missionTime['Month'] === currentTime['Month'] &&
            missionTime['DateOfMonth'] === currentTime['DateOfMonth']
          ) {
            
            // if data is under the deadline time
            if (missionTime['Hour'] <= currentTime['Hour'] &&
                missionTime['Minute'] <= currentTime['Minute'] &&
                missionTime['Second'] <= currentTime['Second']
            ) {
              
              // put into data will be returned
              returnArray.push(data[i]);
            }
          }
        }  
      }
    }

    return returnArray;
  }

  async repairmanHasArrived (employee_id: string, assignment_num: string) {
    let url = this.urlRepairmanArrived;

  }

  async repairmentReport (file: any, employee_id: string, assignment_num: string) {
    let url = this.urlRepairComplete;

  }

  /**
   * This function is to convert the time from the API into Date
   * object in typescript library. The purpose is to create a new
   * Date object with data from the API. This function will return
   * Date object
   * 
   * @param     time    Value of time from API in "2019-03-08 16:32:00" format
   * 
   * @returns   Date    Date object converted result from time
   * 
   * @example
   * 
   * {
   *    "Year": 2019,
   *    "Month": 2,
   *    "DateOfMonth": 14,
   *    "Hour": 19,
   *    "Minute": 44,
   *    "Second": 11,
   * }
   */
  convertApiTimeToJson (time: string) {
    // time passed is String, construct into Date format
    // time example from json: "2019-03-08 16:32:00"
    // format: YEAR-MONTH-DATEOFMONTH HOUR:MINUTE:SECOND
    
    // split into DATE form and HOUR form
    let splitTime = time.split(" ");

      ////////////////////////////////////////////
     //  DATE PART                             //
    ////////////////////////////////////////////

    // resultDate = YEAR-MONTH-DATEOFMONTH
    let resultDate = splitTime[0];

    // split DATE into YEAR, MONTH, and DATEOFMONTH
    let splitDate = resultDate.split("-");

    let resultYear = splitDate[0];
    let resultMonth = splitDate[1];
    let resultDateOfMonth = splitDate[2];

      ////////////////////////////////////////////
     //  HOUR PART                             //
    ////////////////////////////////////////////

    // resultHour = HOUR:MINUTE:SECOND
    let resultHour = splitTime[1];

    // split HOUR into HOUR, MINUTE, and SECOND
    let splitHour = resultHour.split(":");

    let resultHourC = splitHour[0];
    let resultMinute = splitHour[1];
    let resultSecond = splitHour[2];

      ////////////////////////////////////////////
     //  CONSTRUCT DATE PART                   //
    ////////////////////////////////////////////

    // now we get every component to construct date into JSON format
    let newDate = {
      'Year': resultYear,
      'Month': resultMonth,
      'DateOfMonth': resultDateOfMonth,
      'Hour': resultHourC,
      'Minute': resultMinute,
      'Second': resultSecond
    };

    return newDate;
  }
}
