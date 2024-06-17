import { StyleSheet } from 'react-native';
import { ColorAssets } from '../assets/ColorAssets';
const ChatStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messageList: {
        flex: 1,
    },
    messageItem: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 5,
        minWidth: 70,
    },
    sentMessage: {
        backgroundColor: '#69C0B5',
        alignSelf: 'flex-end',
      
    },
    receivedMessage: {
        backgroundColor: '#ECECEC',
        alignSelf: 'flex-start',
    },
    sender: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    text: {
        fontSize: 16,
    },
    time: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: ColorAssets.button.background,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sendButtonText: {
        color:  ColorAssets.button.text,
        fontWeight: 'bold',
    },
});

export default ChatStyle;
