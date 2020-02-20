import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { MymatModule } from './mymat/mymat.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from './sidenav/sidenav.component';
import { CharaComponent } from './chara/chara.component';
import { HomeComponent } from './home/home.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
// formsModule is getting imported in mymat importer component

import { ValidateService } from './shared/validate.service';
import { AuthService } from './shared/auth.service';
import {FlashMessagesModule} from 'angular2-flash-messages';
import { ColeTestButtonComponent } from './cole-test-button/cole-test-button.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chara123', component: CharaComponent }
  // { path: 'board', component: DashComponent }
 ];

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    CharaComponent,
    SigninComponent,
    HomeComponent,
    SignupComponent,
    ColeTestButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MymatModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot()
  ],
  providers: [ValidateService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
