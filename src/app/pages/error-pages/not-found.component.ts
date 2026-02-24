import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div style="text-align: center; padding: 100px 20px; background: #fff;">
      <h1 style="font-size: 150px; margin: 0; color: #1a1a1a; font-weight: 900;">404</h1>
      <h2 style="font-size: 32px; margin-bottom: 20px; font-weight: 800; text-transform: uppercase;">Page Not Found</h2>
      <p style="color: #666; margin-bottom: 40px; font-weight: 500;">The page you are looking for doesn't exist or has been moved.</p>
      <a routerLink="/" style="padding: 15px 40px; background: #000; color: white; border-radius: 0; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #000;">Go Back Home</a>
    </div>
  `
})
export class NotFoundComponent { }
