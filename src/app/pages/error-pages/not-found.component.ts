import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterModule],
    template: `
    <div style="text-align: center; padding: 100px 20px;">
      <h1 style="font-size: 120px; margin: 0; color: #f39c12;">404</h1>
      <h2 style="font-size: 30px; margin-bottom: 20px;">Page Not Found</h2>
      <p style="color: #888; margin-bottom: 30px;">The page you are looking for doesn't exist or has been moved.</p>
      <a routerLink="/" style="padding: 12px 30px; background: #f39c12; color: white; border-radius: 50px; text-decoration: none; font-weight: 600;">Go Back Home</a>
    </div>
  `
})
export class NotFoundComponent { }
