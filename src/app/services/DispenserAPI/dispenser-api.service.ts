import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UnitConverter } from 'src/app/classes/UnitConverter/unit-converter';

@Injectable({
  providedIn: 'root'
})
export class DispenserAPIService {

  // domain used
  private domain: string = 'https://smartcampus.et.ntust.edu.tw:5425/';
  
  // constant url List
  /* 01 */ private urlGetToken: string = this.domain + 'Login';
  /* 02 */ private urlCreateRepairman: string = this.domain + 'CreateRepairman';
  /* 03 */ private urlLoginRepairman: string = this.domain + 'RepairmanLogin';
  /* 04 */ private urlDispenserDetail: string = this.domain + 'Dispenser/Detail?Device_ID=';
  /* 05 */ private urlGetDispenserRepairCondition: string = this.domain + 'Dispenser/Repair?Device_ID=';
  /* 06 */ private urlForgotPassword: string = this.domain + 'RepairmanForget';
  /* 07 */ private urlResetPassowrd: string = this.domain + 'Repairman/PasswordReset';
  /* 08 */ private urlGetRepairmanTask: string = this.domain + 'Repairman/Task?Maintainer_ID=';
  /* 09 */ private urlGetRepairmanDoneTask: string = this.domain + 'Repairman/DoneTask?Maintainer_ID=';
  /* 10 */ private urlGetRepairmanProfile: string = this.domain + 'Repairman/Info?ID=';
  /* 11 */ private urlRepairmanArrived: string = this.domain + 'Repairman/Arrived';
  /* 12 */ private urlCompleteMission: string = this.domain + 'Repairman/TaskComplete';

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
   * Register new repairman into API using the form of data.
   * It will need fullname, email address, password and re password,
   * employee ID, and profile picture. This function will return
   * json object which contain respond number and the message
   * to be displayed.
   * 
   * @param   fullname      Repairman's full name
   * @param   email         Repairman's email address
   * @param   password      Repairman account's password
   * @param   repassword    Repairman account's password, to verify
   * @param   employee_id   Repairman's employee ID
   * @param   photo         Repairman's profile picture
   * 
   * @returns JSON          Json object which contains RespondNum and Message
   * 
   * @example
   *
   * {
   *    "RespondNum": 1,
   *    "Message": "Registration success!"
   * }
   */
  async registerRepairman (
    fullname: string, 
    email: string, 
    password: string, 
    repassword: string, 
    employee_id: string, 
    photo: any
  ) {
    
    let url = this.urlCreateRepairman;
    let token: string = "";
    let returnValue = {
      "RepsondNum": -1,
      "Message": "Null message."
    }

    try {
      token = await this.getToken();
    } catch (e) {
      console.error("Function error: on registerRepairman while getToken => " + e);
      returnValue = {
        "RepsondNum": -1,
        "Message": "There is an error from server, please try again later!"
      };
    }
      
    if (password !== repassword) {
      returnValue = {
        "RepsondNum": 0,
        "Message": "Password not match!"
      };
    } else {

      const postDataRegister = {
        "Email": email,
        "FullName": fullname,
        "EmployeeID": employee_id,
        "Password": password,
        "Picture": photo
      };

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
        console.error("Function error: on registerRepairman => " + e);
        
        returnValue = {
          "RepsondNum": -1,
          "Message": "There is an unexpected error, please try again later!"
        };
      });
    }  

    return returnValue; 
  }

  /**
   * Repairman can perform login using either his email address or
   * his employee ID and his password. This function will return
   * response number as success or failed.
   * 
   * @param   credential  Repairman's email address of employee ID
   * @param   password    Repairman's account password
   * 
   * @returns number      Return 1 for success, 0 for failed, and -1 for error
   */
  async loginRepairman (credential: string, password: string) {
    
    let url = this.urlLoginRepairman;

    const postBody = {
      "Email": credential,
      "EmployeeID": credential,
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
        console.error("Function error: on loginRepairmanUsingEmployeeId => " + e);
        return -1;
      });
  }

  /**
   * Forgot password function is to generate the verification code
   * for reseting repairman account's password which will be sent
   * into his mailbox. It can be using either email address or
   * employee ID. This function will return repsonse number as 
   * success or failed.
   * 
   * @param   credential  Repairman's email address or employee ID
   * 
   * @returns number      Return 1 for success, 0 for failed, and -1 for error
   */
  async forgotPassword (credential: string) {
    
    let url = this.urlForgotPassword;

    const postBody = {
      "Email": credential,
      "EmployeeID": credential
    };

    return await this.http.post(url, postBody).toPromise()
      .then((result) => {
        if (result['code'] === 200) {
          return 1;
        } else {
          console.error("Error while send reset password request: " + result['msg']);
          return 0;
        }
      }, () => {
        console.error("Promise rejected: unable to send reset password request!");
        return 0;
      })
      .catch((e) => {
        console.error("Function error: on forgotPasswordUsingEmployeeId => " + e);
        return -1;
      });
  }

  /**
   * Continuing from Forgot Password function, this is for reseting
   * repairman account's password with using his credential, either 
   * email address or employee ID, new password, and verification code
   * which can be seen in mailbox. This function will return json
   * object which contains respond number and message to displayed.
   * 
   * @param   credential      Repairman's email address or employee ID
   * @param   newPassword     Repairman account's new password
   * @param   reNewPassword   Repairman account's new password, to verify
   * @param   verifCode       Verification which sent into repairman's mailbox
   * 
   * @returns JSON            Json object which contains RespondNum and Message
   * 
   * @example
   * 
   * {
   *    "RespondNum": 1,
   *    "Message": "Registration success!"
   * }
   */
  async resetPassword (credential: string, newPassword: string, reNewPassword: string, verifCode: string) {

    let url = this.urlResetPassowrd;
    let token: string = "";
    let returnValue = {
      "RepsondNum": -1,
      "Message": "Null message."
    };

    try {
      token = await this.getToken();
    } catch (e) {
      console.error("Function error: on resetPassword while getToken => " + e);
      returnValue = {
        "RepsondNum": -1,
        "Message": "There is an error from server, please try again later!"
      };
    }

    if (newPassword !== reNewPassword) {
      returnValue = {
        "RepsondNum": 0,
        "Message": "Password not match!"
      };
    } else {

      const postBody = {
        "Email": credential,
        "EmployeeID": credential,
        "Password": newPassword,
        "VerificationCode": verifCode
      };

      let httpOption = await {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token
        })
      };

      await this.http.post(url, postBody, httpOption).toPromise()
        .then((result) => {
          if (result['code'] === 200) {
            returnValue = {
              "RepsondNum": 1,
              "Message": "Your account password has successfully reset!"
            };
          } else {
            returnValue = {
              "RepsondNum": -1,
              "Message": "There is an error from server, please try again later!"
            };
          }
        }, () => {
          console.error("Promise rejected: unable to reset password!");
          returnValue = {
            "RepsondNum": -1,
            "Message": "The Email/Employee ID does not exist or Verification Code is not valid"
          };
        })
        .catch((e) => {
          console.error("Function error: on resetPassword => " + e);
          returnValue = {
            "RepsondNum": -1,
            "Message": "There is an error from server, please try again later!"
          };
        });
    }

    return returnValue;
  }

  /**
   * Get the information of repairman using either email address or
   * employee ID. This function will return repairman's full name,
   * email address, employee ID, and his profile picture in base64
   * string form. Noted that this will not return the password.
   * 
   * @param   credential  Repairman's email address or employee ID
   * 
   * @returns JSON        Json object which contains repairman's information
   * 
   * @example
   * 
   * {
   *    "FullName": "Mr. Fulan",
   *    "Email": "fulanATexample.com",
   *    "EmployeeID": 12345,
   *    "Picture": "...",
   * }
   */
  async getRepairmanProfile (credential: string) {

    let url = this.urlGetRepairmanProfile + credential;

    let returnValue = {
      "FullName": null,
      "Email": null,
      "EmployeeID": null,
      "Picture": null,
    };

    await this.http.get(url).toPromise()
      .then((result) => {
        returnValue = result['Data'];
      }, () => {
        console.error("Promise rejected: unable to get repairman profile!");
      })
      .catch((e) => {
        console.error("Function error: on getRepairmanProfile => " + e);
      });

    return returnValue;
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
    };

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

  /**
   * Get missions which hasn't done, for missions with status 5 or
   * has been done go to getRepairmanDoneMissions. This function need
   * the employee ID and will return the list of mission.
   * 
   * @param   employee_id   Repairman employee ID
   * 
   * @returns JSON array    List of repairman's missions
   * 
   * @example
   * 
   * [
   *   {
   *      "MissionNumber": 1565950709000000,
   *      "Device_ID": "EE_08_01",
   *      "Building":"Electrical and Computer Engineering Building 8F",
   *      "Position":"Next to the elevator",
   *      "ErrorType": 5,
   *      "Description": "沒有飲水機電源",
   *      "NotifyTime": "",
   *      "RepairCallTime": "2019-12-13 09:00:00",
   *      "Maintainer": "Bo-Yang",
   *      "Maintainer_ID": "789456123",
   *      "Index": 2,
   *      "Source1":"",
   *      "Source2":"",
   *      "Source3":"",
   *      "Name":"范淑燕",
   *      "Tel":"02-2733-6160",
   *      "Address":"106台北市大安區基隆路四段43號"
   *  },
   *  ...
   * 
   * ]
   */
  async getRepairmanMissions (employee_id: string) {

    let url = this.urlGetRepairmanTask + employee_id;

    let returnValue = [{}];

    await this.http.get(url).toPromise()
      .then((result) => {
        returnValue = result['Data'];
      }, () => {
        console.error("Promise rejected: unable to get repairman missions!");
      })
      .catch((e) => {
        console.error("Function error: on getRepairmanMissions => " + e);
      });

    return returnValue;
  }
  
  /**
   * Get missions which has been done, for missions with status 4 or
   * lower means on going go to getRepairmanMissions. This function need
   * the employee ID and will return the list of mission.
   * 
   * @param   employee_id   Repairman employee ID
   * 
   * @returns JSON array    List of repairman's missions has been done
   * 
   * @example
   * 
   * [
   *   {
   *     "MissionNumber":1565950709000000,
   *     "Device_ID":"EE_08_01",
   *     "Building":"Electrical and Computer Engineering Building 8F",
   *     "Position":"Next to the elevator",
   *     "ErrorType":5,
   *     "Description":"luching不洗澡髒髒的",
   *     "NotifyTime":"",
   *     "RepairCallTime":"2019-12-13 09:00:00",
   *     "Maintainer":"Bo-Yang",
   *     "Maintainer_ID":"789456123",
   *     "Index":0,
   *     "Source":"",
   *     "Source2":"",
   *     "Source3":"",
   *     "Name":"范淑燕",
   *     "Tel":"02-2733-6160",
   *     "Address":"106台北市大安區基隆路四段43號",
   *     "ArriveTime":"2019-08-12 16:30:37",
   *     "Complete_Index":3,
   *     "Complete_Source":"",
   *     "Complete_Source2":"",
   *     "Complete_Source3":""
   *   },
   *   ...
   * ]
   */
  async getAssignmentDone (employee_id: string) {
    
    let url = this.urlGetRepairmanDoneTask + employee_id;

    let returnValue = [{}];

    await this.http.get(url).toPromise()
      .then((result) => {
        returnValue = result['Data'];
      }, () => {
        console.error("Promise rejected: unable to get repairman done missions!");
      })
      .catch((e) => {
        console.error("Function error: on getRepairmanDoneMissions => " + e);
      });

    return returnValue;
  }

  /**
   * Get raw missions data from getRepairmanMissions and process into
   * today mission by comparing with the nowTime. It will only fetch
   * data which has same date but before the deadline time. This function
   * will return JSON array as list of today missions.
   * 
   * @param   employee_id   Repairman's ID
   * @param   nowTime       Current time when the app used
   * 
   * @returns JSON array    List of today missions
   * 
   * @example
   * 
   * [
   *    {
   *        Address: "",
   *        Building: "Management Building 3F",
   *        CompleteTime: "",
   *        ConfirmTime: "2019-08-05 12:00:00",
   *        Description: "Leaking water",
   *        Device_ID: "MA_03_01",
   *        ErrorType: 3,
   *        Index: 2,
   *        Maintainer: "Mr. Fulan",
   *        Maintainer_ID: "12345678",
   *        MissionNumber: 391294217491,
   *        Name: "NTUST",
   *        NotifyTime: "2019-08-05 08:00:00",
   *        Position: "Next to the elevator",
   *        RepairCallTime: "2019-08-19 20:00:00",
   *        Source: " ... ",
   *        Source2: " ... ",
   *        Source3: null,
   *        Tel: "09293129498",
   *        Type: "UW-333AS-1"
   *    },
   *    
   *    ...
   * ]
   */
  async getAssignmentToday (employee_id: string, nowTime: string) {
    
    // get data from RepairCondition
    let data = await this.getRepairmanMissions(employee_id);
    let returnArray = [];

    // for every data will be filtered to get what have been done
    for (let i = 0 ; i < data.length ; i++) {
     
      let missionTime = UnitConverter.convertApiTimeToJson(data[i]['RepairCallTime']);
      let currentTime = UnitConverter.convertApiTimeToJson(nowTime);
      
      // if data has same day as mission deadline
      if (
        missionTime['Year'] === currentTime['Year'] &&
        missionTime['Month'] === currentTime['Month'] &&
        missionTime['DateOfMonth'] === currentTime['DateOfMonth']
      ) {

        let dateCurrentTime = UnitConverter.convertApiTimeToDate(nowTime).getTime();
        let dateMissionTime = UnitConverter.convertApiTimeToDate(data[i]['RepairCallTime']).getTime();
        
        // if data is under the deadline time
        if (dateCurrentTime <= dateMissionTime) {

          // put into data will be returned
          returnArray.push(data[i]);
        }
      }
    }

    return returnArray;  
  }

  /**
   * Get raw missions data from getRepairmanMissions and process into
   * future mission by comparing with the nowTime. Similar to today
   * mission but this will fetch data which for next and future day.
   * This function will return JSON array as list of today missions.
   * 
   * @param   employee_id   Repairman's ID
   * @param   nowTime       Current time when the app used
   * 
   * @returns JSON array    List of future missions
   * 
   * @example
   * 
   * [
   *    {
   *        Address: "",
   *        Building: "Management Building 3F",
   *        CompleteTime: "",
   *        ConfirmTime: "2019-08-05 12:00:00",
   *        Description: "Leaking water",
   *        Device_ID: "MA_03_01",
   *        ErrorType: 3,
   *        Index: 2,
   *        Maintainer: "Mr. Fulan",
   *        Maintainer_ID: "12345678",
   *        MissionNumber: 391294217491,
   *        Name: "NTUST",
   *        NotifyTime: "2019-08-05 08:00:00",
   *        Position: "Next to the elevator",
   *        RepairCallTime: "2019-09-01 20:00:00",
   *        Source: " ... ",
   *        Source2: " ... ",
   *        Source3: null,
   *        Tel: "09293129498",
   *        Type: "UW-333AS-1"
   *    },
   *    
   *    ...
   * ]
   */
  async getAssignmentNext (employee_id: string, nowTime: string) {
    
    // get data from RepairCondition
    let data = await this.getRepairmanMissions(employee_id);
    let returnArray = [];

    // for every data will be filtered to get what have been done
    for (let i = 0 ; i < data.length ; i++) {

      let missionTime = UnitConverter.convertApiTimeToJson(data[i]['RepairCallTime']);
      let currentTime = UnitConverter.convertApiTimeToJson(nowTime);

      // check if it has greater year
      if (missionTime['Year'] > currentTime['Year']) {
        returnArray.push(data[i]);

        // check if it has greater month
      } else if (missionTime['Year'] === currentTime['Year']) {
        if (missionTime['Month'] > currentTime['Month']) {
          returnArray.push(data[i]);

          // check if it has greater date
        } else if (missionTime['Year'] === currentTime['Year']) {
          if (missionTime['Month'] === currentTime['Month']) {
            if (missionTime['DateOfMonth'] > currentTime['DateOfMonth']) {
              returnArray.push(data[i]);
            }
          }
        }
      }
    }

    return returnArray;
  }

  /**
   * To attend a mission by the repairman and notify that the repairman
   * has been setArrival, means ready to fix the dispenser problem. This
   * function need the mission number and it will return response number
   * as success or failed.
   * 
   * @param   mission_num   Mission's number that assigned to the repairman
   * 
   * @returns number        Return 1 for success, 0 for failed, and -1 for error
   */
  async repairmanHasArrived (mission_num: number) {

    let url = this.urlRepairmanArrived;

    const postBody = {
      "MissionNumber": mission_num
    };

    return await this.http.post(url, postBody).toPromise()
      .then((success) => {
        return 1;
      }, () => {
        console.error("Promise rejected: unable to update repairman setArrival status!");
        return 0;
      })
      .catch((e) => {
        console.error("Function error: on repairmanHasArrived => " + e);
        return -1;
      });
  }

  /**
   * To complete the mission, repairman use this function to fill
   * the complete report with the file contains maximum 3 of report
   * pictures, mission number, and description as result of repairment.
   * This function will return boolean value as success or failed.
   * 
   * @param   file          Pictures of repairment result, maximum 3
   * @param   mission_num   Mission number that assigned to repairman
   * @param   description   Result of done repairment
   * 
   * @returns boolean       True for success, false for failed
   */
  async repairCompleteReport (file: any, mission_num: number, description: string) {

    let url = this.urlCompleteMission;

    let formdataOnComplete = new FormData();
    for (let i = 0; i < file.length; i++) {
      formdataOnComplete.append('File', file[i]);
    }
    formdataOnComplete.append('MissionNumber', String(mission_num));
    formdataOnComplete.append('Result', description);

    return await this.http.post<any>(url, formdataOnComplete).toPromise()
      .then((result) => {
        if (result['code'] === 200) {
          return true;
        } else {
          console.error("Error while sending report: " + result['msg']);
          return false;
        }
      }, () => {
        console.error("Promise rejected: unable to sending report!");
        return false;
      })
      .catch((e) => {
        console.error("Function error: on repairCompleteReport => " + e);
        return false;
      });
  }

  /**
   * This function has similar to repairment complete report except
   * it doesn't require report picture because the repairment is
   * not complete yet. Use this function for postpone or delayed
   * repairment with using mission number and description of reason.
   * This function will return boolean value as success or failed.
   * Noted that by using this function will not update the dispenser
   * repair status and repair complete timestamp.
   * 
   * @param   mission_num   Mission number that assigned to repairman
   * @param   description   Reason of postpone/delayed repairment
   * 
   * @returns boolean       True for success, false for failed
   */
  async repairNotCompleteReport (mission_num: number, description: string) {

  }
}
