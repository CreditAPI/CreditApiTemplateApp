import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../services/app-toast.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { DocumentModalService } from './../services/document-modal.service';

@Component({
  selector: 'app-signing',
  templateUrl: './signing.component.html',
  styleUrls: ['./signing.component.scss']
})
export class SigningComponent implements OnInit {
  creditApi=CreditApi;
  name;
  loading=true;
  show_buttons=false;
  content;
  app_id;
  sms_trys=0;
  checkboxes=[];
  addons=[];

  btn_loading=false;
  sign_disabled=false;

  constructor(private toast: AppToastService,private router: Router,private _Activatedroute:ActivatedRoute,private modalService: NgbModal, public ms: DocumentModalService) { }

  ngOnInit(): void {
    this.reload();
  }

  getContent(){
    this.loading=true;
    return new Promise((resolve,reject)=>{
      this._Activatedroute.paramMap.subscribe(params => { 
        if ((params.get('app_id'))&&((params.get('app_id'))!='')) {
          this.app_id=params.get('app_id');
          /*CreditApi.getLoan(this.app_id).then(loan=>{
            if (loan.available_addons) this.addons=loan.available_addons;
          }).catch(err=>{
            this.loading=false;
            this.content=$localize`:@@errors.not_found:Not found`;
          }); */
        }
        if (params.get('name')) {
          this.name=params.get('name');
          CreditApi.getDocumentWitnInfo(params.get('name')).then((res)=>{
            this.loading=false;
            this.checkboxes=res.checkboxes||[];
            this.addons=res.addons||[];
            //console.log(res);
            resolve(res.content||$localize`Blank document`);
          }).catch(err=>{
            switch (err.code) {
              case 44: 
                console.log("Redirect");
                this.router.navigate(['/document/sign/',err.message.field,this.app_id]);
                break;
              default:
                this.content=$localize`:@@errors.not_found:Not found`;
                this.loading=false;
                reject(err);
            }
          }); 
        } else {
          this.loading=false;
          this.content=$localize`No document name provided`;
          resolve({status:404,message:$localize`No document name provided`});
        }
      });
    });
  }

  reload(){
    console.log("reloading");
    this.show_buttons=false;
    this.sms_trys=0;
    this.checkboxes=[];
    this.addons=[];
    this.content="";
    this.getContent().then(content=>{
      this.content=content;
      this.show_buttons=true;
    }).catch(err=>{
      //this.content=err.message;
    });
  }

  sign(agree,modal){
    let data=null;
    if ((this.addons.length>0)||(this.checkboxes.length>0)) {
      data={addons:[],other_docs:[]};
      let breakme=false;
      this.checkboxes.forEach(checkbox=>{
        if (checkbox.checked && checkbox.docname) data.other_docs.push(checkbox);
        if ((checkbox.required)&&(!checkbox.checked)){
          this.toast.show($localize`Error`,checkbox.required_error||'Please check neccessary flags','bg-danger text-light');
          breakme=true;
        }
      });
      this.addons.forEach(addon=>{
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
      CreditApi.signDocument(this.name,data).then(res=>{
        this.btn_loading=false;
        if (this.app_id)
          this.router.navigate(['/application',this.app_id]);
        else
          this.router.navigate(['/choosecard']);
      }).catch(err=>{
        this.btn_loading=false;
        switch(err.code) {
           case 40:
             this.sign_disabled=true;
             CreditApi.sendSMSforSigning(this.name).then(res=>{
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
           case 44: 
             console.log("Redirect");
             this.router.navigate(['/document/sign/',err.message.field,this.app_id]);
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
    if (this.addons.length>0) {
      data['addons']=[];
      this.addons.forEach(addon=>{
        if (addon.checked) data['addons'].push(addon);
      });
    }
    if (this.checkboxes.length>0) {
      data['other_docs']=[];
      this.checkboxes.forEach(checkbox=>{
        if (checkbox.checked && checkbox.docname) data['other_docs'].push(checkbox);
      });
    }
    this.btn_loading=true;
    CreditApi.signDocument(this.name,data).then(res=>{
      //console.log("Signed",res);
      this.btn_loading=false;
      this.sign_disabled=false;
      this.modalService.dismissAll();
      if (this.app_id)
        this.router.navigate(['/application',this.app_id]);
      else
        this.router.navigate(['/choosecard']);
    }).catch(err=>{
        this.btn_loading=false;
        switch(err.code) {
          case 44: 
             //console.log("Redirect");
             this.sign_disabled=false;
             this.router.navigate(['/document/sign/',err.message.field,this.app_id]);
             break;
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
