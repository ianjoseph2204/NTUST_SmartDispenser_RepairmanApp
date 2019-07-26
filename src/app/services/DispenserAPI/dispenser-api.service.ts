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
  /* 04 */ private urlAssignmentDone: string = this.domain + 'Assignment/Done?Employee_ID=';
  /* 05 */ private urlAssignmentNext: string = this.domain + 'Assignment/Next?Employee_ID=';
  /* 06 */ private urlAssignmentToday: string = this.domain + 'Assignment/Today?Employee_ID=';
  /* 07 */ private urlRepairmanArrived: string = this.domain + 'RepairmanArrived';
  /* 08 */ private urlRepairComplete: string = this.domain + 'RepairComplete';

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
  async registerNewUser (fullname: string, email: string, password: string, repassword: string, employee_id: string, photo: any) {
    
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

  async getAssignmentDone (employee_id: string) {
    let url = this.urlAssignmentDone + employee_id;

  }

  async getAssignmentNext (employee_id: string) {
    let url = this.urlAssignmentNext + employee_id;

  }

  async getAssignmentToday (employee_id: string) {
    let url = this.urlAssignmentToday + employee_id;

  }

  async repairmanHasArrived (employee_id: string, assignment_num: string) {
    let url = this.urlRepairmanArrived;

  }

  async repairmentReport (file: any, employee_id: string, assignment_num: string) {
    let url = this.urlRepairComplete;

  }
}
