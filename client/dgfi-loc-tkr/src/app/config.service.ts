import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    config: any;

    browserName;
    os

    constructor() { }

    async loadConfig(): Promise<void> {
        const http = inject(HttpClient);
        console.log("Loading config...");
        try {
            const url = '../assets/env/config.json';
            // const url = environment.production ? '../dgfi-loc-tkr/assets/env/config.json' : '../assets/env/config.json';
            const config = await firstValueFrom(http.get(url));
            this.config = config;
            console.log(this.config);
            this.browserName = this.getBrowserInfo();
            this.os = this.getOSInfo()
        } catch (error) {
            console.error('Could not load config file', error);
        }
    }


    get baseUrl(): string {
        return this.config.baseUrl;
    }

    getAppVersion() {
        return this.config?.product?.version
    }


    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName;

        if (userAgent.indexOf("Firefox") > -1) {
            browserName = "Firefox";
        } else if (userAgent.indexOf("SamsungBrowser") > -1) {
            browserName = "Internet";
        } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            browserName = "Opera";
        } else if (userAgent.indexOf("Trident") > -1) {
            browserName = "Internet";
        } else if (userAgent.indexOf("Edge") > -1) {
            browserName = "Edge";
        } else if (userAgent.indexOf("Chrome") > -1) {
            browserName = "Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            browserName = "Safari";
        } else {
            browserName = "Unknown";
        }

        return browserName;
    }

    getOSInfo() {
        const platform = navigator.platform;
        let osName;

        if (platform.indexOf("Win") > -1) {
            osName = "Windows";
        } else if (platform.indexOf("Mac") > -1) {
            osName = "MacOS";
        } else if (platform.indexOf("X11") > -1) {
            osName = "UNIX";
        } else if (platform.indexOf("Linux") > -1) {
            osName = "Linux";
        } else if (/Android/.test(navigator.userAgent)) {
            osName = "Android";
        } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            osName = "iOS";
        } else {
            osName = "Unknown";
        }

        return osName;
    }
}


export function initializeApplication(configService: ConfigService) {
    return configService.loadConfig();
}