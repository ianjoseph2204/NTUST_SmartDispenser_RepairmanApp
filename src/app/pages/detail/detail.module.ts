// @ts-ignore
import { NgModule } from '@angular/core';
// @ts-ignore
import { CommonModule } from '@angular/common';
// @ts-ignore
import { FormsModule } from '@angular/forms';
// @ts-ignore
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailPage } from './detail.page';
import {ZXingScannerModule} from '@zxing/ngx-scanner';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ZXingScannerModule,
  ],
  declarations: [DetailPage]
})
export class DetailPageModule {}
