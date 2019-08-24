// @ts-ignore
import {Component, OnInit} from '@angular/core';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner/ngx';
import {PreferenceManagerService} from '../../services/PreferenceManager/preference-manager.service';
import {StaticVariables} from '../../classes/StaticVariables/static-variables';

@Component({
    selector: 'app-qrcode-scanner',
    templateUrl: './qrcode-scanner.page.html',
    styleUrls: ['./qrcode-scanner.page.scss'],
})
export class QrcodeScannerPage implements OnInit {

    options: BarcodeScannerOptions;
    scannedData: any  = {};
    prefDeviceID: string = '';
    scannedDeviceID: string = '';


    constructor(
        private scanner: BarcodeScanner,
        private pref: PreferenceManagerService
    ) {
    }

    async ngOnInit() {
        await this.getDeviceIDFromPref();
        this.scanQRCode();
    }

    /*ionViewDidEnter () {
        if (this.prefDeviceID !== "" && this.scannedDeviceID !== "") {
            this.getDeviceIdFromQRCode(this.scannedData);
            this.setArrival(this.prefDeviceID, this.scannedDeviceID);
        }
    }*/

    scanQRCode() {
        this.options = {
            prompt: 'Scan your barcode'
        };

        // noinspection CommaExpressionJS
        this.scanner.scan(this.options).then(async (data) => {
            this.scannedData = data['text'];
            if(this.scannedData !== {}){
                await this.getDeviceIdFromQRCode(this.scannedData);
                await this.setArrival(this.scannedDeviceID, this.prefDeviceID);
            }
        }), (err) => {
            console.log('Error: ', err);
        };
    }

    async getDeviceIDFromPref(){
        this.prefDeviceID = await this.pref.getData(StaticVariables.KEY__DEVICE_ID);
    }

    getDeviceIdFromQRCode(url: string){
        const words = url.split('/');
        this.scannedDeviceID = words[words.length - 1];
        console.log("QRCode Device ID : " + this.scannedDeviceID);
        console.log("Pref Device ID : " + this.prefDeviceID);
    }

    setArrival(string1: string, string2: string){
        if(string1 === string2){
            console.log("Arrival: " + true);
        }
    }
}
