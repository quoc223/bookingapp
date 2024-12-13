import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    IconButton,
} from "@material-tailwind/react";
import { ChevronUpIcon, PaperAirplaneIcon } from    "@heroicons/react/24/outline";

const PatientChatWidget = ({ patientId }) => {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const apiUrl = import.meta.env.VITE_DOMAINNAME;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        try {
            const newSocket = io(apiUrl);
            setSocket(newSocket);
            initializeChat();

            return () => newSocket.disconnect();
        } catch (error) {
            setError('Failed to establish connection');
            console.error('Socket initialization error:', error);
        }
    }, [patientId]);

    useEffect(() => {
        if (socket && chat) {
            socket.emit('join chat', chat._id);

            socket.on('new message', (data) => {
                if (data.chatId === chat._id) {
                    setMessages(prev => [...prev, data.message]);
                }
            });

            socket.on('connect_error', (error) => {
                setError('Connection error occurred');
                console.error('Socket connection error:', error);
            });
        }
    }, [socket, chat]);

    const initializeChat = async () => {
        try {
            const response = await axios.post(`${apiUrl}api/chat/initialize`, {
                patientId
            });
            setChat(response.data);
            setMessages(response.data.messages);
            setError('');
        } catch (error) {
            setError('Failed to load chat history');
            console.error('Error initializing chat:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !chat) return;

        try {
            const newMsg = {
                content: newMessage,
                sender: 'patient',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, newMsg]);

            await axios.post(`${apiUrl}api/chat/message`, {
                chatId: chat._id,
                content: newMessage,
                sender: 'patient',
                senderId: patientId
            });

            setNewMessage('');
            setError('');
        } catch (error) {
            setMessages(prev => prev.slice(0, -1));
            setError('Failed to send message');
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Card
                className={`w-80 shadow-xl transition-all duration-300 ${
                    isChatOpen ? 'h-96' : 'h-auto'
                }`}
            >
                <CardHeader
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="bg-blue-500 cursor-pointer"
                    floated={false}
                >
                    <div className="flex items-center justify-between p-4">
                        <Typography variant="h6" color="white">
                            Chat Với Bác Sĩ
                        </Typography>
                        <ChevronUpIcon
                            className={`h-5 w-5 text-white transform transition-transform duration-300 ${
                                isChatOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </div>
                </CardHeader>

                {isChatOpen && (
                    <>
                        <CardBody className="h-64 overflow-y-auto p-4">
                            {error && (
                                <div className="mb-4 p-2 bg-red-50 text-red-500 rounded">
                                    {error}
                                </div>
                            )}
                            {messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`mb-2 max-w-[70%] ${
                                            msg.sender === 'patient'
                                                ? 'ml-auto'
                                                : ''
                                        }`}
                                    >
                                        <div
                                            className={`p-3 rounded-lg ${
                                                msg.sender === 'patient'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100'
                                            }`}
                                        >
                                            <Typography color={msg.sender === 'patient' ? 'white' : 'gray'}>
                                                {msg.content}
                                            </Typography>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="text-center"
                                >
                                    Chưa có tin nhắn
                                </Typography>
                            )}
                            <div ref={messagesEndRef} />
                        </CardBody>

                        <CardFooter className="p-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Nhập câu hỏi của bạn..."
                                    className="min-w-0"
                                    containerProps={{
                                        className: "min-w-0"
                                    }}
                                />
                                <IconButton
                                    variant="filled"
                                    color="blue"
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim()}
                                >
                                    <PaperAirplaneIcon className="h-4 w-4" />
                                </IconButton>
                            </div>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
};

export default PatientChatWidget;
