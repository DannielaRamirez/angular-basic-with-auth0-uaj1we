import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import { CallbackComponent } from './callback.component';
import { AuthService } from './auth/auth.service';

@NgModule({
  imports: [ BrowserModule, FormsModule, HttpClientModule, AppRoutingModule ],
  providers: [AuthService],
  declarations: [ AppComponent, HelloComponent, CallbackComponent ],
  bootstrap:[ AppComponent ]
})
export class AppModule { }
