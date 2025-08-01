// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appVersion: '1.0.0',
  production: false,
  disableRightClick: false,
  SERVER_URL:"http://127.0.0.1:8080",
  TILES_URL:"http://localhost:8000",
  SERVER_BASE_URL:"http://127.0.0.1:8080/secure/api/v1",
  SERVER_BASE_URL_PUBLIC: "http://127.0.0.1:8080/public/api/v1",
  SERVER_BASE_URL_ADMIN: "http://127.0.0.1:8080/secure/api/v1",
  SECRET_KEY : 'softcafe'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
