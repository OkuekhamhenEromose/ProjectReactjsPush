import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Send, Users } from 'lucide-react';


const ChatApp = ({ onBackToHome }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hey everyone! Welcome to the chat 👋', user: 'Alice', timestamp: new Date(Date.now() - 300000), isOwn: false },
    { id: 2, text: 'Hi Alice! Thanks for having us here', user: 'Bob', timestamp: new Date(Date.now() - 240000), isOwn: false },
    { id: 3, text: 'Hello! Excited to be here!', user: 'You', timestamp: new Date(Date.now() - 180000), isOwn: true },
    { id: 4, text: 'This chat app looks amazing!', user: 'Charlie', timestamp: new Date(Date.now() - 120000), isOwn: false },
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [users, setUsers] = useState([
    { id: 1, name: 'You', status: 'online', avatar: '👤' },
    { id: 2, name: 'Alice', status: 'online', avatar: '👩' },
    { id: 3, name: 'Bob', status: 'online', avatar: '👨' },
    { id: 4, name: 'Charlie', status: 'away', avatar: '🧑' },
    { id: 5, name: 'Diana', status: 'offline', avatar: '👩‍💼' },
  ]);
  
  const [showUsers, setShowUsers] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated WebSocket connection - in real app, connect to ws://localhost:8080
  const sendMessage = () => {
    if (currentMessage.trim()) {
      const message = {
        id: Date.now(),
        text: currentMessage,
        user: 'You',
        timestamp: new Date(),
        isOwn: true
      };
      
      setMessages(prev => [...prev, message]);
      setCurrentMessage('');
      
      // Simulate bot response after 2 seconds
      setTimeout(() => {
        const botResponses = [
          'That\'s interesting! Tell me more.',
          'I agree! 😊',
          'Great point!',
          'Thanks for sharing!',
          'Nice! What do you think about that?',
          'Absolutely! 👍',
        ];
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        const botMessage = {
          id: Date.now() + 1,
          text: randomResponse,
          user: users[Math.floor(Math.random() * (users.length - 1)) + 1].name,
          timestamp: new Date(),
          isOwn: false
        };
        setMessages(prev => [...prev, botMessage]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToHome}
              className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Projects</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                💬 ChatHub
              </h1>
              <p className="text-xs text-gray-500">{users.filter(u => u.status === 'online').length} online</p>
            </div>
          </div>
          <button
            onClick={() => setShowUsers(!showUsers)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
          >
            <Users className="w-5 h-5" />
            <span className="hidden sm:inline">Users</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white m-4 rounded-lg shadow-lg overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-md ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!message.isOwn && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {message.user[0]}
                    </div>
                  )}
                  <div>
                    {!message.isOwn && (
                      <p className="text-xs font-semibold text-gray-600 mb-1 px-3">
                        {message.user}
                      </p>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.isOwn
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className={`text-xs text-gray-400 mt-1 px-3 ${message.isOwn ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={sendMessage}
                disabled={!currentMessage.trim()}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Sidebar - Desktop */}
        <div className={`${showUsers ? 'block' : 'hidden'} lg:block w-64 bg-white m-4 ml-0 rounded-lg shadow-lg overflow-hidden`}>
          <div className="p-4 border-b border-gray-200 bg-indigo-50">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users ({users.length})
            </h2>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xl">
                    {user.avatar}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Users Modal */}
      {showUsers && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end">
          <div className="bg-white w-64 h-full overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="font-bold text-gray-800">Users ({users.length})</h2>
              <button onClick={() => setShowUsers(false)} className="p-2 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xl">
                      {user.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatApp;