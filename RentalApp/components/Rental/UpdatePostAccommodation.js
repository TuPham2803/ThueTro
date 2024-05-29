//hãy tạo cho tôi một cái button tên là sửa bài đăng
import { View, ScrollView, Text, Image, FlatList, TouchableOpacity } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput, IconButton, Icon, Appbar, Picker, Menu, Provider } from "react-native-paper"; // Import IconButton
import React, { useState } from "react";

// Hãy tạo cho tôi một label tên là "Sửa bài đăng"
const UpdatePostAccommodation = ({ navigation }) => {
    return (
        <Button 
            mode="contained"
            onPress={() => console.log("Pressed")}
            style={[MyStyle.button, { backgroundColor: "purple" }, {marginTop:10}]}
          >
            Sửa bài đăng
          </Button>

    );
}
export default UpdatePostAccommodation;