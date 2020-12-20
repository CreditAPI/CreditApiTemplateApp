import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
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
import { ApplicationComponent } from './application/application.component';
import { ChooseCardComponent } from './choose-card/choose-card.component';
import { DocumentsComponent } from './documents/documents.component';
import { VerificationComponent } from './verification/verification.component';
import { SigningComponent } from './signing/signing.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { MessagesComponent } from './dashboard/messages/messages.component';
import { ChangePwdComponent } from './dashboard/change-pwd/change-pwd.component';
import { NewPaymentAccountComponent } from './dashboard/new-payment-account/new-payment-account.component';
import { PaymentAccountComponent } from './dashboard/payment-account/payment-account.component';
import { FreeformComponent } from './services/freeform/freeform.component';
import { PaymentComponent } from './services/payment/payment.component';
import { SafePipe } from './pipes/safe.pipe';
import { NgbDateCustomParserFormatter } from './services/NgbDateFormatter/NgbDateCustomParserFormatter';
import { SignComponent } from './prolongation/sign/sign.component';
import { PayComponent } from './prolongation/pay/pay.component';
import { ResultComponent } from './prolongation/result/result.component';

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
    ApplicationComponent,
    ChooseCardComponent,
    DocumentsComponent,
    VerificationComponent,
    SigningComponent,
    NgbdModalContent,
    MainpageComponent,
    MessagesComponent,
    ChangePwdComponent,
    NewPaymentAccountComponent,
    PaymentAccountComponent,
    FreeformComponent,
    PaymentComponent,
    SafePipe,
    SignComponent,
    PayComponent,
    ResultComponent
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
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
