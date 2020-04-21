import { Component, OnInit,ElementRef } from '@angular/core';
import CreditApi from 'credit-api';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AppToastService } from './../services/app-toast.service';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import {KladrApiService} from './../services/kladr/kladr-api.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  form;
  fields;
  activeId:string = "panel-basic-info";
  geolocation;
  autocomplete;
  gm_session_token;
  application= [{"label":$localize`Basic info`,
                "fields":[{name: "last_name","label":$localize`Last name`},
                          {name: "first_name","label":$localize`First name`},
                          {name: "patronymic","label":$localize`Patronymic`},
                          {name: "gender","label":$localize`Gender`,type:"choice",choices:{"1":$localize`Male`,"2":$localize`female`}},
                          {name: "birthdate","label":$localize`Date of birth`,type:"date"},
                          {name: "birth_place","label":$localize`Place of birth`}]},
                {"label":$localize`Passport`,
                "fields":[{name: "passport.series","label":$localize`Series`,mask:"0000",mask_typed:true},
                         {name: "passport.number","label":$localize`Number`,mask:"000000",mask_typed:true},
                         {name: "passport.issued_at","label":$localize`Issued at`,type:"date"},
                         {name: "passport.issued_by","label":$localize`Issued by`},
                         {name: "passport.code","label":$localize`Authority code`,mask:"000-000",mask_typed:true},
                         {name: "passport.snils","label":$localize`SNILS`,mask:"00000000000",mask_typed:true}]},
                {"label":$localize`Address`,
                "fields":[{name: "res","label":$localize`Residential address`,col_size:12,type:"title"},
                         {name: "address_res.city","label":$localize`City`,autocompleteAddress:"city"},
                         {name: "address_res.street","label":$localize`Street`,autocompleteAddress:"street"},
                         {name: "address_res.house","label":$localize`House`,autocompleteAddress:"house"},
                         {name: "address_res.flat","label":$localize`Flat`},
                         {name: "address_res.index","label":$localize`ZIP`},
                         {name: "address_res.region","label":$localize`Region`,type:"hidden"},
                         {name: "req","label":$localize`Registration address`,col_size:12,type:"title"},
                         {name: "address_the_same","label":$localize`Registration address is the same as residential address`,col_size:12,type:"checkbox"},
                         {name: "address_reg.city","label":$localize`City`,autocompleteAddress:"city"},
                         {name: "address_reg.street","label":$localize`Street`,autocompleteAddress:"street"},
                         {name: "address_reg.house","label":$localize`House`,autocompleteAddress:"house"},
                         {name: "address_reg.flat","label":$localize`Flat`},
                         {name: "address_reg.index","label":$localize`ZIP`},
                         {name: "address_reg.region","label":$localize`Region`,type:"hidden"}]},
  ];

  known_errors={'Please, correct mistakes':$localize`Please, correct mistakes`}

  constructor(private el: ElementRef,
             private fb: FormBuilder,
             private toast: AppToastService,
             private kladr: KladrApiService,
             private router: Router) { 
  }

  ngOnInit(): void {
    CreditApi.getApplicationFields().then(fields=>{
      this.fields=fields;
      this.generateForm(fields);
      this.geolocate();
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  generateForm(fields){
    this.form = this.fb.group(this.getFormdata(fields));
  }



  getFormdata(fields,pre=''){
    var formdata={}; 
    Object.keys(fields).forEach(i => {
      var validators=[];
      if (fields[i].type!='OBJECT') {
        validators=[];
        if (fields[i].required)
          validators.push(Validators.required);
        let parts=pre.split('.');
        let user=CreditApi.User;
        if (parts) parts.forEach(key=>{
          if (key) { 
            user=user[key];
          } 
        });
        switch(fields[i].type) {
          case 'DATE':
            if ((user)&&(user[i])) {
              let date=new Date(user[i]);
              let y=Number(date.toISOString().substr(0,4));
              let m=Number(date.toISOString().substr(5,2));
              let d=Number(date.toISOString().substr(8,2));
              formdata[pre+i]=[{year:y,month:m,day:d},validators];
            } else
              formdata[pre+i]=['',validators];
            break;
          default:
            if (user)
              formdata[pre+i]=[user[i]||'',validators];
            else 
              formdata[pre+i]=['',validators];
        }
      } else {
        formdata= Object.assign( {}, formdata, this.getFormdata(fields[i].childrens,pre+i+'.'));
      }
    });
    return formdata;
  }

  checkbox_change(event){
    if (event.target.checked) {
      this.form.controls['address_reg.region'].setValue(this.form.controls['address_res.region'].value);
      this.form.controls['address_reg.city'].setValue(this.form.controls['address_res.city'].value);
      this.form.controls['address_reg.street'].setValue(this.form.controls['address_res.street'].value);
      this.form.controls['address_reg.house'].setValue(this.form.controls['address_res.house'].value);
      this.form.controls['address_reg.flat'].setValue(this.form.controls['address_res.flat'].value);
      this.form.controls['address_reg.index'].setValue(this.form.controls['address_res.index'].value);
    } else {
      this.form.controls['address_reg.region'].setValue(null);
      this.form.controls['address_reg.city'].setValue(null);
      this.form.controls['address_reg.street'].setValue(null);
      this.form.controls['address_reg.house'].setValue(null);
      this.form.controls['address_reg.flat'].setValue(null);
      this.form.controls['address_reg.index'].setValue(null);
    }
  }

  save(){
    if (!this.form.valid){
      this.focusInvalid();
      this.toast.show($localize`Error`,"Please, correct mistakes",'bg-danger text-light');
      return;
    }
    let data=this.getDataFromForm(this.fields);
    data['geolocation']=this.geolocation;
    console.log('DATA',data);
    CreditApi.saveUserdata(data).then(fields=>{
      console.log('SAVED');
      //this.toast.show($localize`Success`,'Successfully saved','bg-success');//do we need show it?
      if (!CreditApi.User.verificationFinished) {
        this.router.navigate(['/verification']);
      } else if (localStorage.getItem('amount')) {
        this.router.navigate(['/choosecard']);
      } else
        this.router.navigate(['/dashboard']);
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }
  focusInvalid(){
    for (const key of Object.keys(this.form.controls)) {
      if (this.form.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('.ng-invalid')[0];
        this.form.controls[key].markAsTouched()
        invalidControl.focus();
        break;
     }
    }
  }

  getDataFromForm(fields,pre=''){
    var obj={};
    Object.keys(fields).forEach(i => {
      if (fields[i].type!='OBJECT') {
        switch(fields[i].type) {
          case 'DATE':
            let d=this.form.controls[pre+i].value;

            obj[i]=d.year+'-'+(d.month>9?d.month:'0'+d.month)+'-'+(d.day>9?d.day:'0'+d.day);
            break;
          case 'INTEGER':
            obj[i]=parseInt(this.form.controls[pre+i].value);
            break;
          default:
            obj[i]=this.form.controls[pre+i].value;
        }  
      } else {
        obj[i]=this.getDataFromForm(fields[i].childrens,i+'.');
      }
    });
    return obj;
  }

  geolocate(){
    if (navigator.geolocation) {
        var that=this;
        navigator.geolocation.getCurrentPosition(function(position) {
          that.geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
    }
  }


  onAddressChange(event){
    if (event.target.value.trim()!='') {
      let options={};
      let id_parts=event.target.id.split(".");
      switch(id_parts[1]){
        case 'city':
          options["contentType"]="city";
          options["withParent"]=true;
          break;
        case 'street':
          options["contentType"]="street";
          var parent=document.getElementById(id_parts[0]+".city");
          if (!parent.getAttribute('data-kladr-id')) {
            this.toast.show($localize`Warning`,$localize`Please, choose city first`,'bg-warning text-light');
            return;
          }
          options["cityId"]=parent.getAttribute('data-kladr-id');
          break;
        case 'house':
          options["contentType"]="building";
          var parent=document.getElementById(id_parts[0]+".street");
          if (!parent.getAttribute('data-kladr-id')) {
            this.toast.show($localize`Warning`,$localize`Please, choose street first`,'bg-warning text-light');
            return;
          }
          options["streetId"]=parent.getAttribute('data-kladr-id');
          break;
        default:
          return;
      }
      this.kladr.predict(event.target.value.trim(),options).then((result)=>{
        this.displayAddressSuggestions(result["result"], event.target);
      }).catch((err)=>{
        console.log(err);
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
      });
    }
  }
  onAddressChoose(event,fieldname) {
    let choosed=JSON.parse(event.target.getAttribute("data-prediction"));
    if (choosed.id!="Free") {
      //console.log(choosed);
      this.form.controls[fieldname].setValue(choosed.name);
      event.target.parentNode.parentNode.querySelector('.form-control').setAttribute("data-kladr-id",choosed.id);
      event.target.parentNode.style.display='none';
      let id_parts=fieldname.split(".");
      switch(id_parts[1]){
        case 'city':
          this.form.controls[id_parts[0]+'.region'].setValue(choosed.id.substr(0,2));
          break;
        case 'house':
          this.form.controls[id_parts[0]+'.index'].setValue(choosed["zip"]);
          break;
      }
    }
  }

  displayAddressSuggestions(predictions, target) {
    let prompt=target.parentNode.parentNode.querySelector('.prompt-value');
    prompt.innerHTML="";
    var classname="";
    predictions.forEach(function(prediction) {
      classname="available";
      if (prediction.id=="Free") {
        classname="unavailable"; // ;-)
      } 
      var li = document.createElement('li');
      li.appendChild(document.createTextNode(prediction.name));
      li.setAttribute("data-prediction", JSON.stringify(prediction));
      li.setAttribute("class",classname);
      prompt.appendChild(li);
    });
    prompt.style.display='block';
  }
}
