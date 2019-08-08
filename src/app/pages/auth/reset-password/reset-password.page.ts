import { Component, OnInit } from '@angular/core';
import { DispenserAPIService } from 'src/app/services/DispenserAPI/dispenser-api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  // form attributes
  credential = "";
  new_password = "";
  re_new_password = "";
  verif_code = "";

  constructor(
    private api: DispenserAPIService
  ) { }

  ngOnInit() {
  }

  async reset () {

    const { credential, new_password, re_new_password, verif_code } = this;

    if (
      credential === "" ||
      new_password === "" ||
      re_new_password === "" ||
      verif_code === ""
    ) {

    } else {
      let resultData: any;
      resultData = await this.api.resetPasswordUsingEmail(credential, new_password, re_new_password, verif_code);

      if (resultData === 0 || resultData === -1)
        resultData = await this.api.resetPasswordUsingEmployeeId(credential, new_password, re_new_password, verif_code);

      console.log(resultData);
    }
  }

  backFunc () {
    
  }
}