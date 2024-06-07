import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import ChatStyle from "../../styles/ChatStyle"; // Ensure you have ChatStyle.js in your styles directory
import db from "../../configs/firebase";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { MyUserContext } from "../../configs/Contexts";

const Chat = ({ route }) => {
  const { conversationId, friendId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const user = useContext(MyUserContext);

  useEffect(() => {
    console.log("Setting up snapshot listener for conversationId:", conversationId);

    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", conversationId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Received new snapshot for messages");
      const msgs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt ? doc.data().createdAt.toDate().toLocaleTimeString() : ''
      }));
      console.log("Messages:", msgs);
      setMessages(msgs);

      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    });

    return () => {
      console.log("Cleaning up snapshot listener for conversationId:", conversationId);
      unsubscribe();
    };
  }, [conversationId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      const newMessageObj = {
        conversationId,
        content: newMessage,
        userId: user.id,
        createdAt: serverTimestamp(),
      };

      try {
        console.log("Sending message:", newMessageObj);
        const messageRef = await addDoc(collection(db, "messages"), newMessageObj);
        setNewMessage('');
        
        // Update lastMessageId in the conversation
        const conversationRef = doc(db, "conversations", conversationId);
        await updateDoc(conversationRef, {
          lastMessageId: messageRef.id
        });
        console.log("Updated lastMessageId in conversation");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.userId === user.id;
    return (
      <View style={[ChatStyle.messageItem, isMe ? ChatStyle.sentMessage : ChatStyle.receivedMessage]}>
        <Text style={ChatStyle.sender}>{isMe ? "Me" : friendId}</Text>
        <Text style={ChatStyle.text}>{item.content}</Text>
        <Text style={ChatStyle.time}>{item.time}</Text>
      </View>
    );
  };

  return (
    <View style={ChatStyle.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={ChatStyle.messageList}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
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
