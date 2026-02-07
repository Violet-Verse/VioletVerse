import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './LiveAgent.module.css'

const SUGGESTED_PROMPTS = [
  'What is Violet Verse?',
  'Explain NFTs simply',
  'How do I get started with Web3?',
  'What can I explore here?',
]

export default function LiveAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const abortControllerRef = useRef(null)

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

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return

    setError(null)
    const userMessage = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    // Add empty assistant message for streaming
    const assistantId = Date.now()
    setMessages((prev) => [...prev, { role: 'assistant', content: '', id: assistantId }])

    try {
      abortControllerRef.current = new AbortController()

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed with status ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          try {
            const parsed = JSON.parse(trimmed.slice(6))
            if (parsed.type === 'delta' && parsed.text) {
              fullText += parsed.text
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: fullText } : m
                )
              )
            }
          } catch {
            // Skip unparseable
          }
        }
      }

      // If no text was received, show a fallback
      if (!fullText) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: "I'm having trouble responding right now. Please try again." }
              : m
          )
        )
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      console.error('Chat error:', err.message)
      setError(err.message)
      // Remove the empty assistant message
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [messages, isLoading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const text = input
    setInput('')
    sendMessage(text)
  }

  const handleSuggestion = (prompt) => {
    sendMessage(prompt)
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
        <div className={styles.messages}>
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

          {messages.map((message, idx) => {
            if (!message.content) {
              // Show typing indicator for empty assistant messages
              if (message.role === 'assistant' && isLoading) {
                return (
                  <div key={message.id || idx} className={`${styles.message} ${styles.messageAssistant}`}>
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
                )
              }
              return null
            }
            return (
              <div
                key={message.id || idx}
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
                  {message.content}
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
