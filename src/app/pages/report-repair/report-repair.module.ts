import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportRepairPage } from './report-repair.page';

const routes: Routes = [
  {
    path: '',
    component: ReportRepairPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReportRepairPage]
})
export class ReportRepairPageModule {}
