import { Conversation, Message } from './types';

export type ExportFormat = 'json' | 'text' | 'pdf';

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
