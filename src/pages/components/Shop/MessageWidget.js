import { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faPaperPlane, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios"; // For calling your backend API route

// Message Bubble Component
const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 shadow-md ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        }`}
      >
        {/* Basic Markdown support (newlines) */}
        {message.text.split('\n').map((line, index) => (
             <span key={index}>{line}<br/></span>
        ))}
      </div>
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex justify-start mb-3">
    <div className="bg-gray-200 text-gray-500 rounded-lg px-3 py-2 shadow-md rounded-bl-none inline-flex items-center">
      <FontAwesomeIcon icon={faSpinner} spin size="sm" className="mr-2" />
      Writing...
    </div>
  </div>
);


const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    // Initial welcome message from the AI
    { role: 'model', text: "Hello! How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null); // Ref for scrolling

  // Function to scroll to the bottom of the chat
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll to bottom when messages change or widget opens/closes
  useEffect(() => {
    if(isOpen) {
        // Timeout allows layout to settle before scrolling
        setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, scrollToBottom]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e) => {
     // Allow form submission via Enter key as well
    if (e) e.preventDefault();
    const trimmedInput = inputValue.trim();

    if (!trimmedInput || isLoading) return;

    const newUserMessage = { role: "user", text: trimmedInput };
    // Optimistically add user message
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    // Prepare history for the backend (send recent messages for context)
    // Adjust the number of messages sent based on your needs/token limits
    const historyToSend = messages.slice(-6); // Send last 6 messages (adjust as needed)

    try {
       // --- Call your backend API endpoint ---
      const response = await axios.post("/api/chat", {
        message: trimmedInput,
        history: historyToSend // Send recent history
      });
      // --- ----------------------------- ---

      if (response.data && response.data.reply) {
        const aiResponse = { role: "model", text: response.data.reply };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      const errorMessage = err.response?.data?.error || "Failed to get response. Please try again.";
      setError(errorMessage);
      // Optionally add an error message to the chat UI
      setMessages((prevMessages) => [...prevMessages, { role: 'model', text: `Sorry, an error occurred: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
       // Ensure scroll after potential loading state changes
      setTimeout(scrollToBottom, 100);
    }
  };

   // Handle Enter key press in textarea (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default newline behavior
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col items-end">
       {/* Chat Popup Window */}
       <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-sm h-[65vh] max-h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-3" // Added max-w, height, mb
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm flex-shrink-0">
              <h3 className="font-semibold text-lg">Support Chat</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-white hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            {/* Message List */}
            <div className="flex-grow p-3 overflow-y-auto bg-gray-50">
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}
              {/* Invisible div to target for scrolling */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white flex items-center gap-2 flex-shrink-0">
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} // Handle Enter key
                placeholder="Type your message..."
                className="flex-grow p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                rows={1} // Start with 1 row, auto-expands slightly with text
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="flex-shrink-0 p-2 w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                {isLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                    <FontAwesomeIcon icon={faPaperPlane} />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:opacity-90 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isOpen ? "rotate-[360deg]" : "" // Rotate only when opening maybe?
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
         {/* Using AnimatePresence for cross-fade effect */}
         <AnimatePresence initial={false}>
            <motion.span
              key={isOpen ? 'times' : 'comments'}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="absolute" // Position icons absolutely for cross-fade
            >
              <FontAwesomeIcon icon={isOpen ? faTimes : faCommentDots} size="xl" />
            </motion.span>
          </AnimatePresence>
      </button>

    </div>
  );
};

export default ChatWidget;