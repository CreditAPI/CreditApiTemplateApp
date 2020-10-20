import { Injectable } from '@angular/core';
import CreditApi from 'credit-api';
import {NgbModal,NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { Component, Input } from '@angular/core';

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
      <div class="p-2" [innerHTML]="content"></div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')" i18n="@@documentmodal.buttons.close">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() content;

  constructor(public activeModal: NgbActiveModal) {}
}


@Injectable({
  providedIn: 'root'
})
export class DocumentModalService {
  constructor(public modalService: NgbModal) { }

  show(name){
    CreditApi.getDocument(name).then((content)=>{
      //console.log('LOADED',content);
      const modalRef = this.modalService.open(NgbdModalContent,{ size: 'xl' });
      modalRef.componentInstance.content = content;
    }).catch(err=>{
      console.log('ERROR',err);
      const modalRef = this.modalService.open(NgbdModalContent,{ size: 'xl' });
      modalRef.componentInstance.content = $localize`Can't load document.`+ ' ';
    }); 
  }
}
