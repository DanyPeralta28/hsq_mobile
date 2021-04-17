import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient, HttpClientJsonpModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
  IonicModule.forRoot(),
  AppRoutingModule,
  IonicStorageModule.forRoot(),
  HttpClientModule,
  HttpClientJsonpModule,
],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network],
  bootstrap: [AppComponent],
})
export class AppModule {}
