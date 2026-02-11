import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type Sender = 'magia' | 'user';
export type FileStatus = 'validating' | 'valid' | 'invalid';

export interface ChatMessage {
  id: number;
  sender: Sender;
  text?: string;
  isHtml?: boolean;
  file?: {
    name: string;
    type: string;
    status: FileStatus;
  };
}

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="message" [ngClass]="message.sender">
      <div class="avatar" *ngIf="message.sender === 'magia'">✨</div>

      <ng-container *ngIf="message.file; else textMessage">
        <div class="file-card" [ngClass]="message.file.status">
          <div class="file-icon">{{ iconByType(message.file.type) }}</div>
          <div class="file-info">
            <span class="file-name">{{ message.file.name }}</span>
            <span class="file-status">{{ statusLabel(message.file.status) }}</span>
          </div>
        </div>
      </ng-container>

      <ng-template #textMessage>
        <div class="bubble" *ngIf="message.text">
          <span *ngIf="!message.isHtml">{{ message.text }}</span>
          <span *ngIf="message.isHtml" [innerHTML]="message.text"></span>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .message {
        display: flex;
        gap: 12px;
        max-width: 85%;
      }

      .message.magia {
        align-self: flex-start;
      }

      .message.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      .avatar {
        width: 36px;
        height: 36px;
        background: var(--primary-blue);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        flex-shrink: 0;
      }

      .bubble {
        padding: 12px 16px;
        border-radius: 12px;
        font-size: 0.95rem;
        line-height: 1.5;
        position: relative;
      }

      .magia .bubble {
        background: var(--bot-bubble);
        color: var(--text-main);
        border-top-left-radius: 2px;
      }

      .user .bubble {
        background: var(--user-bubble);
        color: white;
        border-top-right-radius: 2px;
      }

      .file-card {
        margin-top: 10px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid #30363d;
        border-radius: 8px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 240px;
      }

      .file-card.validating {
        border-color: var(--primary-blue);
        animation: pulse 1.5s infinite;
      }

      .file-card.valid {
        border-color: var(--success);
      }

      .file-card.invalid {
        border-color: var(--error);
      }

      .file-icon {
        font-size: 1.5rem;
      }

      .file-info {
        flex: 1;
      }

      .file-name {
        display: block;
        font-weight: 600;
        font-size: 0.85rem;
      }

      .file-status {
        font-size: 0.75rem;
        color: var(--text-muted);
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(47, 129, 247, 0.4);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(47, 129, 247, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(47, 129, 247, 0);
        }
      }
    `
  ]
})
export class ChatMessageComponent {
  @Input({ required: true }) message!: ChatMessage;

  statusLabel(status: FileStatus): string {
    if (status === 'valid') return 'Documento Validado ✓';
    if (status === 'invalid') return 'Erro: Documento ilegível ✕';
    return 'Validando documento...';
  }

  iconByType(type: string): string {
    if (type.includes('image')) return '🖼️';
    return '📄';
  }
}
