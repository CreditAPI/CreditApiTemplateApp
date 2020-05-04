import { Component, OnInit, ViewChild } from '@angular/core';
import CreditApi from 'credit-api';
import { AppToastService } from 'src/app/services/app-toast.service';
import { Ng2ImgMaxService } from 'ng2-img-max';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'; 
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @ViewChild('messagehistory') messagesContainer; 
  @ViewChild('messagecontent') message_content;
  user=CreditApi.User;
  messages=[];
  today_midnight=new Date();
  attachments=[];
  loaded_attachments=[];
  img_preview_url;
  constructor(private toast: AppToastService,private router: Router, private imageResizer: Ng2ImgMaxService,private modalService: NgbModal) { }

  ngOnInit(): void {
    if ((environment.ShowMessages!='always') && (environment.ShowMessages!='if_unreaded'))
      this.router.navigate(['/dashboard']);
    this.today_midnight.setHours(0);
    this.today_midnight.setMinutes(0);
    CreditApi.getMessages().then((results)=> {
      results.forEach(m => {
        m['createdAt']=new Date(m['createdAt']);
        this.messages.unshift(m);
      });
      setTimeout(()=>{
        this.messagesContainer.nativeElement.scrollTop=this.messagesContainer.nativeElement.scrollHeight;
      },100);  
    }).catch((error)=>{
      this.toast.show($localize`Error`,error.message,'bg-danger text-light');
    });
  }
  
  getStatusClass(message){
    let sclass="icon-check";
    if (message['readedAt']) sclass+=" readed";
    if (message['error']) sclass="icon-error";
    return sclass;
  }
  sendMessage(){
    if (this.message_content.nativeElement.value.trim()=='')
      return;
    let loading=0;
    this.attachments.forEach((attachment)=>{
      if (attachment.loading) {
        loading++;
      }
    });
    if (loading>0) {
      this.toast.show($localize`Warning`,$localize`:@@dashboard.my_messages.wait_until_attachments_loaded:Please wait until attachment(s) loaded`,'bg-warning text-light');
      return;
    }
    var message={content:this.message_content.nativeElement.value,attachments:this.loaded_attachments};
    this.messages.push(message);
    this.message_content.nativeElement.value='';
    setTimeout(()=>{
      this.messagesContainer.nativeElement.scrollTop=this.messagesContainer.nativeElement.scrollHeight;
    },100); 
    CreditApi.sendMessage(message).then(result=>{
      message['createdAt']=new Date(result['createdAt']);
      message['sender_email']=result['sender_email'];
      this.attachments=[];
      this.loaded_attachments=[];
    }).catch((error)=>{
      message['error']=$localize`Error`;
      this.toast.show($localize`Error`,error.message,'bg-danger text-light');
    });    
  }


  onFileChange(event){
    if(event.target.files.length > 0) {
      for (var i=0;i<event.target.files.length;i++) {
        this.readFile(event.target.files[i]);      
      }
    }
  }
  onFileDropped(event){
    event.preventDefault();
    event.target.classList.remove("dragover");
    for (var i=0;i<event.dataTransfer.files.length;i++) {
      this.readFile(event.dataTransfer.files[i]);      
    }
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

  readFile(file){
    var newfile={name:file.name,loading:true};
    this.attachments.push(newfile);
    this.imageResizer.resizeImage(file,1500,10000).subscribe(result => {
      if (result.size<=1048576) {//1MB
        this.uploadFile(result,newfile);
      } else {
        this.imageResizer.compressImage(result,1).subscribe(result2=>{
          this.uploadFile(result2,newfile);
        },error=>{
          this.toast.show($localize`Error`,error.error,'bg-danger text-light');
        });
      }
    },error=>{
      this.toast.show($localize`Error`,error.error,'bg-danger text-light');
    });
  }

  uploadFile(file,el){
      const reader = new FileReader();
      reader.onload = e => {
        CreditApi.uploadFile(file.name,file.type,this.b64toBlob(reader.result,file.type)).then(pfile=>{ 
          el['loading']=false;
          el['url']=pfile.url;
          pfile["__type"]="File";
          this.loaded_attachments.push(pfile);
        }).catch(err=>{
          if (err.message=="")
            this.toast.show($localize`Error`,$localize`Error file uploading`,'bg-danger text-light');
          else {
            console.log(err);
            this.toast.show($localize`Error`,err.message,'bg-danger text-light');
          }
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
  getOriginalFileName(name) {
    var nameParts = name.split("_");
    nameParts.shift(0,1);
    return nameParts.join("_");
  } 
  showImage(url,modal){
    this.img_preview_url=url;
    this.modalService.open(modal,{ size: 'lg' });
  }
}
