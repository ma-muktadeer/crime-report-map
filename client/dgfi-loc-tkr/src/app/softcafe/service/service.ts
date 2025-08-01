export interface Service {

    onResponse(service : Service, req : any, res : any);
    onError(service : Service, req : any, res : any);

}
