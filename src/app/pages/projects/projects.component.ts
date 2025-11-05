import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

interface Project {
  title: string;
  desc: string;
  stack: string[];
  type: 'angular' | 'react' | 'spring' | 'fintech';
  github: string;
  live: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  animations: [
    trigger('staggerProjects', [
      transition(':enter', [
        query('.project-card', [
          style({ opacity: 0, transform: 'translateY(40px)' }),
          stagger(120, [
            animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
  private readonly INTERSECTION_THRESHOLD = 0.2;
  private readonly ANIMATION_CLASS = 'animate-in';
  private readonly HEADER_SELECTOR = '.projects-header';
  private readonly CARD_SELECTOR = '.project-card';
  
  private intersectionObserver?: IntersectionObserver;

  readonly projects = signal<Project[]>([
    {
      title: 'National Resource Management System',
      desc: 'Web app to manage public financial resources efficiently.',
      stack: ['Angular', 'Spring Boot', 'MySQL', 'REST APIs'],
      type: 'angular',
      github: '#',
      live: '#'
    },
    {
      title: 'Pension Payment Tracker',
      desc: 'Full-stack system to control and monitor pension disbursements.',
      stack: ['React', 'Spring Boot', 'PostgreSQL', 'RESTful APIs'],
      type: 'react',
      github: '#',
      live: '#'
    },
    {
      title: 'Blockchain Transaction Validator',
      desc: 'Prototype for verifying digital transactions securely on-chain.',
      stack: ['Node.js', 'Web3.js', 'Express', 'PostgreSQL'],
      type: 'fintech',
      github: '#',
      live: '#'
    }
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
    this.observeHeader();
    this.observeProjectCards();
  }

  private observeHeader(): void {
    const header = document.querySelector(this.HEADER_SELECTOR);
    
    if (header) {
      this.intersectionObserver?.observe(header);
    }
  }

  private observeProjectCards(): void {
    const cards = document.querySelectorAll(this.CARD_SELECTOR);
    
    cards.forEach((card, index) => {
      this.applyAnimationDelay(card as HTMLElement, index);
      this.intersectionObserver?.observe(card);
    });
  }

  private applyAnimationDelay(element: HTMLElement, index: number): void {
    const delayClass = `animate-delay-${(index % 3) + 1}`;
    element.classList.add(delayClass);
  }

  private animateElement(element: HTMLElement): void {
    element.classList.add(this.ANIMATION_CLASS);
  }

  private cleanupObserver(): void {
    this.intersectionObserver?.disconnect();
  }
}
