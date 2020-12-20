import { Injectable } from '@angular/core';
import CreditApi from 'credit-api';
import {NgbModal,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title" i18n="@@documentmodal.title">View document</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div *ngIf="type=='html'" class="p-2" [innerHTML]="content"></div>
      <iframe *ngIf="type=='google.docs'"  frameborder="0" [src]="('https://drive.google.com/file/d/'+content+'/preview') | safe"  style="width: 100%; height: 700px;">
          Невозможно отобразить документ онлайн. Вы можете скачать его по <a href="https://drive.google.com/file/d/{{content}}/preview" target="_blank">ссылке</a>
      </iframe>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')" i18n="@@documentmodal.buttons.close">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() content;
  type='html';
  constructor(public activeModal: NgbActiveModal) {}
}


@Injectable({
  providedIn: 'root'
})
export class DocumentModalService {
  constructor(public modalService: NgbModal,private sanitizer: DomSanitizer) { }

  show(name,data=null,type="html"){
    CreditApi.getDocument(name,data).then((content)=>{
      //console.log('LOADED',content);
      const modalRef = this.modalService.open(NgbdModalContent,{ size: 'xl' });
      if (type=='html') {
        modalRef.componentInstance.content = this.sanitizer.bypassSecurityTrustHtml(content);
      } else {
        modalRef.componentInstance.content = content;
      }
      modalRef.componentInstance.type=type||"html";
    }).catch(err=>{
      console.log('ERROR',err);
      const modalRef = this.modalService.open(NgbdModalContent,{ size: 'xl' });
      modalRef.componentInstance.content = $localize`Can't load document.`+ ' ';
    }); 
  }
}
