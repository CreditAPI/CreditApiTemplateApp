import { Component, OnInit } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from 'src/app/services/app-toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {
  

  wait=true;
  error='';
  loan_prolongation_request;

  constructor(private toast: AppToastService,private _Activatedroute:ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.wait=true;
    this._Activatedroute.paramMap.subscribe(params => { 
      if (params.get('id')) {
        CreditApi.getProlongationRequest(params.get('id')).then(lpr=>{
          this.loan_prolongation_request=lpr;
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
