import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInTop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        animate('600ms 200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('expandBar', [
      transition(':enter', [
        style({ width: 0 }),
        animate('800ms 400ms ease-out', style({ width: '96px' }))
      ])
    ])
  ]
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  private readonly INTERSECTION_THRESHOLD = 0.2;
  private readonly OBSERVED_SELECTORS = '.about, .about-header, .about-content';
  private readonly ANIMATION_CLASS = 'animate-in';
  
  private intersectionObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!this.isClient()) return;
    
    this.initializeIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.cleanupObserver();
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
    
    elements.forEach(element => {
      this.intersectionObserver?.observe(element);
    });
  }

  private animateElement(element: HTMLElement): void {
    element.classList.add(this.ANIMATION_CLASS);
  }

  private cleanupObserver(): void {
    this.intersectionObserver?.disconnect();
  }
}
