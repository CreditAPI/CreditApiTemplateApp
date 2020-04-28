import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './security/login/login.component';
import { SignupComponent } from './security/signup/signup.component';
import { WizardComponent } from './wizard/wizard.component';
import { AppToastsComponent } from './app-toasts/app-toasts.component';
import { NgbdModalContent } from './services/document-modal.service';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CurrentLoanComponent } from './dashboard/current-loan/current-loan.component';
import { SidemenuComponent } from './dashboard/sidemenu/sidemenu.component';
import { MyLoansComponent } from './dashboard/my-loans/my-loans.component';
import { CalculatorComponent } from './services/calculator/calculator.component';
import { NewLoanComponent } from './dashboard/new-loan/new-loan.component';
import { CardsComponent } from './dashboard/cards/cards.component';
import { ApplicationComponent } from './application/application.component';
import { ChooseCardComponent } from './choose-card/choose-card.component';
import { DocumentsComponent } from './documents/documents.component';
import { VerificationComponent } from './verification/verification.component';
import { SigningComponent } from './signing/signing.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';

const maskoptions: Partial<IConfig> | (() => Partial<IConfig>) = {} = {};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    WizardComponent,
    AppToastsComponent,
    CurrentLoanComponent,
    SidemenuComponent,
    MyLoansComponent,
    CalculatorComponent,
    NewLoanComponent,
    CardsComponent,
    ApplicationComponent,
    ChooseCardComponent,
    DocumentsComponent,
    VerificationComponent,
    SigningComponent,
    NgbdModalContent,
    MainpageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2ImgMaxModule,
    NgxMaskModule.forRoot(maskoptions)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
