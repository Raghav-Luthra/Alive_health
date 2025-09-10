import React, { useState } from 'react';
import { MessageCircle, Send, Stethoscope, AlertCircle } from 'lucide-react';
import { model } from '../config/gemini';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AiDoctor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI health assistant. I can help answer general health questions and provide wellness guidance. Please remember that I cannot replace professional medical advice. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const prompt = `You are a helpful AI health assistant. The user has asked: "${currentMessage}"
      
      Please provide helpful, accurate health information while being clear that:
      1. You cannot replace professional medical advice
      2. For serious symptoms or concerns, they should consult a healthcare provider
      3. You can provide general wellness guidance and health education
      
      Keep your response conversational, helpful, and under 200 words. Focus on being supportive while maintaining appropriate medical disclaimers.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponseText = response.text();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment. For urgent health concerns, please contact a healthcare professional directly.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">AI Health Assistant</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Get instant health guidance from our AI assistant. Ask questions about symptoms, 
          wellness tips, or general health information.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Disclaimer */}
        <div className="bg-gradient-to-r from-orange-900/20 via-orange-800/20 to-orange-900/20 border border-orange-700/30 rounded-lg p-4 mb-6 flex items-start space-x-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-orange-400 font-medium text-sm">Important Disclaimer</p>
            <p className="text-gray-300 text-sm">
              This AI assistant provides general health information only and should not replace professional medical advice. 
              Always consult with qualified healthcare providers for diagnosis and treatment.
            </p>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/50 flex flex-col h-[600px] shadow-xl shadow-black/20">
          {/* Chat Header */}
          <div className="flex items-center p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="text-white font-medium">Dr. AI Assistant</h3>
              <p className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent text-sm font-medium">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/25'
                      : 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 shadow-lg'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-green-100' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 p-3 rounded-lg shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
            <div className="flex space-x-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your health question here..."
                className="flex-1 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 resize-none transition-all duration-200"
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg shadow-green-600/25"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mt-6">
          <h4 className="text-lg font-medium text-white mb-3">Common Questions</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "What are the symptoms of dehydration?",
              "How much sleep do I need?",
              "What's a healthy heart rate?",
              "How can I boost my immune system?"
            ].map((question) => (
              <button
                key={question}
                onClick={() => setInputMessage(question)}
                className="text-left p-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-200 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 inline mr-2 text-green-400" />
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiDoctor;