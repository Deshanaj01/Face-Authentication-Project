import React, { useState, useEffect } from 'react';

// Assuming these components exist in your project
import CameraComponent from './Camera';
import LivenessDetection from './LivenessDetection';

class EnhancedFaceAuthChatbot {
  constructor() {
    this.intents = {
      greeting: ['hello', 'hi', 'hey', 'start'],
      help: ['help', 'support', 'assistance'],
      faceAuth: ['face', 'authentication', 'liveness'],
      startProcess: ['start', 'begin', 'initiate'],
      troubleshoot: ['problem', 'issue', 'not working'],
      modelInfo: ['model', 'size', 'performance'],
      privacy: ['privacy', 'data', 'security'],
      requirements: ['requirements', 'need', 'browser'],
      goodbye: ['bye', 'goodbye', 'exit']
    };
    this.context = {};
  }

  async processInput(input) {
    const lowercaseInput = input.toLowerCase();
    for (const [intent, keywords] of Object.entries(this.intents)) {
      if (keywords.some(keyword => lowercaseInput.includes(keyword))) {
        return await this[intent]();
      }
    }
    return this.unknown();
  }

  async greeting() {
    this.context.greeted = true;
    return "Welcome to the UIDAI Face Authentication Assistant! I can help you with our browser-based face authentication platform. How can I assist you today?";
  }

  async help() {
    return "I can help you with:\n1. Starting the face authentication process\n2. Troubleshooting issues\n3. Information about our liveness detection model\n4. Privacy and security concerns\n5. System requirements\nWhat would you like to know more about?";
  }

  async faceAuth() {
    return "Our face authentication platform uses advanced liveness detection to ensure security. It works directly in your browser on desktop, mobile, or tablet. The process is quick, taking less than 500ms for liveness detection. Would you like to start the authentication process or learn more about how it works?";
  }

  async startProcess() {
    return "Great! To start the face authentication process:\n1. Ensure you're using a supported browser (Chrome, Firefox, or Edge)\n2. Allow camera access when prompted\n3. Position your face within the frame\n4. Follow on-screen instructions for any required actions\n5. Wait for the liveness detection to complete\nAre you ready to begin?";
  }

  async troubleshoot() {
    return "I'm sorry you're experiencing issues. Common problems include:\n1. Poor lighting\n2. Incorrect camera positioning\n3. Outdated browser\n4. Slow internet connection\nCan you describe the specific issue you're facing?";
  }

  async modelInfo() {
    return "Our liveness detection model is cutting-edge:\n- Size: Less than 5MB for quick downloads even on 3G/4G networks\n- Speed: Completes liveness detection within 500ms\n- Framework: Uses ONNX or TensorFlow.js for browser compatibility\n- Modes: Supports both passive and active liveness detection\nDo you have any specific questions about the model?";
  }

  async privacy() {
    return "We take your privacy very seriously. Our face authentication:\n- Processes all data locally in your browser\n- Doesn't store facial images or data\n- Uses encryption for any necessary data transmission\n- Complies with all relevant data protection regulations\nWould you like more details on our privacy measures?";
  }

  async requirements() {
    return "To use our face authentication, you need:\n- A device with a camera (desktop, mobile, or tablet)\n- An up-to-date version of Chrome, Firefox, or Edge browser\n- A stable internet connection (3G or better)\n- Adequate lighting for facial recognition\nIs your system meeting these requirements?";
  }

  async goodbye() {
    this.context = {};
    return "Thank you for using the UIDAI Face Authentication Assistant. If you need any further help, don't hesitate to ask. Goodbye!";
  }

  async unknown() {
    return "I'm not sure I understand. Could you rephrase your question or choose from these options: start authentication, troubleshooting, model information, privacy, or system requirements?";
  }
}

const FaceAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatbot = new EnhancedFaceAuthChatbot();

  useEffect(() => {
    const initChat = async () => {
      const response = await chatbot.greeting();
      setMessages([{ text: response, sender: 'bot' }]);
    };
    initChat();
  }, []);

  const handleStartAuthentication = () => {
    setShowCamera(true);
    setCapturedImage(null);
  };

  const handleCapture = async () => {
    // Assuming CameraComponent has a method to get the current frame
    const image = await CameraComponent.captureFrame();
    setCapturedImage(image);
    addBotMessage("Great! I've captured your image. You can now proceed with authentication.");
  };

  const handleAuthentication = async () => {
    if (!capturedImage) {
      alert('Please capture an image first.');
      return;
    }
    setShowCamera(false);
    const livenessResult = await LivenessDetection(capturedImage);
    if (livenessResult) {
      setIsAuthenticated(true);
      addBotMessage("Congratulations! Your face authentication was successful.");
    } else {
      alert('Liveness detection failed. Please try again.');
      setCapturedImage(null);
      addBotMessage("I'm sorry, but the liveness detection failed. Let's try again. Make sure you're in a well-lit area and looking directly at the camera.");
    }
  };

  const addBotMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, { text: message, sender: 'bot' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    const response = await chatbot.processInput(input);
    setMessages(messages => [...messages, { text: response, sender: 'bot' }]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden flex">
        {/* Left side - Authentication */}
        <div className="w-1/2 p-6">
          <div className="bg-[#F37A20] p-4 flex items-center justify-between rounded-t-lg">
            <h1 className="text-2xl font-bold text-white">Face Authentication</h1>
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-[#F37A20] font-bold">
              A
            </div>
          </div>
          
          <div className="mt-6">
            {!showCamera && !isAuthenticated && (
              <div className="text-center">
                <div className="text-6xl mb-4">👤</div>
                <p className="text-gray-600 mb-4">Click the button below to start face authentication</p>
                <button
                  onClick={handleStartAuthentication}
                  className="w-full bg-[#F37A20] text-white py-2 px-4 rounded-full hover:bg-[#D56A10] transition duration-300 flex items-center justify-center"
                >
                  <span className="mr-2">📷</span>
                  Start Authentication
                </button>
              </div>
            )}
            
            {showCamera && (
              <div className="text-center">
                <CameraComponent />
                <div className="mt-4 flex justify-center space-x-4">
                  <button
                    onClick={handleCapture}
                    className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300"
                  >
                    Capture
                  </button>
                  <button
                    onClick={handleAuthentication}
                    className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-300"
                    disabled={!capturedImage}
                  >
                    Authenticate
                  </button>
                </div>
                {capturedImage && (
                  <p className="mt-2 text-green-600">Image captured! Click "Authenticate" to proceed.</p>
                )}
              </div>
            )}
            
            {isAuthenticated && (
              <div className="text-center mt-4">
                <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                  <p className="text-xl font-semibold">Authentication Successful!</p>
                  <p className="mt-2">You can now proceed with further actions.</p>
                </div>
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setCapturedImage(null);
                    setMessages([]);
                  }}
                  className="bg-[#F37A20] text-white py-2 px-4 rounded-full hover:bg-[#D56A10] transition duration-300"
                >
                  Start Over
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Enhanced Chatbot */}
        <div className="w-1/2 border-l border-gray-200 p-6 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">AI Assistant</h2>
          <div className="flex-grow overflow-y-auto mb-4 space-y-2">
            {messages.map((message, index) => (
              <div key={index} className={`p-2 rounded-lg ${message.sender === 'bot' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="flex-grow border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>© 2024 Aadhaar Authentication. All rights reserved.</p>
      </div>
    </div>
  );
};

export default FaceAuthentication;