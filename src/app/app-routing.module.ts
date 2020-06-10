import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './security/login/login.component';
import { SignupComponent } from './security/signup/signup.component';
import { WizardComponent } from './wizard/wizard.component';
import { CurrentLoanComponent } from './dashboard/current-loan/current-loan.component';
import { MyLoansComponent } from './dashboard/my-loans/my-loans.component';
import { NewLoanComponent } from './dashboard/new-loan/new-loan.component';
import { ChooseCardComponent } from './choose-card/choose-card.component';
import { ApplicationComponent } from './application/application.component';
import { DocumentsComponent } from './documents/documents.component';
import { VerificationComponent } from './verification/verification.component';
import { SigningComponent } from './signing/signing.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { MessagesComponent } from './dashboard/messages/messages.component';
import { ChangePwdComponent } from './dashboard/change-pwd/change-pwd.component';
import { NewPaymentAccountComponent } from './dashboard/new-payment-account/new-payment-account.component';
import { PaymentAccountComponent } from './dashboard/payment-account/payment-account.component';


const routes: Routes = [
  {path:'',component:MainpageComponent},
  {path:'login', component:LoginComponent},
  {path:'register',component:SignupComponent},
  {path:'verification',component:VerificationComponent},
  {path:'wizard',component:WizardComponent},
  {path:'choosecard',component:ChooseCardComponent},
  {path:'application/:id',component:ApplicationComponent},
  {path:'dashboard',component:CurrentLoanComponent},
  {path:'dashboard/myloans',component:MyLoansComponent},
  {path:'dashboard/changepassword',component:ChangePwdComponent},
  {path:'dashboard/mymessages',component:MessagesComponent},
  {path:'dashboard/newloan',component:NewLoanComponent},
  {path:'dashboard/paymentaccount/new',component:NewPaymentAccountComponent},
  {path:'dashboard/paymentaccount/:i',component:PaymentAccountComponent},
  {path:'documents',component:DocumentsComponent},
  {path:'document/sign/:name/:app_id',component:SigningComponent},
  {path:'document/sign/:name',component:SigningComponent},
  {path:'document/:name',component:DocumentsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
