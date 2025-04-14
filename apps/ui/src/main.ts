import { registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
import { bootstrapApplication } from '@angular/platform-browser';
import { Settings } from 'luxon';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).then(() => {
  Settings.defaultLocale = 'da';
  registerLocaleData(localeDa);

}).catch((err) =>
  console.error(err),
);
