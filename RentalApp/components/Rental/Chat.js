import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import ChatStyle from "../../styles/ChatStyle"; // Ensure you have ChatStyle.js in your styles directory

const dummyMessages = {
    '1': [
        { id: '1', text: 'Hey, how are you?', sender: 'John Doe', time: '2:45 PM' },
        { id: '2', text: 'I am good, thanks!', sender: 'Me', time: '2:46 PM' }
    ],
    '2': [
        { id: '1', text: 'Are we still meeting tomorrow?', sender: 'Jane Smith', time: '1:15 PM' },
        { id: '2', text: 'Yes, we are!', sender: 'Me', time: '1:16 PM' }
    ],
    '3': [
        { id: '1', text: 'Great job on the presentation!', sender: 'Bob Johnson', time: '11:30 AM' },
        { id: '2', text: 'Thank you!', sender: 'Me', time: '11:31 AM' },
        { id: '3', text: 'Thank you!', sender: 'Me', time: '11:31 AM' },
        { id: '4', text: 'Thank you!', sender: 'Me', time: '11:31 AM' },
        { id: '5', text: 'Thank you!', sender: 'Me', time: '11:31 AM' },
        { id: '6', text: 'Thank you!', sender: 'Me', time: '11:31 AM' },
        { id: '7', text: 'Thank you!', sender: 'Me', time: '11:31 AM' },
        { id: '8', text: 'Thank you!', sender: 'Me', time: '11:31 AM' },
        { id: '9', text: 'Thank you!', sender: 'Me', time: '11:31 AM' },
    ],
    // Add more dummy messages as needed
};

const Chat = ({ route }) => {
    const { conversationId } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef(null); // Create a reference for the FlatList

    useEffect(() => {
        setMessages(dummyMessages[conversationId] || []);
    }, [conversationId]);

    useEffect(() => {
        setTimeout(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 100); // Delay to ensure messages are rendered before scrolling
    }, [messages]);

    useEffect(() => {
        setTimeout(() => {
            if (flatListRef.current) {
                flatListRef.current.scrollToEnd({ animated: true });
            }
        }, 100); // Delay to ensure messages are rendered before scrolling
    }, []);

    const handleSend = () => {
        if (newMessage.trim()) {
            const newMessageObj = {
                id: (messages.length + 1).toString(),
                text: newMessage,
                sender: 'Me',
                time: new Date().toLocaleTimeString(),
            };
            setMessages([...messages, newMessageObj]);
            setNewMessage('');
        }
    };

    const renderItem = ({ item }) => {
        const isMe = item.sender === 'Me'; // Check if the message is sent by "Me"
        return (
            <View style={[ChatStyle.messageItem, isMe ? ChatStyle.sentMessage : ChatStyle.receivedMessage]}>
                <Text style={ChatStyle.sender}>{item.sender}</Text>
                <Text style={ChatStyle.text}>{item.text}</Text>
                <Text style={ChatStyle.time}>{item.time}</Text>
            </View>
        );
    };

    return (
        <View style={ChatStyle.container}>
            <FlatList
                ref={flatListRef} // Assign the reference to the FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={ChatStyle.messageList}
                contentContainerStyle={{ paddingBottom: 20 }} // Add padding to the bottom of the FlatList
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })} // Scroll to the end when the content size changes
            />
            <View style={ChatStyle.inputContainer}>
                <TextInput
                    style={ChatStyle.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message"
                />
                <TouchableOpacity onPress={handleSend} style={ChatStyle.sendButton}>
                    <Text style={ChatStyle.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Chat;
