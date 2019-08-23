import {Component, OnInit} from '@angular/core';
import {PreferenceManagerService} from '../../services/PreferenceManager/preference-manager.service';
import {StaticVariables} from '../../classes/StaticVariables/static-variables';
import {AlertController, NavController} from '@ionic/angular';
import {DispenserAPIService} from '../../services/DispenserAPI/dispenser-api.service';
import { LoginSessionService } from 'src/app/services/LoginSession/login-session.service';

@Component({
  selector: 'app-report-repair',
  templateUrl: './report-repair.page.html',
  styleUrls: ['./report-repair.page.scss'],
})
export class ReportRepairPage implements OnInit {

  public device_id: any;
  public device_type: any;
  public employee_name: string;
  public device_building_position: string;
  public device_placement_position: string;
  public problem_description: string;
  public mission_number: any;

  public result_description: string = '';
  private urlImage: any = [null, null, null];
  private fileImage: any = [null, null, null];

  constructor(
      private alertCtrl: AlertController,
      private pref: PreferenceManagerService,
      private api: DispenserAPIService,
      private navCtrl: NavController,
      private chk: LoginSessionService
    ) { }

  async ngOnInit() {
    await this.getPrefData();
  }

  ionViewDidEnter () {
    this.chk.blockToInternalPages();
  }

  /**
   * Get the data from preference and store it into local variables.
   */
  async getPrefData(){
    this.device_id = await this.pref.getData(StaticVariables.KEY__DEVICE_ID);
    this.device_type = await this.pref.getData(StaticVariables.KEY__DEVICE_TYPE);
    this.employee_name = await this.pref.getData(StaticVariables.KEY__EMPLOYEE_NAME);
    this.device_building_position = await this.pref.getData(StaticVariables.KEY__DEVICE_BUILDING_LOC);
    this.device_placement_position = await this.pref.getData(StaticVariables.KEY__DEVICE_PLACEMENT_LOC);
    this.problem_description = await this.pref.getData(StaticVariables.KEY__PROBLEM_DESCRIPTION);
    this.mission_number = await this.pref.getData(StaticVariables.KEY__MISSION_NUMBER)
  }

  /**
   * Go back to Home page.
   */
  backButton(){
    this.navCtrl.back();
  }

  /**
   * Add image from gallery or camera.
   */
  async onFileSelect(event: any, index: number) {
    // Limit size image to 10 Mb
    if (event.target.files[0].size <= 10485760) {

      // Check image length, image cannot empty
      if (event.target.files.length > 0) {
        this.fileImage[index] = event.target.files[0];

        let reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // Read file as data url

        // Called once readAsDataURL is completed
        reader.onload = (event) => {
          this.urlImage[index] = reader.result; // this.imageIndex++;
        }
      }

    } else {

      // Send message if data is to big
      const tooBig = await this.alertCtrl.create({
        mode: "ios",
        header: 'File Size is to Big',
        message: 'Please upload file below 10 Mb!',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              console.log('Confirm Cancel: Ok');
            }
          }
        ]
      });
      await tooBig.present();
    }
  }

  /**
   * @param index is number image uploaded by user
   * Rearrange the array if user delete an image
   */
  async delete(index: number) {
    this.fileImage[index] = null;
    this.urlImage[index] = null;
  }

  /**
   * Send the report repair data into database, show alert, & go back to the Home page.
   */
  async submitButton(){

    console.log(this.result_description);

    await this.api.repairCompleteReport(this.fileImage, this.mission_number, this.result_description);

    let alert: any;

    alert = await this.alertCtrl.create({
      mode: "ios",
      header: 'Submission Success!',
    });
    alert.present(); //Display the alert message
    this.backButton();
  }
}
