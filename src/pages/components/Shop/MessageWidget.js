import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faTimes } from "@fortawesome/free-solid-svg-icons";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulated auth state
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isAuthenticated) {
      if (!form.name.trim()) {
        newErrors.name = "Name is required";
      } else if (!nameRegex.test(form.name)) {
        newErrors.name = "Invalid name (letters & spaces only)";
      }

      if (!form.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!emailRegex.test(form.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (!form.message.trim()) {
      newErrors.message = "Message cannot be empty";
    } else if (form.message.length < 5) {
      newErrors.message = "Message must be at least 5 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const sendMessage = () => {
    if (!validateForm()) return;

    const payload = isAuthenticated ? { message: form.message } : form;

    console.log("Sending message:", payload);
    alert("Message sent!");

    setForm({ name: "", email: "", message: "" });
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        className={`flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-300 transform ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
        onClick={() => setIsOpen((prev)=>!prev)}
      >
        <span className={`transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}>
          <FontAwesomeIcon icon={faComments} size="lg" />
        </span>
        <span className={`absolute transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </span>
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-white p-4 shadow-xl rounded-lg border">
          <h2 className="text-lg font-semibold">Chat with Admin</h2>

          {!isAuthenticated && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </>
          )}

          <textarea
            name="message"
            placeholder="Type your message..."
            value={form.message}
            onChange={handleChange}
            className="w-full p-2 mt-2 text-black border rounded h-20"
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}

          <button
            onClick={sendMessage}
            className="w-full mt-3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
