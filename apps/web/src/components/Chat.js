// components/Chat.js
import React, { useState, useEffect, useRef } from "react";

const Chat = ({ onClose, user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Mock seller info
  const seller = {
    id: 1,
    name: "Demo Seller",
    isOnline: true,
    lastSeen: "Online now",
  };

  // Load initial messages
  useEffect(() => {
    const mockMessages = [
      {
        id: 1,
        senderId: seller.id,
        message:
          "Hi! Thanks for your interest in the laptop. It's in excellent condition and comes with the original charger.",
        timestamp: new Date(Date.now() - 30000),
        senderName: seller.name,
      },
      {
        id: 2,
        senderId: user?.id || 2,
        message:
          "Hi! Can you tell me more about the battery life? And is the price negotiable?",
        timestamp: new Date(Date.now() - 20000),
        senderName: user?.full_name || "You",
      },
      {
        id: 3,
        senderId: seller.id,
        message:
          "The battery lasts about 6-7 hours with normal use. The price is ₹22,000 but I'm open to reasonable offers. What did you have in mind?",
        timestamp: new Date(Date.now() - 10000),
        senderName: seller.name,
      },
    ];
    setMessages(mockMessages);
  }, [user, seller.id, seller.name]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    chatInputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || loading) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setLoading(true);

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      senderId: user?.id || 2,
      message: messageText,
      timestamp: new Date(),
      senderName: user?.full_name || "You",
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate seller response (in real app, this would come from WebSocket/real-time updates)
      const sellerResponses = [
        "That sounds reasonable! Let me check and get back to you.",
        "Sure, I can share more photos. When would you like to inspect it?",
        "I'm available for pickup this weekend. Would that work for you?",
        "The laptop has been well-maintained. I can provide the purchase receipt too.",
        "Thanks for your interest! Let me know if you have any other questions.",
      ];

      setTimeout(() => {
        const randomResponse =
          sellerResponses[Math.floor(Math.random() * sellerResponses.length)];
        const sellerMessage = {
          id: Date.now() + 1,
          senderId: seller.id,
          message: randomResponse,
          timestamp: new Date(),
          senderName: seller.name,
        };
        setMessages((prev) => [...prev, sellerMessage]);
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isToday = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    return today.toDateString() === messageDate.toDateString();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return "Today";
    }
    return date.toLocaleDateString();
  };

  return (
    <div className="chat-overlay">
      <div className="chat-container">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="seller-info">
            <div className="seller-avatar">{seller.name.charAt(0)}</div>
            <div className="seller-details">
              <h4>{seller.name}</h4>
              <p className={`status ${seller.isOnline ? "online" : "offline"}`}>
                {seller.isOnline ? (
                  <>
                    <span className="status-dot online"></span>
                    Online now
                  </>
                ) : (
                  <>
                    <span className="status-dot offline"></span>
                    {seller.lastSeen}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="chat-actions">
            <button className="minimize-btn" title="Minimize">
              −
            </button>
            <button className="close-btn" onClick={onClose} title="Close">
              ×
            </button>
          </div>
        </div>

        {/* Product Context */}
        <div className="chat-product-context">
          <div className="product-mini">
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=60"
              alt="Product"
            />
            <div className="product-mini-info">
              <span className="product-mini-title">
                Used Laptop - Dell Inspiron 15
              </span>
              <span className="product-mini-price">₹22,000</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.map((message, index) => {
            const showDateHeader =
              index === 0 ||
              !isToday(messages[index - 1].timestamp) !==
                !isToday(message.timestamp) ||
              new Date(message.timestamp).toDateString() !==
                new Date(messages[index - 1].timestamp).toDateString();

            return (
              <React.Fragment key={message.id}>
                {showDateHeader && (
                  <div className="date-header">
                    {formatDate(message.timestamp)}
                  </div>
                )}
                <div
                  className={`message ${
                    message.senderId === (user?.id || 2) ? "sent" : "received"
                  }`}
                >
                  <div className="message-content">
                    <p>{message.message}</p>
                    <span className="message-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {loading && (
            <div className="message received">
              <div className="message-content typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
              ref={chatInputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
              disabled={loading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!newMessage.trim() || loading}
            >
              <span className="send-icon">➤</span>
            </button>
          </div>

          <div className="chat-footer">
            <div className="quick-actions">
              <button
                type="button"
                className="quick-action"
                onClick={() => setNewMessage("Is the price negotiable?")}
              >
                💰 Price negotiable?
              </button>
              <button
                type="button"
                className="quick-action"
                onClick={() => setNewMessage("Can I inspect the item?")}
              >
                👀 Inspect item
              </button>
              <button
                type="button"
                className="quick-action"
                onClick={() => setNewMessage("What's your best price?")}
              >
                💸 Best price?
              </button>
            </div>
          </div>
        </form>

        {/* Safety Tips */}
        <div className="chat-safety-tips">
          <div className="safety-tip">
            <span className="tip-icon">🛡️</span>
            <span className="tip-text">
              Keep conversations on EcoFinds for your safety. Never share
              personal financial information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
