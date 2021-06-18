(function(window) {
    window["env"] = window["env"] || {};
  
    // Environment variables
  /*  window["env"]["CreditApiHost"] = "http://localhost:1341/api";
    window["env"]["CreditApiOrgId"] = """;//'PUT YOUR ORG ID HERE';
    window["env"]["MyUrl"] = 'PUT YOUR DOMAIN URL HERE';
    window["env"]["HomeLink"] = '';
    window["env"]["ShowMessages"] = 'no';
    window["env"]["DaysBeforePaymentAllowed"]=3;
    window["env"]["websiteID"] = ""; //'PUT YOUR WEBSITE ID HERE';
    window["env"]["TimeZone"]="UTC+3"; 
    */

    window["env"]["CreditApiHost"] = "https://sbapi.creditapi.ru/api";
    window["env"]["CreditApiOrgId"] = "";//'PUT YOUR ORG ID HERE';
    window["env"]["MyUrl"] = 'PUT YOUR DOMAIN URL HERE';
    window["env"]["HomeLink"] = '';
    window["env"]["ShowMessages"] = 'always';
    window["env"]["DaysBeforePaymentAllowed"]=3;
    window["env"]["websiteID"] = "HCLqGNLMpN"; //'PUT YOUR WEBSITE ID HERE';
    window["env"]["MinEarlyAmount"]=0.01; 
    window["env"]["TimeZone"]="UTC+3"; //If defined all loan dates will be shown in this timezone 
    
    
   /* window["env"]["CreditApiHost"] = "https://api.creditapi.ru/api";
    window["env"]["CreditApiOrgId"] = "";//'PUT YOUR ORG ID HERE';
    window["env"]["MyUrl"] = 'PUT YOUR DOMAIN URL HERE';
    window["env"]["HomeLink"] = '';
    window["env"]["ShowMessages"] = 'no';
    window["env"]["DaysBeforePaymentAllowed"]=3;
    window["env"]["websiteID"] = ""; //'PUT YOUR WEBSITE ID HERE';
    window["env"]["MinEarlyAmount"]=0.01;
    window["env"]["DisableVerification"]=true; */
  })(this);
