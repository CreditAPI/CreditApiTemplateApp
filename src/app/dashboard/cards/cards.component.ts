import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import CreditApi from 'credit-api';
import { AppToastService } from './../../services/app-toast.service';
import { Router } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  card;
  constructor(private _Activatedroute:ActivatedRoute,private toast: AppToastService,private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this._Activatedroute.paramMap.subscribe(params => { 
      CreditApi.getCards().then((cards)=>{
        this.card=cards[params.get('i')];
      }).catch(err=>{
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
      }); 
    });
  }

  open(content){
    this.modalService.open(content);
  }

  unlink(id){
    CreditApi.unlinkCard(id).then((cards)=>{
      this.toast.show($localize`Successfull`,$localize`Card successfully unlinked`,'bg-success text-light');
      this.modalService.dismissAll();
      this.router.navigate(['/dashboard']); 
    }).catch(err=>{
      this.modalService.dismissAll();
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    }); 
  }

}
