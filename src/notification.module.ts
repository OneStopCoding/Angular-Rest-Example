import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms'
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NotifierModule, NotifierOptions} from "angular-notifier";
const
    customOptions: NotifierOptions = {
        position: {
            horizontal: {
                position: 'left',
                distance: 250
            },
            vertical: {
                position: 'bottom',
                distance: 12,
                gap: 10
            }
        },
        theme: 'material',
        behaviour: {
            autoHide: 5000,
            onClick: 'hide',
            onMouseover: 'pauseAutoHide',
            showDismissButton: true,
            stacking: 4
        },
        animations: {
            enabled: true,
            show: {
                preset: 'slide',
                speed: 300,
                easing: 'ease'

            },
            overlap: 150
        }
    }
@NgModule({

    imports:
        [
            NotifierModule.withConfig(customOptions)
        ],
    exports:
        [NotifierModule]
})

export class NotificationModule {

}
