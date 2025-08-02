import React, { useState, useRef, useEffect, forwardRef } from 'react';
import {
  ChatBubbleBottomCenterTextIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/solid';

// --- Re-implementing missing UI components for a self-contained solution ---
// Note: This is a basic implementation to make the code runnable in an environment without shadcn/ui.
// For a production app, you should use a proper UI library.

const Card = ({ className, children }) => (
  <div className={`rounded-lg bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ className, children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Button = ({ className, children, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));


// Custom CSS for scrollbar and animation
const customStyles = `
  /* Custom scrollbar for the chat area */
  .chat-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .chat-scroll::-webkit-scrollbar-track {
    background: #e2e8f0; /* bg-slate-200 */
    border-radius: 10px;
  }
  .chat-scroll::-webkit-scrollbar-thumb {
    background: #cbd5e1; /* bg-slate-300 */
    border-radius: 10px;
  }
  .chat-scroll::-webkit-scrollbar-thumb:hover {
    background: #94a3b8; /* bg-slate-400 */
  }

  /* Chat message entry animation */
  .chat-message-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  .chat-message-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms ease-out, transform 300ms ease-out;
  }

  /* Bot loading animation */
  .dot-pulse > div {
    animation: dot-pulse-anim 1s infinite;
    animation-delay: calc(0.1s * var(--delay));
  }
  .dot-pulse > div:nth-child(2) { animation-delay: 0.2s; }
  .dot-pulse > div:nth-child(3) { animation-delay: 0.4s; }
  
  @keyframes dot-pulse-anim {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0px); }
  }
`;

const Chatbot = () => {
  // --- State management for the chatbot ---
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am the Waste Chatbot. I can help you with your queries about waste management. What would you like to know?' },
  ]);
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Scroll to the bottom of the chat on new message ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Function to call the LLM API and get a response ---
  const fetchLLMResponse = async (prompt) => {
    setIsLoading(true);
    let retryCount = 0;
    const maxRetries = 5;
    const initialDelay = 1000; // 1 second

    while (retryCount < maxRetries) {
      try {
        const chatHistory = messages.map(msg => ({ role: msg.role === 'bot' ? 'model' : 'user', parts: [{ text: msg.text }] }));
        chatHistory.push({ role: 'user', parts: [{ text: prompt }] });
        
        const payload = {
          contents: chatHistory,
        };
        
        // IMPORTANT: For local development, you MUST provide a valid API key here.
        // const apiKey = "YOUR_API_KEY_HERE";
        const apiKey = "AIzaSyDDwvpid_Dg41jRxz-Hx6S3tP7UJsZkbaA"; // This is for Gemini's environment. Replace with your key locally.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          // Log the specific error to the console for debugging
          console.error(`API call failed with status: ${response.status} ${response.statusText}`);
          if (response.status === 429) {
            const delay = initialDelay * Math.pow(2, retryCount);
            console.warn(`API rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
            await new Promise(res => setTimeout(res, delay));
            retryCount++;
            continue;
          } else if (response.status === 400) {
            // Bad Request, likely due to an issue with the prompt or API key
            const errorData = await response.json();
            return `Error: Bad Request. The API rejected the request. Please check your API key or the prompt content. Details: ${JSON.stringify(errorData)}`;
          } else if (response.status === 401) {
            // Unauthorized, almost certainly due to a missing or invalid API key
            return "Error: Unauthorized. Please provide a valid API key in the code.";
          }
           else {
            // For all other errors, provide a generic but more informative message.
            throw new Error(`API call failed with status: ${response.status} ${response.statusText}`);
          }
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const text = result.candidates[0].content.parts[0].text;
          return text;
        } else {
          return "I'm sorry, I couldn't generate a response. Please try again.";
        }
      } catch (error) {
        console.error('Error fetching LLM response:', error);
        return "I'm sorry, an error occurred while processing your request.";
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
    return "I'm sorry, I'm unable to respond at this time due to multiple retries. Please try again later.";
  };

  // --- Handle user's message submission ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userPrompt.trim()) return;

    const newUserMessage = { role: 'user', text: userPrompt };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setUserPrompt('');

    const botResponseText = await fetchLLMResponse(userPrompt);
    const newBotMessage = { role: 'bot', text: botResponseText };
    setMessages(prevMessages => [...prevMessages, newBotMessage]);
  };

  // --- JSX for the Chatbot UI ---
  return (
    <>
      {/* Inject custom styles into the head */}
      <style>{customStyles}</style>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
        <Card className="w-full max-w-lg mx-auto rounded-3xl shadow-xl border-t-8 border-t-orange-700 overflow-hidden">
          {/* Card Header with Bot Title */}
          <CardHeader className="bg-orange-800 text-white p-5 flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <SparklesIcon className="h-8 w-8 text-yellow-300" />
              <CardTitle className="text-2xl font-bold">Waste Chatbot</CardTitle>
            </div>
          </CardHeader>
          
          {/* Chat Display Area */}
          <CardContent className="flex flex-col h-[60vh] max-h-[600px] p-6 pt-4 bg-slate-50">
            <div className="flex-1 overflow-y-auto chat-scroll space-y-4 pr-2">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-3 chat-message-enter chat-message-enter-active ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'bot' && (
                    <div className="flex-shrink-0 bg-orange-700 text-white rounded-full p-2">
                      <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div 
                    className={`max-w-[75%] p-4 rounded-3xl shadow-md ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full p-2">
                      <UserCircleIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading indicator for bot response */}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start animate-pulse">
                  <div className="flex-shrink-0 bg-orange-700 text-white rounded-full p-2">
                    <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                  </div>
                  <div className="bg-white rounded-3xl rounded-bl-none shadow-md p-4 flex items-center space-x-2">
                    <div className="dot-pulse flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-[bounce_1s_infinite_0s]"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-[bounce_1s_infinite_0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* User Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-100 flex items-center gap-3">
            <Input
              className="flex-1 rounded-full border-gray-300 shadow-inner px-4 py-2 text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              placeholder="Start a conversation about waste management!"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="rounded-full bg-orange-600 hover:bg-orange-700 text-white p-3 h-auto shadow-md"
              disabled={!userPrompt.trim() || isLoading}
            >
              <PaperAirplaneIcon className="h-6 w-6 transform rotate-45 -mt-1 -mr-1" />
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Chatbot;
