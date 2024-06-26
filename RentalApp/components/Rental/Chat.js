import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import ChatStyle from "../../styles/ChatStyle"; // Ensure you have ChatStyle.js in your styles directory
import db from "../../configs/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  getDocs, // Import getDocs for querying existing conversations
} from "firebase/firestore";
import { MyUserContext } from "../../configs/Contexts";
import { ColorAssets } from "../../assets/ColorAssets";

const Chat = ({ route, navigation }) => {
  const { friendDetails } = route.params;
  const [conversationId, setConversationId] = useState(
    route.params.conversationId
  );
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);
  const user = useContext(MyUserContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: friendDetails.image }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
          />
          <Text
            style={{
              color: ColorAssets.header.icon,
              marginRight: 5,
              fontFamily: "Roboto",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {friendDetails.username}
          </Text>
        </View>
      ),
    });
  }, [navigation, friendDetails]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) {
        console.log("No conversationId, checking for existing conversations");

        const participants = [user.id, friendDetails.id];

        const q = query(
          collection(db, "conversations"),
          where("participantIds", "array-contains-any", participants)
        );

        const querySnapshot = await getDocs(q);
        let existingConversationId = null;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (
            data.participantIds.includes(friendDetails.id) &&
            data.participantIds.includes(user.id)
          ) {
            existingConversationId = doc.id;
          }
        });

        if (existingConversationId) {
          setConversationId(existingConversationId);
          console.log(
            "Found existing conversation with id:",
            existingConversationId
          );
        } else {
          console.log("No existing conversation found, creating a new one");
          // await createNewConversation();
        }
      }
    };

    fetchConversation();

    if (conversationId) {
      console.log(
        "Setting up snapshot listener for conversationId:",
        conversationId
      );

      const q = query(
        collection(db, "messages"),
        where("conversationId", "==", conversationId),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log("Received new snapshot for messages");
        const msgs = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Message data:", data);
          let createdAt = "";
          if (data.createdAt) {
            try {
              createdAt = data.createdAt.toDate().toLocaleTimeString();
            } catch (error) {
              console.error(
                "Error converting timestamp:",
                error,
                "for document:",
                doc.id
              );
            }
          }
          return {
            id: doc.id,
            ...data,
            time: createdAt,
          };
        });
        console.log("Messages:", msgs);
        setMessages(msgs);

        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
      });

      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        updateScrollView
      );

      return () => {
        console.log(
          "Cleaning up snapshot listener for conversationId:",
          conversationId
        );
        unsubscribe();
        keyboardDidShowListener.remove();
      };
    }
  }, [conversationId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      let currentConversationId = conversationId;

      // Check if there is no current conversation ID, then create a new conversation
      if (!currentConversationId) {
        try {
          const newConversation = {
            createdAt: serverTimestamp(),
            lastMessageId: "",
            participantIds: [user.id, friendDetails.id],
          };

          const conversationRef = await addDoc(
            collection(db, "conversations"),
            newConversation
          );
          currentConversationId = conversationRef.id;
          setConversationId(currentConversationId);
          console.log(
            "Created new conversation with id:",
            currentConversationId
          );
        } catch (error) {
          console.error("Error creating conversation: ", error);
          return;
        }
      }

      // Now send the message
      const newMessageObj = {
        conversationId: currentConversationId,
        content: newMessage,
        userId: user.id,
        createdAt: serverTimestamp(),
      };

      try {
        console.log("Sending message:", newMessageObj);
        const messageRef = await addDoc(
          collection(db, "messages"),
          newMessageObj
        );
        setNewMessage("");

        // Update lastMessageId in the conversation
        const conversationRef = doc(db, "conversations", currentConversationId);
        await updateDoc(conversationRef, {
          lastMessageId: messageRef.id,
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
      <View
        style={[
          ChatStyle.messageItem,
          isMe ? ChatStyle.sentMessage : ChatStyle.receivedMessage,
        ]}
      >
        <Text style={[ChatStyle.text, isMe && { color: "#fff" }]}>
          {item.content}
        </Text>
        <Text style={[ChatStyle.time, isMe && { color: "#fff" }]}>
          {item.time}
        </Text>
      </View>
    );
  };

  const updateScrollView = () => {
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  return (
    <View style={ChatStyle.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={ChatStyle.messageList}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({ animated: true })
        }
      />

      <View style={ChatStyle.inputContainer}>
        <TextInput
          style={ChatStyle.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity onPress={handleSend} style={ChatStyle.sendButton}>
          <Text style={ChatStyle.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Chat;
