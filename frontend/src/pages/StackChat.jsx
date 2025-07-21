import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function StackChat() {
  const { stackId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      const res = await fetch(`http://localhost:8000/run-workflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, stack_id: stackId }) // pass stack_id
      });

      const data = await res.json();
      const botResponse = {
        sender: 'bot',
        text: data.llm_response || 'No response received.'
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Error occurred.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-xl w-[700px] h-[500px] flex flex-col">
        <div className="p-4 border-b text-lg font-semibold text-gray-800">GenAI Stack Chat</div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md w-fit ${
                msg.sender === 'user'
                  ? 'ml-auto bg-blue-100'
                  : 'mr-auto bg-gray-100'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="text-sm text-gray-400">Thinking...</div>}
        </div>

        <div className="p-3 border-t flex items-center gap-2">
          <input
            className="flex-1 border px-3 py-2 rounded text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Send a message"
          />
          <button
            className="bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
