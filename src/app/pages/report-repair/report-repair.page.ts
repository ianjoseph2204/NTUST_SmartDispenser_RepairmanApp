import { Component, OnInit } from '@angular/core';
import {PreferenceManagerService} from '../../services/PreferenceManager/preference-manager.service';
import {StaticVariables} from '../../classes/StaticVariables/static-variables';
import {AlertController, NavController} from '@ionic/angular';

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
  private urlImage: any = [null, null, null];
  private fileImage: any = [null, null, null];

  constructor(
      private alertCtrl: AlertController,
      private pref: PreferenceManagerService,
      private navCtrl: NavController) { }

  async ngOnInit() {
    await this.getPrefData();
  }

  async getPrefData(){
    this.device_id = await this.pref.getData(StaticVariables.KEY__DEVICE_ID);
    this.device_type = await this.pref.getData(StaticVariables.KEY__DEVICE_TYPE);
    this.employee_name = await this.pref.getData(StaticVariables.KEY__EMPLOYEE_NAME);
    this.device_building_position = await this.pref.getData(StaticVariables.KEY__DEVICE_BUILDING_LOC);
    this.device_placement_position = await this.pref.getData(StaticVariables.KEY__DEVICE_PLACEMENT_LOC);
    this.problem_description = await this.pref.getData(StaticVariables.KEY__PROBLEM_DESCRIPTION);
  }

  backButton(){
    this.navCtrl.back();
  }

  /**
   * Method to add image
   */
  async onFileSelect(event: any, index: number) {

    console.log(index);

    // Limit size image to 10 Mb
    if (event.target.files[0].size <= 10485760) {

      // Check image length, image cannot empty
      if (event.target.files.length > 0) {
        this.fileImage[index] = event.target.files[0];

        let reader = new FileReader();

        // Read file as data url
        reader.readAsDataURL(event.target.files[0]);

        // Called once readAsDataURL is completed
        reader.onload = (event) => {
          this.urlImage[index] = reader.result;
          // this.imageIndex++;
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
   * Method to rearrange array if user delete the image
   */
  async delete(index: number) {

    this.fileImage[index] = null;
    this.urlImage[index] = null;
  }
}
