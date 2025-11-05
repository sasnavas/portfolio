import { Component } from '@angular/core';
import { trigger, state, style, transition, animate, stagger, query, keyframes } from '@angular/animations';
import { AboutComponent } from '../about/about.component';
import { SkillsComponent } from '../skills/skills.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactComponent } from '../contact/contact.component';

type ButtonState = 'idle' | 'hover';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, SkillsComponent, ProjectsComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('heroFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms 200ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('titleSlideDown', [
      transition(':enter', [
        animate('1200ms 400ms cubic-bezier(0.16, 1, 0.3, 1)', keyframes([
          style({ opacity: 0, transform: 'translateY(-60px) scale(0.9)', offset: 0 }),
          style({ opacity: 0.5, transform: 'translateY(-30px) scale(0.95)', offset: 0.3 }),
          style({ opacity: 1, transform: 'translateY(0) scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('subtitleSlideUp', [
      transition(':enter', [
        animate('1000ms 800ms cubic-bezier(0.16, 1, 0.3, 1)', keyframes([
          style({ opacity: 0, transform: 'translateY(40px) scale(0.95)', offset: 0 }),
          style({ opacity: 0.6, transform: 'translateY(20px) scale(0.98)', offset: 0.4 }),
          style({ opacity: 1, transform: 'translateY(0) scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('textStagger', [
      transition(':enter', [
        query('.text-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(120, [
            animate('700ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('avatarEntry', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.85)' }),
        animate('1000ms 800ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('buttonGlow', [
      state('idle', style({ transform: 'scale(1)' })),
      state('hover', style({ transform: 'scale(1.05)' })),
      transition('idle <=> hover', animate('300ms ease-out'))
    ])
  ]
})
export class HomeComponent {
  private readonly PROJECTS_SECTION_ID = 'projects';
  private readonly MAX_CHAR_SCALE_DISTANCE = 120;
  private readonly MAX_CHAR_SCALE_FACTOR = 0.6;
  
  buttonState: ButtonState = 'idle';

  scrollToProjects(): void {
    const projectsSection = document.getElementById(this.PROJECTS_SECTION_ID);
    
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onTitleMouseMove(event: MouseEvent): void {
    const titleElement = event.currentTarget as HTMLElement;
    const characters = titleElement.querySelectorAll('.char');
    
    characters.forEach(char => {
      const scaleFactor = this.calculateCharacterScale(char as HTMLElement, event);
      (char as HTMLElement).style.transform = `scale(${scaleFactor})`;
    });
  }

  onTitleMouseLeave(event: MouseEvent): void {
    const titleElement = event.currentTarget as HTMLElement;
    const characters = titleElement.querySelectorAll('.char');
    
    this.resetCharacterScales(characters);
  }

  private calculateCharacterScale(char: HTMLElement, event: MouseEvent): number {
    const distance = this.getDistanceFromMouse(char, event);
    const normalizedDistance = Math.min(distance / this.MAX_CHAR_SCALE_DISTANCE, 1);
    const scaleFactor = 1 + (1 - normalizedDistance) * this.MAX_CHAR_SCALE_FACTOR;
    
    return Math.max(1, scaleFactor);
  }

  private getDistanceFromMouse(element: HTMLElement, event: MouseEvent): number {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;
    
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  private resetCharacterScales(characters: NodeListOf<Element>): void {
    characters.forEach(char => {
      (char as HTMLElement).style.transform = 'scale(1)';
    });
  }
}
