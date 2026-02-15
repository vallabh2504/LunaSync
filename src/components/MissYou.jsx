import React, { useState, useEffect } from 'react';

const MissYou = () => {
  const [botToken, setBotToken] = useState(() => localStorage.getItem('botToken') || '');
  const [chatId, setChatId] = useState(() => localStorage.getItem('chatId') || '');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    localStorage.setItem('botToken', botToken);
    localStorage.setItem('chatId', chatId);
  }, [botToken, chatId]);

  const handleMissYou = async () => {
    if (!botToken || !chatId) {
      setMessage('⚠️ Please configure Telegram first!');
      setShowConfig(true);
      return;
    }
    setSending(true);
    setMessage('Sending love... ❤️');
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: "I miss you! ❤️ (from LunaSync)",
        }),
      });
      const data = await response.json();
      if (data.ok) {
        setMessage('Message sent! 💌');
      } else {
        setMessage(`Failed: ${data.description}`);
      }
    } catch (error) {
      setMessage('Error sending message.');
    }
    setSending(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100 transform hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-xl font-bold text-gray-400 mb-4 flex items-center justify-between">
         <span className="flex items-center gap-2">💌 Send Love</span>
         <button onClick={() => setShowConfig(!showConfig)} className="text-gray-300 hover:text-gray-500">
           ⚙️
         </button>
      </h3>
      
      {showConfig && (
        <div className="mb-4 space-y-2 animate-fadeIn">
          <input 
            type="text" 
            placeholder="Bot Token" 
            value={botToken} 
            onChange={(e) => setBotToken(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-pink-300"
          />
          <input 
            type="text" 
            placeholder="Chat ID" 
            value={chatId} 
            onChange={(e) => setChatId(e.target.value)}
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-pink-300"
          />
        </div>
      )}

      <button 
        onClick={handleMissYou}
        disabled={sending}
        className={`w-full py-3 rounded-xl text-white font-bold text-lg shadow-lg transform transition active:scale-95 duration-200 flex items-center justify-center gap-2
          ${sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 shadow-red-200'}`}
      >
        {sending ? 'Sending...' : 'Miss You ❤️'}
      </button>
      
      {message && (
        <p className="text-center text-sm mt-3 font-medium text-pink-600 animate-pulse bg-pink-50 p-2 rounded-lg">
          {message}
        </p>
      )}
    </div>
  );
};

export default MissYou;
