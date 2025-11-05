import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css',
  animations: [
    trigger('staggerCards', [
      transition(':enter', [
        query('.skill-card', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(150, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  private readonly INTERSECTION_THRESHOLD = 0.1;
  private readonly ROOT_MARGIN = '0px 0px -10% 0px';
  private readonly VIEWPORT_THRESHOLD = 0.9;
  private readonly ANIMATION_CLASS = 'animate-in';
  private readonly OBSERVED_SELECTORS = '.skills-header, .skill-card';
  
  private intersectionObserver?: IntersectionObserver;

  readonly skills = signal([
    'Angular',
    'TypeScript',
    'RxJS',
    'HTML',
    'CSS',
    'Node.js',
    'Express',
    'NestJS',
    'Git',
    'Jest'
  ]);

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
      {
        threshold: this.INTERSECTION_THRESHOLD,
        rootMargin: this.ROOT_MARGIN
      }
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
      
      if (this.isElementInView(element)) {
        this.animateElement(element as HTMLElement);
      } else {
        this.intersectionObserver?.observe(element);
      }
    });
  }

  private applyAnimationDelay(element: HTMLElement, index: number): void {
    if (element.classList.contains('skill-card')) {
      const delayClass = `animate-delay-${(index % 3) + 1}`;
      element.classList.add(delayClass);
    }
  }

  private isElementInView(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return rect.top < viewportHeight * this.VIEWPORT_THRESHOLD && 
           rect.bottom > viewportHeight * 0.1;
  }

  private animateElement(element: HTMLElement): void {
    element.classList.add(this.ANIMATION_CLASS);
  }

  private cleanupObserver(): void {
    this.intersectionObserver?.disconnect();
  }
}
