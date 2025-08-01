export const environment = {
  appVersion: '1.0.0',
  production: true,
  disableRightClick: false,
  // SERVER_URL:"http://192.168.0.88:8080",
  // TILES_URL:"http://192.168.0.88:8080/assets/tiles",
  // // TILES_URL:"http://192.168.0.88:8080/dgfi-loc-tkr/assets/tiles/pbf",
  // SERVER_BASE_URL:"http://192.168.0.88:8080/secure/api/v1",
  // SERVER_BASE_URL_PUBLIC: "http://192.168.0.88:8080/public/api/v1",
  // SERVER_BASE_URL_ADMIN: "http://192.168.0.88:8080/secure/api/v1",
  SERVER_URL: `${window.location.origin}`,
  TILES_URL: `${window.location.origin}/assets/tiles`,
  SERVER_BASE_URL: `${window.location.origin}/secure/api/v1`,
  SERVER_BASE_URL_PUBLIC: `${window.location.origin}/public/api/v1`,
  SERVER_BASE_URL_ADMIN: `${window.location.origin}/secure/api/v1`,
  SECRET_KEY : 'softcafe'
};
// dgfi-location-tracker-server
