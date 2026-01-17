import { Conversation, Message } from './types';

export type ExportFormat = 'json' | 'text' | 'pdf' | 'html';

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

function formatMessageForText(message: Message): string {
  const role = message.role === 'user' ? 'You' : 'Assistant';
  const time = formatTimestamp(message.timestamp);
  return `[${time}] ${role}:\n${message.content}\n`;
}

export function exportAsJSON(conversation: Conversation): void {
  const exportData = {
    title: conversation.title,
    createdAt: formatTimestamp(conversation.createdAt),
    updatedAt: formatTimestamp(conversation.updatedAt),
    messages: conversation.messages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: formatTimestamp(m.timestamp),
    })),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  downloadBlob(blob, `${sanitizeFilename(conversation.title)}.json`);
}

export function exportAsText(conversation: Conversation): void {
  const header = `Conversation: ${conversation.title}\nCreated: ${formatTimestamp(conversation.createdAt)}\nLast Updated: ${formatTimestamp(conversation.updatedAt)}\n\n${'='.repeat(50)}\n\n`;
  
  const messagesText = conversation.messages
    .map(formatMessageForText)
    .join('\n');

  const content = header + messagesText;

  const blob = new Blob([content], { type: 'text/plain' });
  downloadBlob(blob, `${sanitizeFilename(conversation.title)}.txt`);
}

export function exportAsPDF(conversation: Conversation): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export as PDF');
    return;
  }

  const messagesHTML = conversation.messages
    .map(m => {
      const role = m.role === 'user' ? 'You' : 'Assistant';
      const time = formatTimestamp(m.timestamp);
      const bgColor = m.role === 'user' ? '#e3f2fd' : '#f5f5f5';
      return `
        <div style="margin-bottom: 16px; padding: 12px; background: ${bgColor}; border-radius: 8px;">
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${role} - ${time}</div>
          <div style="white-space: pre-wrap;">${escapeHTML(m.content)}</div>
        </div>
      `;
    })
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${escapeHTML(conversation.title)}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #333;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 8px;
        }
        .meta {
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #ddd;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>${escapeHTML(conversation.title)}</h1>
      <div class="meta">
        Created: ${formatTimestamp(conversation.createdAt)}<br>
        Last Updated: ${formatTimestamp(conversation.updatedAt)}
      </div>
      ${messagesHTML}
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export function exportAsHTML(conversation: Conversation): void {
  const messagesHTML = conversation.messages
    .map(m => {
      const role = m.role === 'user' ? 'You' : 'Assistant';
      const time = formatTimestamp(m.timestamp);
      const messageClass = m.role === 'user' ? 'message-user' : 'message-assistant';
      return `
        <div class="message ${messageClass}">
          <div class="message-header">${role} - ${time}</div>
          <div class="message-content">${escapeHTML(m.content)}</div>
        </div>
      `;
    })
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHTML(conversation.title)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      background-attachment: fixed;
      color: #1f2937;
      line-height: 1.6;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .header {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 12px;
      color: #1f2937;
    }
    
    .meta {
      font-size: 14px;
      color: #4b5563;
    }
    
    .meta span {
      display: block;
      margin-bottom: 4px;
    }
    
    .messages {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .message {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      padding: 16px 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      max-width: 85%;
    }
    
    .message-user {
      background: rgba(255, 255, 255, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.45);
      margin-left: auto;
    }
    
    .message-assistant {
      background: rgba(255, 255, 255, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.35);
      margin-right: auto;
    }
    
    .message-header {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .message-content {
      white-space: pre-wrap;
      word-wrap: break-word;
      color: #1f2937;
    }
    
    .footer {
      margin-top: 32px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-radius: 12px;
      padding: 16px;
    }
    
    @media (max-width: 640px) {
      .container {
        padding: 20px 12px;
      }
      
      .header {
        padding: 16px;
      }
      
      .header h1 {
        font-size: 22px;
      }
      
      .message {
        max-width: 95%;
        padding: 12px 16px;
      }
    }
    
    @media print {
      body {
        background: white;
      }
      
      .header, .message, .footer {
        background: #f9fafb;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: 1px solid #e5e7eb;
      }
      
      .message-user {
        background: #e0e7ff;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${escapeHTML(conversation.title)}</h1>
      <div class="meta">
        <span>Created: ${formatTimestamp(conversation.createdAt)}</span>
        <span>Last Updated: ${formatTimestamp(conversation.updatedAt)}</span>
      </div>
    </div>
    <div class="messages">
      ${messagesHTML}
    </div>
    <div class="footer">
      Exported from Voiced Sandbox
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  downloadBlob(blob, `${sanitizeFilename(conversation.title)}.html`);
}

export function exportConversation(conversation: Conversation, format: ExportFormat): void {
  switch (format) {
    case 'json':
      exportAsJSON(conversation);
      break;
    case 'text':
      exportAsText(conversation);
      break;
    case 'pdf':
      exportAsPDF(conversation);
      break;
    case 'html':
      exportAsHTML(conversation);
      break;
  }
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
