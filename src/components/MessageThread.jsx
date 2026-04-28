import { useMemo, useState } from 'react';
import { Send } from 'lucide-react';

const formatTimestamp = (value) =>
  new Date(value).toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function MessageThread({
  initialMessages = [],
  title = 'Messages',
  sendLabel = 'Send message',
  placeholder = 'Type your message...',
  composerAuthor = 'Operations Desk',
  composerType = 'operations',
  threadId,
  onMessagesChange,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');

  const orderedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
    [messages]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (draft.trim() === '') return;

    setMessages((prev) => {
      const next = [
      ...prev,
      {
        id: `LOCAL-${prev.length + 1}`,
        author: composerAuthor,
        type: composerType,
        content: draft.trim(),
        timestamp: new Date().toISOString(),
      },
      ];
      onMessagesChange?.(next);
      return next;
    });
    setDraft('');
  };

  return (
    <div className="dashboard-card message-thread-card" id={threadId}>
      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="message-thread-list">
        {orderedMessages.map((message) => (
          <div key={message.id} className={`message-bubble ${message.type}`}>
            <div className="message-bubble-top">
              <strong>{message.author}</strong>
              <span>{formatTimestamp(message.timestamp)}</span>
            </div>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <form className="message-composer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder}
        />
        <button type="submit" className="primary-button">
          <Send size={16} />
          <span>{sendLabel}</span>
        </button>
      </form>
    </div>
  );
}
