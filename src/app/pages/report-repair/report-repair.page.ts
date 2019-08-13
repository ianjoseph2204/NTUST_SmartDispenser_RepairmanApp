import { Component, OnInit } from '@angular/core';
import {PreferenceManagerService} from '../../services/PreferenceManager/preference-manager.service';
import {StaticVariables} from '../../classes/StaticVariables/static-variables';
import {NavController} from '@ionic/angular';

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

  constructor(
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
}
