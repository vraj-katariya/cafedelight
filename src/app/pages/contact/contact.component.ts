import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent {
    contact = {
        name: '',
        email: '',
        message: ''
    };

    submitForm(): void {
        if (this.contact.name && this.contact.email && this.contact.message) {
            console.log('Form Submitted:', this.contact);
            alert('Thank you for contacting us! We will get back to you soon.');
            this.contact = { name: '', email: '', message: '' };
        } else {
            alert('Please fill in all fields.');
        }
    }
}
