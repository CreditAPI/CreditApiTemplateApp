import { Component } from '@angular/core';
import CreditApi from 'credit-api';
import '@angular/localize/init';
import { AppToastService } from './services/app-toast.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from './../environments/environment';
import  Mainpage  from './mainpage/mainpage.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  initialized=false;
  public isMenuCollapsed = true;
  creditApi=CreditApi;
  public location;
  brand= environment['brand']||$localize`SuperLOANS`;
  homelink;
  cso_by_lender; 
  organization='ООО "Тестовая организация"';
  organization_id='012349823194';
  lender='ООО МКК "Тестовая микрокредитная компания "';
  lender_id="009218945354";
  license='Свидетельство о внесении сведений в государственный реестр микрофинансовых организаций №000000001 от 01.01.2001 года.';
  logged_as=false;
  user;
  
  constructor(private toast: AppToastService,private router: Router,location: Location){
    this.location=location;
    this.initialize();
  }

  initialize() {
    var current_path=this.location.path().split('?')[0];
    var regex_opened = /(document|register|^$|^\/$)/
    var params=this.getQueryParameters();
    if (params['amount']&&params['term']&&params['product']) {
      localStorage.setItem('amount',params['amount']);
      localStorage.setItem('term',params['term']);
      localStorage.setItem('product',params['product']);
    }
    if (localStorage.getItem('logged_as')) {
      localStorage.removeItem('logged_as');
      CreditApi.logout();
    }
    if (params["token"]) {
      localStorage.setItem('logged_as','true');
      this.logged_as=true;
      localStorage.setItem('token',params['token']);
      delete params['token'];
    }
    if (Object.keys(params).length>1) localStorage.setItem('queryparams', JSON.stringify(params));
    this.homelink=environment['HomeLink'];
    if (environment.CreditApiOrgId=='PUT YOUR ORG ID HERE') {
      console.error('APP is not initialized. If you are the owner of this website please enter your ORG ID settings in src/assets/js/settings.js');
      this.toast.show($localize`Error`,$localize`Please, check app settings`,'bg-danger text-light');
      return;
    } else
      CreditApi.init(environment.CreditApiHost,environment.CreditApiOrgId);

    var wid=environment['websiteID'];
    if (params['websiteID'])
       wid=params['websiteID'];
    this.applyStyles(wid)
      .then(res=>{
        return CreditApi.refreshUser();
      }).then(user=>{
        this.user=user;
        if (environment['ShowMessages']!='no') {
          CreditApi.enableLastMessageAutoupdate();
        }
        if (this.homelink)
          regex_opened = /(document|register$)/
        this.initialized=true;
        if ((!user)&&(!regex_opened.test(current_path)))
          this.router.navigate(['/login']);
        else {
          if ((this.homelink)&&((current_path=='')||(current_path=='/')))
            this.router.navigate(['/dashboard']);
        }
      }).catch(err=>{
        console.log(err);
        this.toast.show($localize`Error`,err.message,'bg-danger text-light');
        if ((!regex_opened.test(current_path)))
          this.router.navigate(['/login']);
      });
  }

  applyStyles(websiteID){
    return new Promise((resolve,reject)=>{
      if ((!websiteID)||(websiteID==undefined)||(websiteID=='undefined')) resolve(false);
      CreditApi.getWebsiteStyle(websiteID).then(website=>{
        //console.log(website);
        this.organization=website['organization']||'';
        this.organization_id=website['organization_id']||'';
        this.lender=website['lender']||'';
        this.lender_id=website['lender_id']||'';
        this.license=website['license']||'';
        if (website['css_theme']) {
          let link = document.createElement('link');
          link.rel  = 'stylesheet';
          link.type = 'text/css';
          link.href=website['css_theme'];
          document.head.appendChild(link);
        }
        if (website['show_messages']) {
           environment['ShowMessages']=website['show_messages'];
        }
        if (website['label'])
          window.document.title=website['label'];
        else
          window.document.title=website['CreditApi Template'];
        if (website['logo']) {
          this.brand='<img src="'+website['logo'].url+'" alt="" />';
        } else if (website['brandname'])
          this.brand=website['brandname'];
        let node = document.createElement('style');
        var bodystyle="";
        if (website['body_background_type']) {
          if (website['body_background_type']=='color') {
            bodystyle+=' background:'+website['body_background']+' !important;';
          } else if (website['body_background_type']=='image') { 
            bodystyle=' background:url("' + website['body_image'].url+'") no-repeat center center fixed !important; background-size: cover !important';
          }
        }
        if (website['font']) {
          bodystyle+=' font:'+ website['font']+';';
        }
        if (website['font_color']) {
          bodystyle+=' color:'+ website['font_color']+';';
        }
        var styles=" .my-body {"+bodystyle+"}";
        if (website['homepage_type']){
          if (website['homepage_type']=='external') {
            this.homelink=website['homepage_content'];
          } else {
            this.homelink=null;
            if (website['homepage_background_image']) {
              styles+='.mainpage { background:url("' + website['homepage_background_image'].url+'") no-repeat; }';
            }
            if (website['homepage_content']){
              Mainpage.content=website['homepage_content'];
            }
          }
        }
        if (website['font_color']) {
          styles+=' .table, .navbar-nav .nav-link, .navbar-brand, .navbar-brand:focus, .navbar-brand:hover { color:'+ website['font_color']+' !important;}';
        }
        if (website['header_background']) {
          styles+=' .my-header {background:'+website['header_background']+';}';
        }
        if (website['footer_background']) {
          styles+=' .my-footer {background:'+website['footer_background']+';}';
        }
        if (website['card_background']) {
          styles+=' .bg-light {background:'+website['card_background']+' !important;}';
        }
        if (website['primary_color']) {
          styles+='.btn-primary,.btn-outline-primary:hover,.btn-primary:focus, .btn-outline-primary:active  { background:'+website['primary_color']+' !important; } '+ 
                  '.custom-range::-webkit-slider-thumb, .custom-range::-moz-range-thumb, .custom-range::-ms-thumb {background:'+website['primary_color']+' !important; }' +
                  '.btn-primary:hover, .btn-primary:active { background:'+website['primary_color']+'; box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.3);} '+
                  '.btn-primary.disabled, .btn-primary:disabled{ background:'+website['primary_color']+' ; box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.4);} '+
                  '.btn-outline-primary, .btn-outline-primary:focus { border-color:'+website['primary_color']+'; color:'+website['primary_color']+' ;} ' +
                  '.text-primary {color:'+website['primary_color']+';} ';
        } 
        if (website['secondary_color']) {
          styles+='.btn-secondary, .btn-secondary:focus, .btn-outline-secondary:hover, .btn-outline-secondary:active, .badge-secondary  { background:'+website['secondary_color']+' !important; } '+ 
                  '.btn-secondary:hover, .btn-secondary:active { background:'+website['secondary_color']+'; box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.3);} '+
                  '.btn-secondary.disabled, .btn-secondary:disabled{ background:'+website['secondary_color']+' ; box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.4);} '+
                  '.btn-outline-secondary, .btn-outline-secondary:focus { border-color:'+website['secondary_color']+'; color:'+website['secondary_color']+' ;} ' +
                  '.text-secondary {color:'+website['secondary_color']+';} ';          
        } 
        if (website['cso_by_lender']) {
          this.cso_by_lender=website['cso_by_lender'];
        } 

        node.innerHTML=styles;
        document.head.appendChild(node); 
        if (website['additional_scripts']) {
          document.body.appendChild(website['additional scripts']);
        }
        resolve(true);
      }).catch(err=>{
        reject(err);
      });
    });
  }



  getQueryParameters(){
    var parameters={};
    var query=this.location.path().split('?');
    if (query[1]) {
      const regex1=/([^&=]+)=?([^&]*)/g
      var parts=query[1].match(regex1);
      parts.forEach(part=> {
        var kv=part.split('=');
        parameters[kv[0]]=kv[1]||null;
      });
    }
    return parameters;
  }

  logout(){
    CreditApi.logout();
    localStorage.removeItem('amount');
    localStorage.removeItem('term');
    localStorage.removeItem('product');
    localStorage.removeItem('logged_as');
    this.logged_as=false;
    this.router.navigate(['login']);
  }
}
