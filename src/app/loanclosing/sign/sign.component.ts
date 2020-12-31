import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from 'src/app/services/app-toast.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentModalService } from 'src/app/services/document-modal.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit {
  creditApi=CreditApi;
  btn_loading=false;
  loading=false;
  timezone;
  show_buttons=false;
  data;
  sign_disabled=false;
  sms_trys=0;
  should_agree=true;

  constructor(private sanitizer: DomSanitizer,private toast: AppToastService,private router: Router,private modalService: NgbModal,public ms: DocumentModalService) { }


  ngOnInit(): void {
    this.should_agree=true;
    this.loading=true;
    this.timezone=environment.TimeZone;
    CreditApi.getClosingAgreement().then(result=>{
      this.data=result.result;
      if (this.data.type=='dummy' && this.data.addons && this.data.addons.length ) {
        return CreditApi.getDocumentWitnInfo(this.data.addons[0].docname);
      } else {
        return null;
      } 
    }).then(doc_to_replace=>{
      if (doc_to_replace) {
        this.should_agree=false;
        this.data.content=doc_to_replace.content;
      }
      //if (this.data.type=='html')
        this.data.content=this.sanitizer.bypassSecurityTrustHtml(this.data.content);
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
    if (!agree || agree.checked || !this.should_agree) {
      //console.log("signinfg with data",data);
      this.btn_loading=true;
      CreditApi.signClosingAgreement(data).then(res=>{
        this.btn_loading=false;
        let loan_closing_request=res.result;
        console.log(loan_closing_request);
        this.router.navigate(['/closing/pay/',loan_closing_request.objectId]);
      }).catch(err=>{
        this.btn_loading=false;
        switch(err.code) {
           case 40:
             this.sign_disabled=true;
             CreditApi.signClosingAgreement({'send_new_sms_code':true}).then(res=>{
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
    CreditApi.signClosingAgreement(data).then(res=>{
      //console.log("Signed",res);
      let loan_closing_request=res.result;
      this.btn_loading=false;
      this.sign_disabled=false;
      this.modalService.dismissAll();
      this.router.navigate(['/closing/pay/',loan_closing_request.objectId]);
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
