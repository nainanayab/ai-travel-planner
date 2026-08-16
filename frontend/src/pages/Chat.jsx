import { useState } from "react";
import API from "../api";

function Chat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) {
      return;
    }

    const userText = message.trim();

    setChat((prev) => [
      ...prev,
      {
        sender: "user",
        text: userText,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      console.log("Sending message:", userText);

      const response = await API.post("/chat", {
        message: userText,
      });

      console.log("Chat API response:", response);
      console.log("Chat API data:", response.data);

      // Backend currently returns:
      // { "reply": "..." }

      const aiReply =
        response.data?.reply ||
        response.data?.message ||
        response.data?.response ||
        response.data?.answer;

      if (aiReply) {
        setChat((prev) => [
          ...prev,
          {
            sender: "ai",
            text: String(aiReply),
          },
        ]);
      } else {
        console.error(
          "Chat API returned no reply:",
          response.data
        );

        setChat((prev) => [
          ...prev,
          {
            sender: "ai",
            text: "AI returned an empty response.",
          },
        ]);
      }
    } catch (error) {
      console.error(
        "Chat Error:",
        error.response?.data || error.message
      );

      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Sorry, AI service is unavailable.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        🤖 AI Tourism Assistant
      </h2>

      <div className="card shadow p-4">

        <div
          style={{
            height: "350px",
            overflowY: "auto",
          }}
          className="mb-3"
        >

          {chat.length === 0 && (
            <p className="text-muted text-center">
              Ask me about places, trips, and travel plans.
            </p>
          )}

          {chat.map((item, index) => (
            <div
              key={index}
              className={
                item.sender === "user"
                  ? "text-end mb-3"
                  : "text-start mb-3"
              }
            >

              <div
                className={
                  item.sender === "user"
                    ? "badge bg-primary p-3"
                    : "badge bg-success p-3"
                }
                style={{
                  whiteSpace: "pre-line",
                  textAlign: "left",
                  display: "inline-block",
                  maxWidth: "80%",
                  fontSize: "15px",
                  lineHeight: "1.6",
                }}
              >
                {item.text}
              </div>

            </div>
          ))}

          {loading && (
            <p className="text-muted">
              🤖 AI is thinking...
            </p>
          )}

        </div>

        <form onSubmit={sendMessage}>

          <div className="input-group">

            <input
              type="text"
              className="form-control"
              placeholder="Ask about tourism..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
            />

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Thinking..." : "Send"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default Chat;