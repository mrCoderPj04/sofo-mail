import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar-container" [class.size-sm]="size === 'sm'" [class.size-md]="size === 'md'" [class.size-lg]="size === 'lg'" [class.size-xl]="size === 'xl'">
      @if (imageUrl) {
        <img [src]="imageUrl" [alt]="name" class="avatar-img" />
      } @else {
        <div class="avatar-fallback" [style.background]="fallbackBg()">
          {{ initials() }}
        </div>
      }
      @if (status) {
        <span class="status-indicator" [class]="'status-' + status.toLowerCase()"></span>
      }
    </div>
  `,
  styles: [`
    .avatar-container {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      user-select: none;
      flex-shrink: 0;
    }
    .size-sm { width: 28px; height: 28px; font-size: 11px; }
    .size-md { width: 36px; height: 36px; font-size: 13px; }
    .size-lg { width: 44px; height: 44px; font-size: 15px; }
    .size-xl { width: 64px; height: 64px; font-size: 20px; }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }

    .avatar-fallback {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: #ffffff;
      border-radius: inherit;
      letter-spacing: 0.5px;
    }

    .status-indicator {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      border: 2px solid var(--bg-surface);
    }
    .status-active { background-color: var(--status-success); }
    .status-in_meeting { background-color: var(--status-warning); }
    .status-away { background-color: #f97316; }
    .status-out_of_office { background-color: #64748b; }
  `]
})
export class AvatarComponent {
  @Input() name = 'PJSOFONIC Employee';
  @Input() imageUrl?: string;
  @Input() status?: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  readonly initials = computed(() => {
    if (!this.name) return 'PJ';
    const parts = this.name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return this.name.substring(0, 2).toUpperCase();
  });

  readonly fallbackBg = computed(() => {
    const palette = [
      'linear-gradient(135deg, #0284c7, #0369a1)',
      'linear-gradient(135deg, #0f766e, #115e59)',
      'linear-gradient(135deg, #4338ca, #3730a3)',
      'linear-gradient(135deg, #0369a1, #0c4a6e)',
      'linear-gradient(135deg, #334155, #1e293b)'
    ];
    let hash = 0;
    for (let i = 0; i < this.name.length; i++) {
      hash = this.name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % palette.length;
    return palette[idx];
  });
}
