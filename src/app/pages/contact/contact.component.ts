import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent {
    contactForm: FormGroup;
    isSubmitted = false;

    constructor(private fb: FormBuilder) {
        this.contactForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            message: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    get f() { return this.contactForm.controls; }

    submitForm(): void {
        this.isSubmitted = true;
        
        if (this.contactForm.valid) {
            console.log('Form Submitted:', this.contactForm.value);
            alert('Thank you for contacting us! We will get back to you soon.');
            this.contactForm.reset();
            this.isSubmitted = false;
        } else {
            this.contactForm.markAllAsTouched();
        }
    }
}
