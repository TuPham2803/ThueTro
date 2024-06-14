import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Button, IconButton } from "react-native-paper";
import db from "../../configs/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { MyUserContext } from "../../configs/Contexts";
import APIs, { endpoints } from "../../configs/APIs";
import ConversationStyle from "../../styles/ConverstionStyle";
import moment from "moment";
import MyStyle from "../../styles/MyStyle";

const handleGetUser = async (user_id) => {
  try {
    const res = await APIs.get(`${endpoints["user"]}?id=${user_id}`);
    return res.data.results ? res.data.results[0] : {};
  } catch (error) {
    console.error("Error fetching user details:", error);
    return {};
  }
};

const Conversation = ({ navigation }) => {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_CONVERSATIONS":
          return { ...state, conversations: action.payload, loading: false };
        default:
          return state;
      }
    },
    { conversations: [], loading: true }
  );

  const user = useContext(MyUserContext);

  const fetchData = useCallback(async () => {
    try {
      const q = query(
        collection(db, "conversations"),
        where("participantIds", "array-contains", user.id)
      );
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const convs = await Promise.all(
          querySnapshot.docs.map(async (conversation) => {
            const data = conversation.data();
            let lastMessage = {};
            let friendDetails = {};

            if (data.lastMessageId) {
              try {
                const lastMessageDocRef = doc(
                  db,
                  "messages",
                  data.lastMessageId
                );
                const lastMessageDoc = await getDoc(lastMessageDocRef);
                if (lastMessageDoc.exists()) {
                  lastMessage = lastMessageDoc.data();
                }
              } catch (error) {
                console.error("Error fetching last message:", error);
              }
            }

            const friendId = data.participantIds.find((id) => id !== user.id);
            if (friendId) {
              try {
                friendDetails = await handleGetUser(friendId);
              } catch (error) {
                console.error("Error fetching friend details:", error);
              }
            }

            return {
              id: conversation.id,
              friendId,
              friendDetails,
              lastMessage,
            };
          })
        );

        dispatch({ type: "SET_CONVERSATIONS", payload: convs });
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={ConversationStyle.conversationItem}
      onPress={() =>
        navigation.navigate("Chat", {
          conversationId: item.id,
          friendDetails: item.friendDetails,
        })
      }
    >
      <Image
        source={{ uri: item.friendDetails.image }}
        style={ConversationStyle.avatar}
        resizeMode="cover"
      />
      <View style={ConversationStyle.textContainer}>
        <Text style={ConversationStyle.name}>
          {item.friendDetails.username || "Unknown"}
        </Text>
        <Text style={ConversationStyle.message}>
          {item.lastMessage ? item.lastMessage.content : ""}
        </Text>
        <Text style={ConversationStyle.time}>
          {item.lastMessage && item.lastMessage.createdAt
            ? moment(item.lastMessage.createdAt.toDate()).fromNow()
            : ""}
        </Text>
      </View>
      <IconButton
        icon="chevron-right"
        size={24}
        onPress={() =>
          navigation.navigate("Chat", {
            conversationId: item.id,
            friendId: item.friendId,
          })
        }
      />
    </TouchableOpacity>
  );
  

  if (state.loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={ConversationStyle.container}>
      <FlatList
        data={state.conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {/* <Button
        icon="plus"
        mode="contained"
        onPress={() =>
          navigation.navigate("Chat", {
            conversationId: null,
            friendDetails: { username: "newUser", id: 8 },
          })
        }
        style={MyStyle.button}
      >
        New Conversation
      </Button> */}
    </View>
  );
};

export default Conversation;
