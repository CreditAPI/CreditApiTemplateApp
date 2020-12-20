import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from 'src/app/services/app-toast.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { DocumentModalService } from 'src/app/services/document-modal.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit {
  creditApi=CreditApi;
  timezone;
  //loan;
  loading=true;
  show_buttons=false;
  data;
  btn_loading=false;
  sign_disabled=false;
  sms_trys=0;


  constructor(private toast: AppToastService,private router: Router,private modalService: NgbModal,public ms: DocumentModalService) { }

  ngOnInit(): void {
    this.loading=true;
    this.timezone=environment.TimeZone;
    let date_to_allow_payment=new Date();
    date_to_allow_payment.setDate(date_to_allow_payment.getDate() - environment.DaysBeforePaymentAllowed||3 );

    CreditApi.getProlongationAgreement().then(result=>{
      this.data=result.result;
      this.loading=false;
      this.show_buttons=true;
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
      this.router.navigate(['/dashboard/myloans']); 
      this.loading=false;
    });
  }


  sign(agree,modal){
    let data=null;
    if ((this.data.addons.length>0)||(this.data.checkboxes.length>0)) {
      data={addons:[],other_docs:[]};
      let breakme=false;
      this.data.checkboxes.forEach(checkbox=>{
        if (checkbox.checked && checkbox.docname) data.other_docs.push(checkbox);
        if ((checkbox.required)&&(!checkbox.checked)){
          this.toast.show($localize`Error`,checkbox.required_error||'Please check neccessary flags','bg-danger text-light');
          breakme=true;
        }
      });
      this.data.addons.forEach(addon=>{
        if (addon.checked) data.addons.push(addon);
        if ((addon.required)&&(!addon.checked)){
          this.toast.show($localize`Error`,addon.required_error||'Please check neccessary flags','bg-danger text-light');
          breakme=true;
        }
      });
      if (breakme) {
        return;
      } 
    }
    if (!agree || agree.checked) {
      //console.log("signinfg with data",data);
      this.btn_loading=true;
      CreditApi.signProlongationAgreement(data).then(res=>{
        this.btn_loading=false;
        let loan_prolongation_request=res.result;
        console.log(loan_prolongation_request);
        this.router.navigate(['/prolongation/pay/',loan_prolongation_request.objectId]);
      }).catch(err=>{
        this.btn_loading=false;
        switch(err.code) {
           case 40:
             this.sign_disabled=true;
             CreditApi.signProlongationAgreement({'send_new_sms_code':true}).then(res=>{
               this.sms_trys=0;
               this.modalService.open(modal,{backdrop : 'static', keyboard : false});
             }).catch(err=>{
               switch(err.code) {
                 case 41:
                   this.modalService.open(modal,{backdrop : 'static', keyboard : false});
                   break;
                 default:
                  this.toast.show($localize`Error`,err.message,'bg-danger text-light');
               }
             }); 
             break;
           default:
             this.toast.show($localize`Error`,err.message,'bg-danger text-light');
        }
      });
    } else 
      this.toast.show($localize`Error`,'Please read with documents and check agree flag','bg-danger text-light');
  } 

  signWithSMS(code) {
    if (code.trim()=='') {
      this.toast.show($localize`Error`,'Please, enter the code','bg-danger text-light');
      return;
    }
    let data={'sms_code':code};
    if (this.data.addons.length>0) {
      data['addons']=[];
      this.data.addons.forEach(addon=>{
        if (addon.checked) data['addons'].push(addon);
      });
    }
    if (this.data.checkboxes.length>0) {
      data['other_docs']=[];
      this.data.checkboxes.forEach(checkbox=>{
        if (checkbox.checked && checkbox.docname) data['other_docs'].push(checkbox);
      });
    }
    this.btn_loading=true;
    CreditApi.signProlongationAgreement(data).then(res=>{
      //console.log("Signed",res);
      let loan_prolongation_request=res.result;
      this.btn_loading=false;
      this.sign_disabled=false;
      this.modalService.dismissAll();
      this.router.navigate(['/prolongation/pay/',loan_prolongation_request.objectId]);
    }).catch(err=>{
        this.btn_loading=false;
        switch(err.code) {
          case 42:
            if (this.sms_trys>=3) {
              this.sign_disabled=false;
              this.toast.show($localize`Error`,'Too many attempts','bg-danger text-light');
              this.modalService.dismissAll();
              break;
            }
          case 43:
            this.sms_trys++;
          default:
            this.toast.show($localize`Error`,err.message,'bg-danger text-light');
        }
        console.log(err);
    });
  }
}


