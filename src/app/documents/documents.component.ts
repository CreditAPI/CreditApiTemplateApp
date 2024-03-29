import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from './../services/app-toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  documents=[];
  loading=true;
  document;
  content='';
  type='html';
  constructor(private toast: AppToastService,private _Activatedroute:ActivatedRoute) {

  }

  ngOnInit(): void {
    this.getContent().then(name=>{
      CreditApi.getRequiredDocuments().then(documents=>{
        this.documents=documents;
        if (name)
          this.documents.forEach(doc => {
            if (doc.name==name) {
              this.document=doc;
              this.type=doc.document_type;
            }
          });
      }).catch(err=>{
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
      });
    }).catch(err=>{
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });     
  }
  

  getContent(){
    this.document=null;
    return new Promise((resolve,reject)=>{
      this._Activatedroute.paramMap.subscribe(params => { 
        this.content='';
        this.loading=true;
        if (params.get('name')) {
          this.documents.forEach(doc => {
            if (doc.name==params.get('name')) 
              this.type=doc.document_type;
          });
          CreditApi.getDocument(params.get('name')).then((content)=>{
            this.content=content;
            this.loading=false;
            resolve(params.get('name'));
          }).catch(err=>{
            this.content=$localize`Can't load document.`;
            this.loading=false;
            reject(err);
          }); 
        } else {
          this.loading=false;
          resolve(null);
        }
      });
    });
  }
}
