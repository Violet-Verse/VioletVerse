import { useState, useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import styles from './LiveAgent.module.css'

const SUGGESTED_PROMPTS = [
  'What is Violet Verse?',
  'Explain NFTs simply',
  'How do I get started with Web3?',
  'What can I explore here?',
]

function getMessageText(message) {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p) => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

export default function LiveAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatContainerRef = useRef(null)

  const chatTransport = useRef(new DefaultChatTransport({ api: '/api/chat' }))

  const { messages, sendMessage, status, error } = useChat({
    transport: chatTransport.current,
    onError: (err) => {
      console.log('[v0] useChat onError:', err?.message || String(err))
    },
  })

  useEffect(() => {
    console.log('[v0] Chat status:', status, 'Messages count:', messages.length)
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1]
      console.log('[v0] Last message role:', lastMsg.role, 'parts:', JSON.stringify(lastMsg.parts)?.slice(0, 200))
    }
    if (error) console.log('[v0] Chat error object:', String(error))
  }, [status, messages, error])

  const isLoading = status === 'streaming' || status === 'submitted'

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput('')
  }

  const handleSuggestion = (prompt) => {
    sendMessage({ text: prompt })
  }

  const toggleChat = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <div className={styles.wrapper}>
      {/* Chat Panel */}
      <div className={`${styles.panel} ${isOpen ? styles.panelOpen : styles.panelClosed}`}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className={styles.statusDot} />
            </div>
            <div>
              <h4 className={styles.headerTitle}>Violet</h4>
              <span className={styles.headerSubtitle}>AI Guide</span>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={toggleChat}
            aria-label="Close chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className={styles.messages} ref={chatContainerRef}>
          {messages.length === 0 && (
            <div className={styles.welcome}>
              <div className={styles.welcomeIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <p className={styles.welcomeTitle}>Hey, I&apos;m Violet</p>
              <p className={styles.welcomeSubtitle}>
                Your AI guide to Violet Verse and the world of Web3. Ask me anything.
              </p>
              <div className={styles.suggestions}>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className={styles.suggestionChip}
                    onClick={() => handleSuggestion(prompt)}
                    disabled={isLoading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = getMessageText(message)
            if (!text) return null
            return (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.messageUser : styles.messageAssistant
                }`}
              >
                {message.role === 'assistant' && (
                  <div className={styles.messageAvatar}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                )}
                <div
                  className={`${styles.bubble} ${
                    message.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant
                  }`}
                >
                  {text}
                </div>
              </div>
            )
          })}

          {error && (
            <div className={`${styles.message} ${styles.messageAssistant}`}>
              <div className={styles.messageAvatar}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div className={`${styles.bubble} ${styles.bubbleAssistant}`} style={{ color: '#c0392b', fontSize: '13px' }}>
                Something went wrong. Please try again.
              </div>
            </div>
          )}

          {isLoading && messages.length > 0 && getMessageText(messages[messages.length - 1]) === '' && (
            <div className={`${styles.message} ${styles.messageAssistant}`}>
              <div className={styles.messageAvatar}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>
                <div className={styles.typing}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className={styles.inputArea} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Violet anything..."
            disabled={isLoading}
            aria-label="Chat message input"
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>

        {/* Footer */}
        <div className={styles.poweredBy}>
          Powered by Violet Verse
        </div>
      </div>

      {/* Floating Bubble */}
      <button
        className={`${styles.bubble_trigger} ${isOpen ? styles.bubble_hidden : ''}`}
        onClick={toggleChat}
        aria-label="Open chat with Violet AI"
      >
        <div className={styles.bubblePulse} />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  )
}
