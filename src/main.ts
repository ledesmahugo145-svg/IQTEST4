import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

// Bootstrapping the application using Zoneless Change Detection (Angular v18+)
bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
}).catch((err) => {
  // Safe error logging
  console.error('CRITICAL BOOTSTRAP ERROR:', err);
  
  // Try to display error on screen if UI is stuck
  const loader = document.querySelector('.app-loading');
  if (loader) {
    loader.innerHTML = `
      <div style="color:red; text-align:center; padding:20px;">
        <h3>STARTUP FAILED</h3>
        <p style="font-family:monospace; font-size:12px;">${err.message || err}</p>
      </div>
    `;
  }
});