import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/core/services/app.config';


if (environment.production) {
  enableProdMode();
  if (window) {
    selfXSSWarning();
  }
}

bootstrapApplication(AppComponent, appConfig, )
  .catch((err) => console.error(err));

function selfXSSWarning() {
  setTimeout(() => {
    console.log(
      '%c** STOP **',
      'font-weight:bold; font:2.5em Arial; color:white; background-color:#e11d48; padding:5px 15px; border-radius:25px;',
    );
    console.log(
      '%cThis console is for developers. Pasting code here can expose you to Self-XSS attacks.',
      'font-weight:bold; font:2em Arial; color:#e11d48;',
    );
  });
}
