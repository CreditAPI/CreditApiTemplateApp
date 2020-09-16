import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';

@Injectable()
export class NgbDateCustomParserFormatter extends NgbDateParserFormatter {
  parse(value: string): NgbDateStruct
  {
    if (!value)
      return null
     let parts=value.split('.');
     return {year:+parts[2],month:+parts[1],day:+parts[0]} as NgbDateStruct

  }
  format(date: NgbDateStruct): string
  {
    return date?('0'+date.day).slice(-2) + '.'+ ('0'+date.month).slice(-2)+'.'+date.year :null;
  }
}