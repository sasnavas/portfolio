import { Component, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';

interface Project {
  title: string;
  desc: string;
  stack: string[];
  type: 'angular' | 'react' | 'spring' | 'fintech' | 'e-commerce';
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
      title: 'Crypto Portfolio Dashboard',
      desc: 'A Full-Stack application to manage a cryptocurrency portfolio in real-time. It allows users to keep track of their purchases, visually analyze their asset distribution, and get live valuations by consuming the public CoinGecko API.',
      stack: ['Angular', 'Spring Boot', 'PostgreSQL', 'REST APIs'],
      type: 'angular',
      github: 'https://github.com/sasnavas/crypto_portfolio_fullstack',
      live: '#'
    },
    {
      title: 'CineMatch - Full-Stack Movie Discovery',
      desc: 'A Tinder-style web application to discover trending movies and build a personalized favorites collection. Built with a modern React frontend, a robust Java Spring Boot backend, and real-time data from the TMDB API.',
      stack: ['React', 'Spring Boot', 'PostgreSQL', 'TMDB API'],
      type: 'react',
      github: 'https://github.com/sasnavas/cinematch-portfolio',
      live: '#'
    },
    {
      title: 'Unique Coffee - Premium E-Commerce',
      desc: 'Unique Coffee is a Full-Stack Single Page Application (SPA). It is a premium e-commerce platform designed for professional baristas and coffee lovers. The system allows users to browse products, manage a shopping cart, and proceed to a secure checkout. The product prices and details are updated dynamically using a live database connection.',
      stack: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'MySQL'],
      type: 'e-commerce',
      github: 'https://github.com/sasnavas/uniqueCoffee',
      live: '#'
    },
    {
      title: 'EcoIT 🌍💻 Smart Carbon Dashboard for SMEs',
      desc: 'EcoIT is a simple web app for small businesses (SMEs). It acts as a smart carbon calculator. It helps owners see the carbon footprint of their IT devices.',
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      type: 'e-commerce',
      github: 'https://github.com/sasnavas/echoIt',
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
