import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { IconButton } from "react-native-paper";
import ConversationStyle from "../../styles/ConverstionStyle"

const conversations = [
    {
        id: '1',
        name: 'John Doe',
        message: 'Hey, how are you?',
        time: '2:45 PM',
        avatar: 'https://placekitten.com/200/200'
    },
    {
        id: '2',
        name: 'Jane Smith',
        message: 'Are we still meeting tomorrow?',
        time: '1:15 PM',
        avatar: 'https://placekitten.com/201/201'
    },
    {
        id: '3',
        name: 'Bob Johnson',
        message: 'Great job on the presentation!',
        time: '11:30 AM',
        avatar: 'https://placekitten.com/202/202'
    },
    // Add more dummy conversations as needed
];

const Conversation = ({ navigation }) => {
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={ConversationStyle.conversationItem}
            onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
        >
            <Image source={{ uri: item.avatar }} style={ConversationStyle.avatar} />
            <View style={ConversationStyle.textContainer}>
                <Text style={ConversationStyle.name}>{item.name}</Text>
                <Text style={ConversationStyle.message}>{item.message}</Text>
                <Text style={ConversationStyle.time}>{item.time}</Text>
            </View>
            <IconButton
                icon="chevron-right"
                size={24}
                onPress={() => navigation.navigate('Chat', { conversationId: item.id })}
            />
        </TouchableOpacity>
    );

    return (
        <View style={ConversationStyle.container}>
            <FlatList
                data={conversations}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

export default Conversation;
