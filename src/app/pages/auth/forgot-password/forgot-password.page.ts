import { Component, OnInit } from '@angular/core';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  credential = "";

  constructor(
    private api: DispenserAPIService
  ) { }

  ngOnInit() {
  }

  async continue () {

    const {credential} = this;

    if (credential === "") {

    } else {
      let resultData: any;
      resultData = await this.api.forgotPasswordUsingEmail(credential);

      if (resultData === 0 || resultData === -1)
        resultData = await this.api.forgotPasswordUsingEmployeeId(credential);

      console.log(resultData);
    }
  }

  backFunc () {
    
  }
}