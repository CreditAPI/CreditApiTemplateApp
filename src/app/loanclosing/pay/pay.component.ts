import { Component, OnInit } from '@angular/core';
import { AppToastService } from 'src/app/services/app-toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import CreditApi from 'credit-api';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  wait=true;
  error='';
  loan_closing_request;

  constructor(private toast: AppToastService,private _Activatedroute:ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.wait=true;
    this._Activatedroute.paramMap.subscribe(params => { 
      if (params.get('id')) {
        CreditApi.getClosingRequest(params.get('id')).then(lcr=>{
          this.loan_closing_request=lcr;
          this.wait=false;
        }).catch(err=>{
          this.toast.show($localize`Error`,err.message,'bg-danger text-light');
          this.error=err.message;
          this.wait=false;
        }); 
      } else {
        this.error=$localize`Not found`;
        this.wait=false;
      }
    });
  }
  gohome(reason=''){
    this.router.navigate(['/dashboard/myloans']); 
  }

}
