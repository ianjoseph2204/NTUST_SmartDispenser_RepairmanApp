// @ts-ignore
import { NgModule } from '@angular/core';
// @ts-ignore
import { CommonModule } from '@angular/common';
// @ts-ignore
import { FormsModule } from '@angular/forms';
// @ts-ignore
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QrcodeScannerPage } from './qrcode-scanner.page';
import {ZXingScannerModule} from '@zxing/ngx-scanner';

const routes: Routes = [
  {
    path: '',
    component: QrcodeScannerPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ZXingScannerModule
    ],
  declarations: [QrcodeScannerPage]
})
export class QrcodeScannerPageModule {}
