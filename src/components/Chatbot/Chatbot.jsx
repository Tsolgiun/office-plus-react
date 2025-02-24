import React, { useState } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', isBot: true }
  ]);
  const [inputText, setInputText] = useState('');

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = { text: inputText, isBot: false };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = { text: getBotResponse(inputText), isBot: true };
      setMessages(prev => [...prev, botResponse]);
    }, 500);

    setInputText('');
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('office') && (lowerMessage.includes('price') || lowerMessage.includes('cost'))) {
      return 'Our office prices vary based on location and size. Typically they range from 5,000 to 100,000 per month. Would you like to see specific listings?';
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return 'We have offices available in prime locations across the city. You can use the filters above to browse by area.';
    }
    
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve')) {
      return 'To book an office space, please browse our listings and click on the one you\'re interested in. You can then schedule a viewing or make a reservation.';
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('help')) {
      return 'You can reach us at (123) 456-7890 or email us at info@officeplus.com for any assistance.';
    }

    if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return 'Hello! How can I assist you with finding your perfect office space today?';
    }

    return "I understand you're interested in our office spaces. Could you please be more specific about what you'd like to know?";
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button className="chatbot-toggle" onClick={handleToggle}>
        {isOpen ? '✕' : '💬'}
      </button>
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Office Plus Assistant</h3>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="chatbot-input-form">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send">
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
