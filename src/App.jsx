import { useState } from "react";
import "./App.css";

import background from "./assets/BACKROUND/hero-background.jpg.jpg";
import aura from "./assets/charecter/aura-new.jpg.jpg";

import story1 from "./assets/story/story1.jpg.png";
import story2 from "./assets/story/story2.jpg.png";
import story3 from "./assets/story/story3.jpg.png";
import story4 from "./assets/story/story4.jpg.png";
import story5 from "./assets/story/story5.jpg.png";

function App() {
  const [chatOpen, setChatOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "aura",
      text: "Hi, I'm AURA 🌸 I'm here to listen. What's on your mind?",
    },
  ]);

  const [input, setInput] = useState("");

  // Visitor information
  const [userDetails, setUserDetails] = useState({
    name: "",
    age: "",
    email: "",
    location: "",
    concern: "",
  });

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Story
  const [storyOpen, setStoryOpen] = useState(false);
  const [storyIndex, setStoryIndex] = useState(0);

  const stories = [
  {
    image: story1,
    text: "Every hero begins with a reason to care.\nAURA was born from a simple wish: no girl should feel alone.",
  },
  {
    image: story2,
    text: "She learned that questions about the body can feel confusing and difficult to ask.\nSo she became a guide who listens without judgment.",
  },
  {
    image: story3,
    text: "From periods and emotions to everyday wellbeing, AURA is there to explain and support.\nHer greatest power is turning uncertainty into understanding.",
  },
  {
    image: story4,
    text: "But AURA knows that asking for help is also a kind of strength.\nShe reminds every girl that her voice, feelings, and questions matter.",
  },
  {
    image: story5,
    text: "Now AURA stands beside every girl who needs someone to listen.\nBecause understanding yourself is the beginning of discovering your own power.",
  },
];

  // =========================
  // CHAT WITH AURA
  // =========================

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();

    const userMessage = {
      sender: "user",
      text: userText,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    // Save the first visitor message as their grievance/request
    if (!userDetails.concern) {
      setUserDetails((prev) => ({
        ...prev,
        concern: userText,
      }));
    }

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();

      setMessages([
        ...updatedMessages,
        {
          sender: "aura",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages([
        ...updatedMessages,
        {
          sender: "aura",
          text:
            "I'm having a little trouble connecting right now. Please try again in a moment. 💗",
        },
      ]);
    }
  };

  // =========================
  // SUBMIT REQUEST
  // =========================

  const submitRequest = async () => {
    if (
      !userDetails.concern ||
      !userDetails.name ||
      !userDetails.age ||
      !userDetails.email ||
      !userDetails.location
    ) {
      setSubmitMessage("Please fill in all the details before submitting. 💗");
      return;
    }

    setSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch(
        "http://localhost:3001/submit-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetails),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitMessage(
        "Your request has been submitted successfully! 💗 AURA has been notified."
      );

      setShowRequestForm(false);
    } catch (error) {
      console.error("Submit error:", error);

      setSubmitMessage(
        "I couldn't submit your request. Please make sure the AURA server is running and try again. 💗"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // STORY CONTROLS
  // =========================

  const nextStory = () => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1);
    }
  };

  const previousStory = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
    }
  };

  return (
    <div
      className="app"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="overlay">

        {/* NAVBAR */}

        <nav className="navbar">

          <div className="logo">
            AURA
          </div>

          <div className="nav-links">

            <button onClick={() => setStoryOpen(true)}>
              Her Story
            </button>

            <button onClick={() => setChatOpen(true)}>
              Talk to AURA
            </button>

          </div>

        </nav>

        {/* HERO */}

        <main className="hero-section">

          <div className="hero-text">

            <p className="eyebrow">
              YOUR GUIDE. YOUR LISTENER. YOUR AURA.
            </p>

            <h1>
              Every girl deserves
              <span> someone who understands.</span>
            </h1>

            <p className="description">
              Meet AURA, a superhero created to help girls and women
              understand their bodies, emotions and everyday wellbeing.
            </p>

            <div className="buttons">

              <button
                className="primary-btn"
                onClick={() => setStoryOpen(true)}
              >
                Discover Her Story
              </button>

              <button
                className="secondary-btn"
                onClick={() => setChatOpen(true)}
              >
                Talk to AURA →
              </button>

            </div>

          </div>

          {/* CHARACTER */}

          <div className="hero-character">

            <div className="character-glow"></div>

            <img
              src={aura}
              alt="AURA superhero"
            />

            <div className="character-card">

              <span>✦</span>

              <div>

                <strong>AURA</strong>

                <small>
                  Your body. Your story. Your strength.
                </small>

              </div>

            </div>

          </div>

        </main>

        <div className="scroll-hint">
          ↓ Explore AURA's world
        </div>

      </div>

      {/* =========================
          CHATBOT
      ========================= */}

      {chatOpen && (

        <div className="chat-modal">

          <div className="chat-box">

            <button
              className="close-btn"
              onClick={() => setChatOpen(false)}
            >
              ×
            </button>

            <div className="chat-header">

              <div className="chat-avatar">
                A
              </div>

              <div>

                <h2>
                  Talk to AURA
                </h2>

                <p>
                  Your guide. Your listener.
                </p>

              </div>

            </div>

            {/* MESSAGES */}

            <div className="messages">

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={`message ${message.sender}`}
                >
                  {message.text}
                </div>

              ))}

            </div>

            {/* INPUT */}

            <div className="chat-input-area">

              <input
                type="text"
                placeholder="Tell AURA what's on your mind..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    sendMessage();
                  }

                }}
              />

              <button onClick={sendMessage}>
                Send
              </button>

            </div>

            {/* SUBMIT REQUEST BUTTON */}

            {userDetails.concern && (

              <button
                className="submit-request"
                onClick={() => {
                  setShowRequestForm(true);
                  setSubmitMessage("");
                }}
              >
                Submit My Request 💗
              </button>

            )}

            {/* SUCCESS / ERROR MESSAGE */}

            {submitMessage && (

              <p className="submit-message">
                {submitMessage}
              </p>

            )}

          </div>

        </div>

      )}

      {/* =========================
          REQUEST FORM
      ========================= */}

      {showRequestForm && (

        <div className="story-modal">

          <div className="story-box request-box">

            <button
              className="close-btn"
              onClick={() => setShowRequestForm(false)}
            >
              ×
            </button>

            <p className="story-label">
              AURA SUPPORT REQUEST
            </p>

            <h2>
              Tell us a little about you
            </h2>

            <p className="request-description">
              Your information will be included in the notification
              sent to AURA.
            </p>

            {/* NAME */}

            <input
              className="request-input"
              type="text"
              placeholder="Your name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  name: e.target.value,
                })
              }
            />

            {/* AGE */}

            <input
              className="request-input"
              type="number"
              placeholder="Your age"
              min="1"
              max="120"
              value={userDetails.age}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  age: e.target.value,
                })
              }
            />

            {/* EMAIL */}

            <input
              className="request-input"
              type="email"
              placeholder="Your email address"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  email: e.target.value,
                })
              }
            />

            {/* LOCATION */}

            <input
              className="request-input"
              type="text"
              placeholder="City / Location"
              value={userDetails.location}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  location: e.target.value,
                })
              }
            />

            {/* CONCERN */}

            <textarea
              className="request-input request-textarea"
              placeholder="Your grievance or request"
              value={userDetails.concern}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  concern: e.target.value,
                })
              }
            />

            {/* SUBMIT */}

            <button
              className="submit-request"
              onClick={submitRequest}
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Request 💗"}
            </button>

            {submitMessage && (

              <p className="submit-message">
                {submitMessage}
              </p>

            )}

          </div>

        </div>

      )}

      {/* =========================
          STORY
      ========================= */}

      {storyOpen && (

        <div className="story-modal">

          <div className="story-box">

            <button
              className="close-btn"
              onClick={() => setStoryOpen(false)}
            >
              ×
            </button>

            <p className="story-label">
              THE STORY OF AURA
            </p>

            <h2>
              Everyone has a beginning.
            </h2>
            <p className="story-text">
  {stories[storyIndex].text}
</p>

            <img
              src={stories[storyIndex].image}
              alt={`AURA story ${storyIndex + 1}`}
              className="story-image"
            />

            <div className="story-controls">

              <button
                onClick={previousStory}
                disabled={storyIndex === 0}
              >
                ← Previous
              </button>

              <span>
                {storyIndex + 1} / {stories.length}
              </span>

              <button
                onClick={nextStory}
                disabled={storyIndex === stories.length - 1}
              >
                Next →
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;