import { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaPaperPlane,
  FaTimes,
  FaMinus,
} from "react-icons/fa";

import API from "../api";

function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Hello! 👋 I'm your AI Tourism Guide. I can help you with destinations, hotels, transport, trip planning, bookings and travel recommendations.",
    },
  ]);

  const messagesEndRef = useRef(null);

  // =====================================================
  // AUTO SCROLL
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async () => {
    const text = message.trim();

    if (!text || loading) {
      return;
    }

    // Add user message
    setMessages((previous) => [
      ...previous,
      {
        sender: "user",
        text,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      const response = await API.post(
        "/chat/",
        {
          message: text,
        },
        config
      );

      const data = response.data;

      const aiReply =
        data.reply ||
        data.response ||
        data.message ||
        data.answer ||
        "Sorry, I could not generate a response.";

      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text: aiReply,
        },
      ]);
    } catch (error) {
      console.error(
        "AI Guide Error:",
        error.response?.data || error.message
      );

      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text:
            "Sorry, I'm having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* =================================================
          FLOATING AI GUIDE BUTTON
      ================================================= */}

      {!open && (
        <button
          type="button"
          className="ai-floating-button"
          onClick={() => setOpen(true)}
          aria-label="Open AI Tourism Guide"
        >
          <span className="ai-floating-icon">
            <FaRobot />
          </span>

          <span className="ai-floating-text">
            <strong>AI Guide</strong>
            <small>Need travel help?</small>
          </span>
        </button>
      )}

      {/* =================================================
          AI GUIDE CHAT BOX
      ================================================= */}

      {open && (
        <div className="ai-assistant-box">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="ai-assistant-header">

            <div className="ai-assistant-title">

              <div className="ai-assistant-avatar">
                <FaRobot />
              </div>

              <div>
                <strong>AI Tourism Guide</strong>

                <span>
                  <i></i>
                  Online
                </span>
              </div>

            </div>

            <div className="ai-assistant-actions">

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Minimize AI Guide"
                title="Minimize"
              >
                <FaMinus />
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close AI Guide"
                title="Close"
              >
                <FaTimes />
              </button>

            </div>

          </div>

          {/* =================================================
              CHAT MESSAGES
          ================================================= */}

          <div className="ai-assistant-messages">

            {messages.map((item, index) => (
              <div
                key={index}
                className={`ai-message-row ${
                  item.sender === "user"
                    ? "ai-user-message-row"
                    : "ai-bot-message-row"
                }`}
              >

                {item.sender === "ai" && (
                  <div className="ai-small-avatar">
                    <FaRobot />
                  </div>
                )}

                <div
                  className={`ai-message ${
                    item.sender === "user"
                      ? "ai-user-message"
                      : "ai-bot-message"
                  }`}
                >
                  {item.text}
                </div>

              </div>
            ))}

            {/* =================================================
                TYPING INDICATOR
            ================================================= */}

            {loading && (
              <div className="ai-message-row ai-bot-message-row">

                <div className="ai-small-avatar">
                  <FaRobot />
                </div>

                <div className="ai-message ai-bot-message ai-typing">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>
            )}

            <div ref={messagesEndRef}></div>

          </div>

          {/* =================================================
              INPUT
          ================================================= */}

          <div className="ai-assistant-input-area">

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI Tourism Guide..."
              rows="1"
              disabled={loading}
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>

          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="ai-assistant-footer">
            AI-powered Tourism Guide
          </div>

        </div>
      )}

      {/* =================================================
          AI GUIDE STYLES
      ================================================= */}

      <style>
        {`

        /* =================================================
           FLOATING BUTTON
        ================================================= */

        .ai-floating-button {
          position: fixed;

          right: 24px;
          bottom: 24px;

          z-index: 2000;

          display: flex;
          align-items: center;

          gap: 11px;

          border: none;

          padding: 10px 16px 10px 10px;

          border-radius: 18px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #0d6efd,
              #4f46e5
            );

          box-shadow:
            0 12px 35px
            rgba(13, 110, 253, 0.30);

          cursor: pointer;

          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }


        .ai-floating-button:hover {
          transform: translateY(-3px);

          box-shadow:
            0 16px 40px
            rgba(13, 110, 253, 0.38);
        }


        .ai-floating-icon {
          width: 42px;
          height: 42px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            rgba(255, 255, 255, 0.18);

          font-size: 19px;
        }


        .ai-floating-text {
          display: flex;

          flex-direction: column;

          align-items: flex-start;

          line-height: 1.2;
        }


        .ai-floating-text strong {
          font-size: 13px;
          font-weight: 800;
        }


        .ai-floating-text small {
          margin-top: 3px;

          font-size: 10px;

          opacity: 0.82;
        }


        /* =================================================
           CHAT BOX
        ================================================= */

        .ai-assistant-box {
          position: fixed;

          right: 24px;
          bottom: 24px;

          z-index: 2000;

          width: 380px;
          height: 540px;

          display: flex;

          flex-direction: column;

          overflow: hidden;

          background: white;

          border:
            1px solid rgba(15, 23, 42, 0.08);

          border-radius: 22px;

          box-shadow:
            0 25px 70px
            rgba(15, 23, 42, 0.20);

          animation:
            aiAssistantOpen
            0.25s ease;
        }


        @keyframes aiAssistantOpen {

          from {
            opacity: 0;

            transform:
              translateY(18px)
              scale(0.97);
          }

          to {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);
          }

        }


        /* =================================================
           HEADER
        ================================================= */

        .ai-assistant-header {
          min-height: 76px;

          padding:
            14px 16px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          color: white;

          background:
            linear-gradient(
              135deg,
              #0d6efd,
              #4f46e5
            );
        }


        .ai-assistant-title {
          display: flex;

          align-items: center;

          gap: 11px;
        }


        .ai-assistant-avatar {
          width: 43px;
          height: 43px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            rgba(255, 255, 255, 0.18);

          font-size: 18px;
        }


        .ai-assistant-title strong {
          display: block;

          font-size: 14px;

          font-weight: 800;
        }


        .ai-assistant-title span {
          display: flex;

          align-items: center;

          gap: 5px;

          margin-top: 3px;

          font-size: 10px;

          opacity: 0.88;
        }


        .ai-assistant-title span i {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background: #86efac;
        }


        .ai-assistant-actions {
          display: flex;

          gap: 4px;
        }


        .ai-assistant-actions button {
          width: 30px;
          height: 30px;

          display: flex;

          align-items: center;
          justify-content: center;

          border: none;

          border-radius: 8px;

          color: white;

          background:
            rgba(255, 255, 255, 0.12);

          cursor: pointer;
        }


        .ai-assistant-actions button:hover {
          background:
            rgba(255, 255, 255, 0.22);
        }


        /* =================================================
           MESSAGES
        ================================================= */

        .ai-assistant-messages {
          flex: 1;

          overflow-y: auto;

          padding: 18px 15px;

          background:
            #f7f9fc;
        }


        .ai-message-row {
          display: flex;

          align-items: flex-end;

          gap: 7px;

          margin-bottom: 13px;
        }


        .ai-user-message-row {
          justify-content: flex-end;
        }


        .ai-bot-message-row {
          justify-content: flex-start;
        }


        .ai-small-avatar {
          flex-shrink: 0;

          width: 28px;
          height: 28px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #0d6efd;

          background: #e8f1ff;

          font-size: 12px;
        }


        .ai-message {
          max-width: 78%;

          padding:
            10px 12px;

          border-radius: 14px;

          font-size: 12px;

          line-height: 1.55;

          word-break: break-word;

          white-space: pre-wrap;
        }


        .ai-bot-message {
          color: #334155;

          background: white;

          border:
            1px solid #e8edf4;

          border-bottom-left-radius: 4px;
        }


        .ai-user-message {
          color: white;

          background:
            linear-gradient(
              135deg,
              #0d6efd,
              #4f46e5
            );

          border-bottom-right-radius: 4px;
        }


        /* =================================================
           TYPING
        ================================================= */

        .ai-typing {
          display: flex;

          align-items: center;

          gap: 4px;

          padding:
            12px 14px;
        }


        .ai-typing span {
          width: 5px;
          height: 5px;

          border-radius: 50%;

          background: #94a3b8;

          animation:
            aiTyping 1.2s infinite;
        }


        .ai-typing span:nth-child(2) {
          animation-delay: 0.15s;
        }


        .ai-typing span:nth-child(3) {
          animation-delay: 0.30s;
        }


        @keyframes aiTyping {

          0%,
          60%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }

          30% {
            opacity: 1;
            transform: translateY(-3px);
          }

        }


        /* =================================================
           INPUT
        ================================================= */

        .ai-assistant-input-area {
          display: flex;

          align-items: flex-end;

          gap: 8px;

          padding:
            11px 12px;

          background: white;

          border-top:
            1px solid #edf0f5;
        }


        .ai-assistant-input-area textarea {
          flex: 1;

          resize: none;

          min-height: 40px;
          max-height: 90px;

          padding:
            11px 12px;

          border:
            1px solid #e1e7ef;

          border-radius: 12px;

          outline: none;

          color: #334155;

          background: #f8fafc;

          font-family: inherit;

          font-size: 12px;

          line-height: 1.4;
        }


        .ai-assistant-input-area textarea:focus {
          border-color: #8ab4f8;

          box-shadow:
            0 0 0 3px
            rgba(13, 110, 253, 0.08);
        }


        .ai-assistant-input-area button {
          width: 40px;
          height: 40px;

          flex-shrink: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          border: none;

          border-radius: 12px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #0d6efd,
              #4f46e5
            );

          cursor: pointer;
        }


        .ai-assistant-input-area button:disabled {
          opacity: 0.45;

          cursor: not-allowed;
        }


        /* =================================================
           FOOTER
        ================================================= */

        .ai-assistant-footer {
          padding:
            6px 10px 8px;

          text-align: center;

          color: #a0aabb;

          background: white;

          font-size: 9px;

          border-top:
            1px solid #f1f3f6;
        }


        /* =================================================
           MOBILE
        ================================================= */

        @media (max-width: 576px) {

          .ai-floating-button {
            right: 15px;
            bottom: 15px;

            padding:
              9px 13px 9px 9px;
          }


          .ai-floating-icon {
            width: 39px;
            height: 39px;
          }


          .ai-assistant-box {
            right: 10px;
            bottom: 10px;

            width:
              calc(100vw - 20px);

            height:
              min(540px, calc(100vh - 30px));

            border-radius: 18px;
          }

        }

        `}
      </style>
    </>
  );
}

export default AIAssistant;