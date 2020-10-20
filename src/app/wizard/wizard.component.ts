import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import CreditApi from 'credit-api';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AppToastService } from './../services/app-toast.service';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import {KladrApiService} from './../services/kladr/kladr-api.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  newfiles={};
  form_disabled=false;
  @ViewChild('updateDataModal') updateDataModal;
  data_to_update=[];

  application= [{"label":$localize`Basic info`,
                "fields":[{name: "last_name","label":$localize`Last name`,capitalized:true},
                          {name: "first_name","label":$localize`First name`,capitalized:true},
                          {name: "patronymic","label":$localize`Patronymic`,capitalized:true},
                          {name: "gender","label":$localize`Gender`,type:"choice",choices:{"1":$localize`Male`,"2":$localize`female`}},
                          {name: "birthdate","label":$localize`Date of birth`,type:"date"},
                          {name: "birth_place","label":$localize`Place of birth`,capitalized:true}]},
                {"label":$localize`Passport`,
                "fields":[{name: "passport.series","label":$localize`Series`,mask:"0000",mask_typed:true},
                         {name: "passport.number","label":$localize`Number`,mask:"000000",mask_typed:true},
                         {name: "passport.issued_at","label":$localize`Issued at`,type:"date"},
                         {name: "passport.issued_by","label":$localize`Issued by`},
                         {name: "passport.code","label":$localize`Authority code`,mask:"000-000",mask_typed:true,mask_save_spec:true},
                         {name: "passport.snils","label":$localize`SNILS`,mask:"00000000000",mask_typed:true}]},
                {"label":$localize`Address`,
                "fields":[{name: "res","label":$localize`Residential address`,col_size:12,type:"title",unmapped:true},
                         {name: "address_res.city","label":$localize`City`,autocompleteAddress:"city"},
                         {name: "address_res.street","label":$localize`Street`,autocompleteAddress:"street"},
                         {name: "address_res.house","label":$localize`House`,autocompleteAddress:"house"},
                         {name: "address_res.flat","label":$localize`Flat`},
                         {name: "address_res.index","label":$localize`ZIP`},
                         {name: "address_res.region","label":$localize`Region`,type:"hidden"},
                         {name: "req","label":$localize`Registration address`,col_size:12,type:"title",unmapped:true},
                         {name: "address_the_same","label":$localize`Registration address is the same as residential address`,col_size:12,type:"checkbox",unmapped:true},
                         {name: "address_reg.city","label":$localize`City`,autocompleteAddress:"city"},
                         {name: "address_reg.street","label":$localize`Street`,autocompleteAddress:"street"},
                         {name: "address_reg.house","label":$localize`House`,autocompleteAddress:"house"},
                         {name: "address_reg.flat","label":$localize`Flat`},
                         {name: "address_reg.index","label":$localize`ZIP`},
                         {name: "address_reg.region","label":$localize`Region`,type:"hidden"}]},
                {"label":$localize`Job info`,
                "fields":[{name: "job.company","label":$localize`Company`},
                         {name: "job.role","label":$localize`Role`},
                         {name: "job.mainphone","label":$localize`Work phone`},
                         {name: "job.income","label":$localize`Income`},
                         {name: "job.monthexpenses","label":$localize`Month expenses`},
                         {name: "job.contact_person","label":$localize`Contact person`},
                         {name: "job.contact_phone","label":$localize`Contact person's phone`}]},
                {"label":$localize`Documents`,
                "fields":[{name: "passport_scan_first","label":$localize`Passport first page`,type:"file",value:{name:$localize`Choose file`,url:'assets/img/noimage.jpeg',loading:false}},
                          {name: "passport_scan_second","label":$localize`Passport second page`,type:"file",value:{name:$localize`Choose file`,url:'assets/img/noimage.jpeg',loading:false}},
                          {name: "passport_scan_selfie","label":$localize`Selfie with passport`,type:"file",value:{name:$localize`Choose file`,url:'assets/img/noimage.jpeg',loading:false}},
                          {name: "credit_card_scan","label":$localize`Credit card photo`,type:"file",value:{name:$localize`Choose file`,url:'assets/img/noimage.jpeg',loading:false}},
                          {name: "car_title","label":$localize`Car title`,type:"file",value:{name:$localize`Choose file`,url:'assets/img/noimage.jpeg',loading:false}},
                          {name: "car_title_back","label":$localize`Car title back`,type:"file",value:{name:$localize`Choose file`,url:'assets/img/noimage.jpeg',loading:false}}
                         ]}
  ];

  constructor(private el: ElementRef,
             private fb: FormBuilder,
             private toast: AppToastService,
             private kladr: KladrApiService,
             private imageResizer: Ng2ImgMaxService,
             private modalService: NgbModal,
             private router: Router) { 
  }

  ngOnInit(): void {
    CreditApi.getApplicationFields().then(fields=>{
      this.fields=fields;
      this.excludeNotExistedFields();
      this.includeNotListedFields();
      this.generateForm();
      this.geolocate();
    }).catch(err=>{
      this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  generateForm(){
    this.form = this.fb.group(this.getFormdata(this.fields));
  }

  excludeNotExistedFields(){
    var count=0;
    for (var i in this.application) {
      count=0;
      for (var j=0;j<this.application[i].fields.length;j++) {
        let appfieldname=this.application[i].fields[j].name.split(".")[0];
        //console.log('Checking '+j+'('+appfieldname+')')
        if ((!this.fields[appfieldname]) && (!this.application[i].fields[j]['unmapped'])) {
          //console.log('excluding '+j+'('+appfieldname+')')
          this.application[i].fields.splice(j,1);
          j-=1;
        } else { 
          count++;
          if (this.fields[appfieldname]) { 
            this.fields[appfieldname].included=true;
            if ((this.fields[appfieldname].type=='FILE')&&(CreditApi.User[appfieldname])) {
               this.application[i].fields[j]['value']={name:CreditApi.User[appfieldname].name,url:CreditApi.User[appfieldname].url,loading:false};
            }
          }
        }
      }
      if (count==0)
        this.application.splice(parseInt(i),1);
    }
  }
  includeNotListedFields(){
    var newfields=[];
    var types={'FILE':'file','STRING':'text', 'INTEGER':'number', 'FLOAT':'number', 'DATE' : 'date', 'TEXT':'textarea', 'BOOLEAN': "checkbox" };
    for (var i in this.fields) {
      if (!this.fields[i]['included']) {
        if (types[this.fields[i].type]) {
          let newfield={name:i,label:i,type:types[this.fields[i].type]};
          if (this.fields[i]['required'])
            newfield['required']=this.fields[i]['required'];
          if (this.fields[i].type=='FILE') {
            if (CreditApi.User[i])
              newfield['value']={name:CreditApi.User[i].name,url:CreditApi.User[i].url,loading:false};
            else
              newfield['value']={name:$localize`Choose file`,url:'assets/img/noimage.jpeg',loading:false};
          }
          newfields.push(newfield);
        }
      }
    }
    if (newfields.length>0) {
      this.application.push({"label":$localize`Additional info`,"fields":newfields});
    }
  }

  getFormdata(fields,pre=''){
    var formdata={}; 
    Object.keys(fields).forEach(i => {
      var validators=[];
      if (fields[i].type!='OBJECT') {
        validators=[];
        if (fields[i].required) {
          validators.push(Validators.required);
        }
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
          case 'FILE':
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
      let firstInvalid=this.focusInvalid();
      this.toast.show($localize`Error`,{message:"Please, correct mistakes",field:firstInvalid},'bg-danger text-light');
      return;
    }
    let data=this.getDataFromForm(this.fields);
    data['geolocation']=this.geolocation;
    //console.log('DATA',data);
    CreditApi.saveUserdata(data).then(fields=>{
      //console.log('SAVED');
      //this.toast.show($localize`Success`,'Successfully saved','bg-success');//do we need show it?
      if (!CreditApi.User.verificationFinished) {
        this.router.navigate(['/verification']);
      } else if (localStorage.getItem('amount')) {
        this.router.navigate(['/choosecard']);
      } else
        this.router.navigate(['/dashboard']);
    }).catch(err=>{
      if ((err.code)&&(err.code==13)) {
        this.updateDataRequest();
      } else 
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
    });
  }

  updateDataRequest(){
    this.data_to_update=[];
    for (const key of Object.keys(this.form.controls)) {
      if (this.form.controls[key].dirty) {
        let field=this.findFieldByKey(key);
        this.data_to_update.push({"key":key,"label":field.label,"value":this.form.controls[key].value});
      }
    }
    if (this.data_to_update.length==0) {
      this.router.navigate(['/dashboard']);
    } else {
      //console.log(this.data_to_update);
      this.modalService.open(this.updateDataModal).result.then((result) => {
        if (result=='ok'){
          CreditApi.createRequestForUpdateUserdata(this.data_to_update).then(udr=>{
            this.toast.show($localize`Success`,$localize`:@@dashboard.wizard.modal.update_data.request_has_been_sent:Request has been sent`,'bg-success text-light');
            this.router.navigate(['/dashboard']);
          }).catch(err=>{
            this.toast.show($localize`Error`,err.message,'bg-danger text-light');
          }) ;
        }
    }).catch(err=>{}) ;
    }
  }



  focusInvalid(){
    for (const key of Object.keys(this.form.controls)) {
      if (this.form.controls[key].invalid) {
        this.form.controls[key].markAsTouched();
        let field=this.findFieldByKey(key);
        if (field) {
          if (field['type']&&field['type']=='hidden')
            field['type']='text';
          return field.label;
        }
        return key;
     }
    }
  }
  findFieldByKey(key){
    for (var i in this.application) {
      for (var j=0;j<this.application[i].fields.length;j++) {
        if (key==this.application[i].fields[j].name)
          return this.application[i].fields[j];
      }
    }
    return null;  
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
          case 'FILE':
            if (this.newfiles[i])
              obj[i]=this.newfiles[i];
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
    if ((this.fields['geolocation'])&&(navigator.geolocation)) {
        var that=this;
        navigator.geolocation.getCurrentPosition(function(position) {
          that.geolocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
    }
  }

  onFileChange(event,field){
    if(event.target.files.length > 0) {
      this.readFile(event.target.files[0],field);      
    }
  }
  onFileDropped(event,field){
    event.preventDefault();
    event.target.classList.remove("dragover");
    this.readFile(event.dataTransfer.files[0],field);
  }
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  } 
  onDragEnter(event){
    event.target.classList.add("dragover");
  }
  onDragLeave(event){
    event.target.classList.remove("dragover");
  }

  readFile(file,field){
    this.form_disabled=true;
    var prev_value=field.value;
    field.value.name=file.name;
    field.value.loading=true;
    this.imageResizer.resizeImage(file,1500,10000).subscribe(result => {
      if (result.size<=1048576) {//1MB
        this.uploadFile(result,field,prev_value);
      } else {
        this.imageResizer.compressImage(result,1).subscribe(result2=>{
          this.uploadFile(result2,field,prev_value);
        },error=>{
          field.value=prev_value;
          field.value.loading=false;
          field
          this.form_disabled=false;
          this.toast.show($localize`Error`,error.error,'bg-danger text-light');
        });
      }
    },error=>{
      field.value=prev_value;
      field.value.loading=false;
      this.form_disabled=false;
      this.toast.show($localize`Error`,error.error,'bg-danger text-light');
    });
  }

  uploadFile(file,field,prev_value){
      const reader = new FileReader();
      reader.onload = e => {
        field.value.url = reader.result;
        CreditApi.uploadFile(file.name,file.type,this.b64toBlob(reader.result,file.type)).then(pfile=>{ 
          this.newfiles[field.name]=pfile;
          this.newfiles[field.name]["__type"]="File";
          this.form_disabled=false;
          field.value.loading=false;
        }).catch(err=>{
          field.value=prev_value;
          field.value.loading=false;
          if (err.message=="")
            this.toast.show($localize`Error`,$localize`Error file uploading`,'bg-danger text-light');
          else {
            console.log(err);
            this.toast.show($localize`Error`,err.message,'bg-danger text-light');
          }
          this.form_disabled=false;
        });
      }
      reader.readAsDataURL(file);
  }

  b64toBlob(dataURI,type) {

    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: type});
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
