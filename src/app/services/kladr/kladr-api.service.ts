import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KladrApiService {

  constructor() { }

  predict(input,options) {
    return this.jsonp("https://kladr-api.ru/api.php?query="+input+"&limit=10&"+this.serialize(options));
  }
  jsonp(url) {
    return new Promise(function(resolve, reject) {
        let script = document.createElement('script')
        const name = "_jsonp_" + Math.round(100000 * Math.random());
        //url formatting
        if (url.match(/\?/)) url += "&callback="+name
        else url += "?callback="+name
        script.src = url;
        script.onerror=function(err){ reject(err)}
        window[name] = function(data) {
            resolve(data);
            document.body.removeChild(script);
            delete window[name];
        }
        document.body.appendChild(script);
    });
  }

  serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

}
