import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';

interface ContactFormModel {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type ColorState = 0 | 1 | 2;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('600ms 200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  private readonly INTERSECTION_THRESHOLD = 0.2;
  private readonly OBSERVED_SELECTORS = '.contact-header, .contact-form, .contact-info';
  private readonly ANIMATION_CLASS = 'animate-in';
  private readonly SUBMIT_DELAY = 300;
  private readonly TOTAL_COLOR_STATES = 3;
  private readonly RECIPIENT_EMAIL = 'sesnavas@gmail.com';
  
  private intersectionObserver?: IntersectionObserver;

  model: ContactFormModel = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitting = false;
  success?: string;
  error?: string;
  colorState: ColorState = 0;

  ngAfterViewInit(): void {
    if (!this.isClient()) return;
    
    this.initializeIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.cleanupObserver();
  }

  onTitleHover(): void {
    this.cycleColorState();
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    
    this.startSubmission();
    this.openEmailClient();
    this.completeSubmission(form);
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private initializeIntersectionObserver(): void {
    this.intersectionObserver = new IntersectionObserver(
      this.handleIntersection,
      { threshold: this.INTERSECTION_THRESHOLD }
    );

    this.observeElements();
  }

  private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateElement(entry.target as HTMLElement);
        this.intersectionObserver?.unobserve(entry.target);
      }
    });
  };

  private observeElements(): void {
    const elements = document.querySelectorAll(this.OBSERVED_SELECTORS);
    
    elements.forEach((element, index) => {
      this.applyAnimationDelay(element as HTMLElement, index);
      this.intersectionObserver?.observe(element);
    });
  }

  private applyAnimationDelay(element: HTMLElement, index: number): void {
    if (index > 0) {
      element.classList.add(`animate-delay-${index}`);
    }
  }

  private animateElement(element: HTMLElement): void {
    element.classList.add(this.ANIMATION_CLASS);
  }

  private cleanupObserver(): void {
    this.intersectionObserver?.disconnect();
  }

  private cycleColorState(): void {
    this.colorState = ((this.colorState + 1) % this.TOTAL_COLOR_STATES) as ColorState;
  }

  private startSubmission(): void {
    this.submitting = true;
    this.success = undefined;
    this.error = undefined;
  }

  private openEmailClient(): void {
    const subject = this.buildEmailSubject();
    const body = this.buildEmailBody();
    const mailtoUrl = `mailto:${this.RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;
  }

  private buildEmailSubject(): string {
    const subject = this.model.subject || `Contacto de ${this.model.name}`;
    return encodeURIComponent(subject);
  }

  private buildEmailBody(): string {
    const body = `${this.model.message}\n\n— ${this.model.name} <${this.model.email}>`;
    return encodeURIComponent(body);
  }

  private completeSubmission(form: NgForm): void {
    setTimeout(() => {
      this.submitting = false;
      this.success = 'Gracias por tu mensaje. Se abrió tu cliente de correo para enviar.';
      form.resetForm();
    }, this.SUBMIT_DELAY);
  }
}
