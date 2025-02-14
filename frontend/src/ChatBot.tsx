import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  author: string;
  content: string;
}

interface UserData {
  name: string;
  surname: string;
  phone: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUser = JSON.parse(storedUserData);
      setUserData(parsedUser);
    }

    // Inicializar socket com dados do usuário se disponível
    const socket = io('http://localhost:3000', {
      auth: storedUserData ? { user: JSON.parse(storedUserData) } : {},
    });
    
    socketRef.current = socket;

    socket.on('chat message', (msg: string) => {
      setMessages(prev => [...prev, { author: 'Bot', content: msg }]);
    });

    // Se for um novo agendamento confirmado, atualizar userData
    socket.on('appointment confirmed', (appointmentData: any) => {
      if (!userData) {
        const newUserData = {
          name: appointmentData.name,
          surname: appointmentData.surname,
          phone: appointmentData.phone,
        };
        setUserData(newUserData);
        localStorage.setItem('userData', JSON.stringify(newUserData));
      }
    });

    return () => {
      socket.off('chat message');
      socket.off('appointment confirmed');
      socket.disconnect();
    };
  }, []);

  // Scroll para a última mensagem sempre que houver novas mensagens
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;
    
    setMessages(prev => [...prev, { author: 'Você', content: input }]);
    socketRef.current.emit('chat message', input);
    setInput('');
  };

  const handleReset = () => {
    localStorage.removeItem('userData');
    setUserData(null);
    setMessages([]);
    window.location.reload(); // Recarrega a página para reiniciar o chat
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ChatBot da Barbearia</h1>
        {userData && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Novo Agendamento
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="h-[400px] overflow-y-auto p-4 border border-gray-200 rounded-t-lg">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 rounded-lg ${
                msg.author === 'Você'
                  ? 'bg-blue-100 ml-auto max-w-[80%]'
                  : 'bg-gray-100 mr-auto max-w-[80%]'
              }`}
            >
              <strong>{msg.author}: </strong>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;