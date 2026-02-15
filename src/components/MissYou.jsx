import React, { useState } from 'react';

const MissYou = () => {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  // Hardcoded credentials as requested
  const BOT_TOKEN = '8273528353:AAGOQJGIaNt2bK32YWXfwKzlX8K9PX41ykY';
  const CHAT_ID = '456109422';

  const handleMissYou = async () => {
    setSending(true);
    // Use a heartwarming message
    const heartWarmingMessage = "Bujji I'm missing you ra";
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: heartWarmingMessage,
        }),
      });
      
      const data = await response.json();
      
      if (data.ok) {
        setMessage('Message sent! 💌');
      } else {
        console.error('Telegram API Error:', data);
        setMessage(`Failed: ${data.description || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      setMessage('Error sending message. Check console.');
    }
    
    setSending(false);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-pink-100 transform hover:scale-[1.02] transition-transform duration-300">
      <h3 className="text-xl font-bold text-gray-400 mb-4 flex items-center justify-between">
         <span className="flex items-center gap-2">💌 Send Love</span>
      </h3>
      
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
