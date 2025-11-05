import { Component, OnDestroy, AfterViewInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

type ScrollDirection = 'down' | 'up';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TitleCasePipe],
  templateUrl: './shell.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit, OnDestroy {
  // Constants
  private readonly BACK_TO_TOP_THRESHOLD = 200;
  private readonly SECTION_ANIMATION_DURATION = 800;
  private readonly ROUTER_RENDER_DELAY = 100;
  private readonly DEFAULT_HEADER_HEIGHT = 64;
  private readonly NAVIGATION_OFFSET = 12;
  private readonly INTERSECTION_THRESHOLD = 0.6;
  
  // Public signals
  protected readonly title = signal('Sesnavas.DEV');
  readonly menuOpen = signal(false);
  readonly activeSection = signal<string>('home');
  readonly showToTop = signal(false);
  readonly scrollProgress = signal(0);
  readonly isSectionChanging = signal(false);
  readonly scrollDirection = signal<ScrollDirection>('down');
  
  // Private state
  private lastScrollY = 0;
  private intersectionObserver?: IntersectionObserver;

  get year(): number {
    return new Date().getFullYear();
  }

  // Menu actions
  toggleMenu(): void {
    this.menuOpen.update(isOpen => !isOpen);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  // Scroll actions
  scrollToTop(): void {
    if (!this.isClient()) return;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onNavClick(sectionId: string, event: Event): void {
    if (!this.isClient()) return;
    
    event.preventDefault();
    this.closeMenu();
    
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;
    
    const scrollPosition = this.calculateScrollPosition(targetSection);
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  }

  // Lifecycle hooks
  ngAfterViewInit(): void {
    if (!this.isClient()) return;
    
    this.initializeScrollListener();
    this.initializeSectionObserver();
  }

  ngOnDestroy(): void {
    this.cleanupObservers();
  }

  // Private methods
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private initializeScrollListener(): void {
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.handleScroll();
  }

  private initializeSectionObserver(): void {
    setTimeout(() => {
      const sections = this.querySections();
      
      if (sections.length === 0) return;
      
      this.intersectionObserver = this.createSectionObserver();
      this.observeSections(sections);
    }, this.ROUTER_RENDER_DELAY);
  }

  private handleScroll = (): void => {
    if (!this.isClient()) return;
    
    const currentScrollY = window.scrollY;
    
    this.updateBackToTopVisibility(currentScrollY);
    this.updateScrollProgress(currentScrollY);
    this.updateScrollDirection(currentScrollY);
    
    this.lastScrollY = currentScrollY;
  };

  private updateBackToTopVisibility(scrollY: number): void {
    this.showToTop.set(scrollY > this.BACK_TO_TOP_THRESHOLD);
  }

  private updateScrollProgress(scrollTop: number): void {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / documentHeight) * 100;
    const invertedPercent = 100 - scrollPercent;
    const clampedPercent = Math.min(Math.max(invertedPercent, 0), 100);
    
    this.scrollProgress.set(clampedPercent);
  }

  private updateScrollDirection(currentScrollY: number): void {
    if (currentScrollY > this.lastScrollY) {
      this.scrollDirection.set('down');
    } else if (currentScrollY < this.lastScrollY) {
      this.scrollDirection.set('up');
    }
  }

  private querySections(): HTMLElement[] {
    return Array.from(document.querySelectorAll('section[id]'));
  }

  private createSectionObserver(): IntersectionObserver {
    return new IntersectionObserver(
      this.handleSectionIntersection,
      {
        threshold: this.INTERSECTION_THRESHOLD,
        rootMargin: '0px 0px -10% 0px'
      }
    );
  }

  private handleSectionIntersection = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.handleSectionChange(entry.target as HTMLElement);
      }
    });
  };

  private handleSectionChange(section: HTMLElement): void {
    const sectionId = section.id;
    
    if (!sectionId || sectionId === this.activeSection()) return;
    
    this.triggerSectionAnimation();
    this.activeSection.set(sectionId);
    this.scheduleSectionAnimationEnd();
  }

  private triggerSectionAnimation(): void {
    this.isSectionChanging.set(true);
  }

  private scheduleSectionAnimationEnd(): void {
    setTimeout(() => {
      this.isSectionChanging.set(false);
    }, this.SECTION_ANIMATION_DURATION);
  }

  private observeSections(sections: HTMLElement[]): void {
    sections.forEach(section => {
      this.intersectionObserver?.observe(section);
    });
  }

  private calculateScrollPosition(targetElement: HTMLElement): number {
    const header = document.querySelector('.site-header') as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? this.DEFAULT_HEADER_HEIGHT;
    const elementTop = targetElement.getBoundingClientRect().top;
    const scrollOffset = window.pageYOffset;
    const totalOffset = headerHeight + this.NAVIGATION_OFFSET;
    const targetPosition = elementTop + scrollOffset - totalOffset;
    
    return Math.max(0, targetPosition);
  }

  private cleanupObservers(): void {
    this.intersectionObserver?.disconnect();
    
    if (this.isClient()) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
}
