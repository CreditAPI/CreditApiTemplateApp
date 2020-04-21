import { Component } from '@angular/core';
import {AppToastService} from '../services/app-toast.service';

@Component({
  selector: 'app-app-toasts',
  templateUrl: './app-toasts.component.html',
  styleUrls: ['./app-toasts.component.scss']
})
export class AppToastsComponent {

  constructor(public toastService: AppToastService) {}


}
