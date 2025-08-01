import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { routes } from './app.routes';
import { ConfigService, initializeApplication } from './config.service';
import { globalInterceptor } from './global.interceptor';
import { ChartService } from './layout/report/chart.service';
import { ToggleFullScreenDirective } from './shared/components/full-screen/toggle-full-screen';
import { AuthGuard } from './softcafe/guard/auth.guard';
import { rxStompServiceFactory } from './softcafe/ws/rx-stomp-service-factory';
import { RxStompService } from './softcafe/ws/rx-stomp.service';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthGuard,
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideAnimationsAsync(),
    // provideClientHydration(
    //   withEventReplay(),
    //   withHttpTransferCacheOptions({ includePostRequests: true })
    // ),
    provideHttpClient(withInterceptors([globalInterceptor])),
    importProvidersFrom(AngularSlickgridModule.forRoot()),
    // {
    //   provide: APP_INITIALIZER, useFactory: initializeApplication, multi: true, deps: [ConfigService]
    // },
    provideAppInitializer(() => initializeApplication(inject(ConfigService))),
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
    },
    ToggleFullScreenDirective,
    ChartService,
    provideCharts(withDefaultRegisterables()),
    importProvidersFrom(NgxDaterangepickerBootstrapModule.forRoot({
      separator: ' - ',
      applyLabel: 'Okay',
    })),
  ]
};
