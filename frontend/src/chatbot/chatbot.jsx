import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './chatbot.css';
import { FaCapsules } from 'react-icons/fa';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! I can help with orders, delivery, payments, prescriptions, and general wellness tips.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [showFaqs, setShowFaqs] = useState(true);
  const [relatedFaqs, setRelatedFaqs] = useState([]);

  const backendUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL, []);
  const location = useLocation();
  const isCartPage = location.pathname === '/cart';

  const toggleChat = () => setIsOpen(prev => !prev);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/chatbot/faqs`);
        if (response.data?.success) {
          setFaqs(response.data.faqs || []);
        }
      } catch (error) {
      }
    };

    loadFaqs();
  }, [backendUrl]);

  const applyRelatedFaqs = (text) => {
    const selected = faqs.find((faq) => faq.sample === text || faq.title === text);
    if (selected?.tags?.length) {
      const related = faqs
        .filter((faq) => faq.title !== selected.title)
        .map((faq) => ({
          faq,
          score: faq.tags?.filter((tag) => selected.tags.includes(tag)).length || 0
        }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((item) => item.faq);

      setRelatedFaqs(related);
    } else {
      setRelatedFaqs([]);
    }
  };

  const sendMessage = async (textOverride = '') => {
    const messageText = typeof textOverride === 'string' && textOverride.trim().length > 0
      ? textOverride
      : input;

    if (!messageText.trim()) return;

    const userMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowFaqs(false);

    if (!textOverride) {
      applyRelatedFaqs(messageText);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/chatbot/ask`,
        { message: messageText }
      );

      const botMessage = { sender: 'bot', text: response.data?.reply || 'Sorry, I could not respond right now.' };
      const followUp = { sender: 'bot', text: 'Anything else I can help with?' };
      setMessages(prev => [...prev, botMessage, followUp]);
    } catch (error) {
      const errorText = error?.response?.data?.message || 'Something went wrong. Please try again.';
      setMessages(prev => [...prev, { sender: 'bot', text: errorText }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFaqClick = (text) => {
    if (!text || loading) return;
    setShowFaqs(false);
    applyRelatedFaqs(text);
    sendMessage(text);
  };

  const handleShowFaqs = () => {
    if (loading) return;
    setShowFaqs(true);
  };

  return (
    <>
      <button
        className={`chatbot-toggle${isOpen ? ' is-hidden' : ''}${isCartPage ? ' cart-offset' : ''}`}
        onClick={toggleChat}
        aria-label="Open support assistant"
      >
        <FaCapsules size={22} />
        <span className="chatbot-toggle-pulse" />
      </button>

      {isOpen && (
        <div className={`chatbot-container${isCartPage ? ' cart-offset' : ''}`} role="dialog" aria-label="Support assistant">
          <div className="chatbot-header">
            <div className="chatbot-title">Pharmacy Assistant</div>
            <div className="chatbot-subtitle">Orders, delivery, payments, prescriptions</div>
            <button className="close-btn" onClick={toggleChat} aria-label="Close chat">×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.sender}`}>{msg.text}</div>
            ))}
            {showFaqs && faqs.length > 0 && (
              <div className="chatbot-faqs">
                <div className="chatbot-faqs-label">Quick picks</div>
                {faqs.map((faq, index) => (
                  <button
                    key={`${faq.title}-${index}`}
                    className="faq-chip"
                    onClick={() => handleFaqClick(faq.sample || faq.title)}
                    disabled={loading}
                  >
                    {faq.title}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="message bot">Thinking...</div>
            )}
            {relatedFaqs.length > 0 && (
              <div className="chatbot-related">
                <div className="chatbot-related-label">Related questions</div>
                <div className="chatbot-related-list">
                  {relatedFaqs.map((faq, index) => (
                    <button
                      key={`${faq.title}-related-${index}`}
                      className="faq-chip"
                      onClick={() => handleFaqClick(faq.sample || faq.title)}
                      disabled={loading}
                    >
                      {faq.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading}>Send</button>
          </div>
          <div className="chatbot-actions">
            <button
              className="chatbot-action-btn"
              onClick={handleShowFaqs}
              disabled={loading}
            >
              Show FAQs
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
