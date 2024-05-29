//hãy tạo cho tôi một cái button tên là sửa bài đăng
import { View, ScrollView, Text, Image, FlatList, TouchableOpacity } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput, IconButton, Icon, Appbar, Picker, Menu, Provider } from "react-native-paper"; // Import IconButton
import React, { useState } from "react";
import UpdatePostAccommodation from "./UpdatePostAccommodation";

const ListPostAccommodation = ({ navigation }) => {
    return (
        <Button
            mode="contained"
            style={[MyStyle.Button, { backgroundColor: "purple"}]}
            onPress={() => navigation.navigate("UpdatePostAccommodation")}
        >
            Sửa bài đăng
        </Button>
    );
};
export default ListPostAccommodation;


