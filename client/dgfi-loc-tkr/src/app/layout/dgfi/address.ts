import { inject } from "@angular/core";
import { ActionType } from "src/app/softcafe/constants/action-type.enum";
import { ContentType } from "src/app/softcafe/constants/content-type.enum";
import { CommonService } from "src/app/softcafe/service/common.service";
import { Service } from "src/app/softcafe/service/service";

export class Address {
    private cs: CommonService = inject(CommonService);
    loadInitLocation(service: Service) {
        const payload = {
            locationType: 'Division',
            parentKey: 73,
        }
        this.sendRequest(payload, 'SELECT_DIVISION', service);
    }

    loadLocation(event: any, locationType: string, ref: string, service: Service) {

        const payload = {
            locationType: locationType,
            // locationType: 'District',
            parentKey: event.target.value,
        }
        this.sendRequest(payload, ref, service);
    }

    private sendRequest(payload: any, ref: string, service: Service) {
        this.cs.sendRequestAdmin(service, ActionType.SELECT, ContentType.CrimeChart, ref, payload);
    }
}