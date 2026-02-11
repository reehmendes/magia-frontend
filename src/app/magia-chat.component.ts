import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessage, ChatMessageComponent } from './chat-message.component';

interface BackendResponse {
  valid: boolean;
  score: number;
  messages: string[];
}

@Component({
  selector: 'app-magia-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatMessageComponent],
  templateUrl: './magia-chat.component.html',
  styleUrl: './magia-chat.component.css'
})
export class MagiaChatComponent {
  messages: ChatMessage[] = [
    {
      id: 1,
      sender: 'magia',
      text: 'Sentimos muito pela sua perda. Estamos aqui para ajudar você neste momento difícil.'
    },
    {
      id: 2,
      sender: 'magia',
      text: 'Para começarmos, você pode me enviar a <b>Certidão de Óbito</b> do segurado? Pode ser foto ou PDF.',
      isHtml: true
    }
  ];

  userInput = '';
  isProcessing = false;

  get statusLabel(): string {
    return this.isProcessing ? '● Processando...' : '● Online';
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isProcessing) return;

    this.messages.push({
      id: Date.now(),
      sender: 'user',
      text: this.userInput.trim()
    });

    this.userInput = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || this.isProcessing) return;

    this.isProcessing = true;

    const fileMessageId = Date.now();
    this.messages.push({
      id: fileMessageId,
      sender: 'user',
      file: {
        name: file.name,
        type: file.type,
        status: 'validating'
      }
    });

    this.emitUserSentAttachment(file).then((backend) => {
      const fileMessage = this.messages.find((msg) => msg.id === fileMessageId);
      if (fileMessage?.file) {
        fileMessage.file.status = backend.valid ? 'valid' : 'invalid';
      }

      setTimeout(() => {
        backend.messages.forEach((text) => {
          this.messages.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            sender: 'magia',
            text,
            isHtml: true
          });
        });
      }, 800);

      this.isProcessing = false;
      input.value = '';
    });
  }

  private emitUserSentAttachment(file: File): Promise<BackendResponse> {
    // Evento conceitual: UserSentAttachment(documento)
    void file;

    return new Promise((resolve) => {
      setTimeout(() => {
        const isValid = file.type === 'application/pdf';

        resolve({
          valid: isValid,
          score: isValid ? 98 : 20,
          messages: isValid
            ? [
                'Recebi a Certidão. O score de confiança é 98%.',
                'Agora, por favor, baixe e preencha o <b>Rol de Herdeiros</b> e envie aqui.'
              ]
            : ['Não conseguimos ler este arquivo. Por favor, envie uma foto mais nítida ou um PDF original.']
        });
      }, 2500);
    });
  }
}
