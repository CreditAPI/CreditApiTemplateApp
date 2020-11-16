// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  CreditApiHost: window["env"]["CreditApiHost"]||"",
  CreditApiOrgId: window["env"]["CreditApiOrgId"]||"",
  MyUrl: window["env"]["MyUrl"]||"",
  HomeLink: window["env"]["HomeLink"]||"",
  websiteID: window["env"]["websiteID"]||"",
  ShowMessages: window["env"]["ShowMessages"]||"no",
  DaysBeforePaymentAllowed: window["env"]["DaysBeforePaymentAllowed"]||3,
  MinEarlyAmount: window["env"]["MinEarlyAmount"]||null
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
