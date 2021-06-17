export const environment = {
  production: true,
  CreditApiHost: window["env"]["CreditApiHost"]||"",
  CreditApiOrgId: window["env"]["CreditApiOrgId"]||"",
  MyUrl: window["env"]["MyUrl"]||"",
  HomeLink: window["env"]["HomeLink"]||"",
  websiteID: window["env"]["websiteID"]||"",
  ShowMessages: window["env"]["ShowMessages"]||"no",
  DaysBeforePaymentAllowed: window["env"]["DaysBeforePaymentAllowed"]||3,
  MinEarlyAmount: window["env"]["MinEarlyAmount"]||null,
  TimeZone: window["env"]["TimeZone"]||"",
  DisableVerification: window["env"]["DisableVerification"]||false
};
