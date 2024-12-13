import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { IconButton, Input } from '@material-tailwind/react';
import { ChevronUp, Send } from 'lucide-react';

const ChatWidget = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const apiUrl = import.meta.env.VITE_DOMAINNAME;
    useEffect(() => {
        const url = import.meta.env.VITE_DOMAINNAME;
        const newSocket = io(`${url}`);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to server');
        });

        newSocket.on('chat message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        fetchMessages();

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const fetchMessages = async () => {
        try {

            const response = await axios.get(`${apiUrl}api/chat/getMessages`);
            if (Array.isArray(response.data)) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (newMessage.trim()) {
            try {

                const response = await axios.post(`${apiUrl}api/chat/sendMessage`, { message: newMessage });
                if (response.status === 201) {
                    // Update local messages immediately
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                    setNewMessage('');
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div
            className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl transition-all duration-300 z-50 ${
                isChatOpen ? 'h-96' : 'h-12'
            }`}
        >
            <div
                className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center cursor-pointer"
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                <span className="font-medium">Trợ lý AI</span>
                <ChevronUp
                    className={`transform transition-transform duration-300 ${
                        isChatOpen ? 'rotate-180' : ''
                    }`}
                    size={18}
                />
            </div>
            {isChatOpen && (
                <>
                    <div className="h-72 p-4 overflow-y-auto">
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div key={index} className="bg-blue-50 rounded-lg p-3 mb-2 max-w-[70%]">
                                    {msg}
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-center">No messages</div>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <Input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="flex-grow"
                            />
                            <IconButton
                                color="blue"
                                className="ml-2"
                                onClick={sendMessage}
                            >
                                <Send size={18} />
                            </IconButton>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatWidget;
