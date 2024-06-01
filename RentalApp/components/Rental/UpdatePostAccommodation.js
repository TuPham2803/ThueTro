import { View, ScrollView, Text, Image, FlatList, TouchableOpacity } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput, IconButton, Icon, Appbar, Picker, Menu, Provider, Snackbar } from "react-native-paper"; // Import IconButton
import React, { useState } from "react";
import * as ImagePicker from 'react-native-image-picker';
import ListPostAccommodation from "./ListPostAccommodation";
import APIs, { endpoints } from "../../configs/APIs";

import axios from "axios";

const UpdatePostAccommodation = ({route, navigation }) => {
    const { post } = route.params;

    const [title, setTitle] = React.useState(post.title)
    const [address, setAddress] = React.useState(post.address);
    const [price, setPrice] = React.useState(post.price);
    const [description, setDescription] = React.useState(post.description);
    const [images, setImages] = React.useState("");
    const [longitude, setLongitude] = React.useState("");
    const [latitude, setLatitude] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [room_type, setRoomType] = React.useState("");
    const [max_people, setMaxPeople] = React.useState("");
    const [current_people, setCurrentPeople] = React.useState("");
    const options = ["Nhà 1", "Nhà 2"];
    const [visible, setVisible] = useState(false);

    // Now you can use the `post` object
    console.log(post);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [postAccommodation, setPostAccommodation] = useState(post);
    const updatePostAccomodations = async () => {
        try {
            let res = await APIs.patch(
                `${endpoints["post_accomodations"]}${post.id}/`,
                postAccommodation
            );
            
            setPosts(res.data);
            console.log("Update Pressed");
            // Gửi dữ liệu cập nhật lên server hoặc thực hiện hành động cập nhật ở đây
            setSnackbarVisible(true); // Show Snackbar on update
            setTimeout(() => {
                navigation.navigate(ListPostAccommodation);
    
            }, 3000); // Thời gian chờ (3 giây) để hiển thị Snackbar trước khi điều hướng
        } catch (ex) {
            console.log(ex.response);
        }
    };

 
    const pickImage = () => {
        ImagePicker.launchImageLibrary(
            { mediaType: 'photo', selectionLimit: 0 }, // Allow multiple images
            (response) => {
                if (response.assets) {
                    setImages(response.assets);
                }
            }
        );
    };




    return (
        <Provider>
            <View style={[MyStyle.container, { marginTop: 20, marginBottom: 30 }]}>

                <ScrollView style={[MyStyle.wrapper, { paddingHorizontal: 20 }]}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="home-account" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Tên bài đăng</Text>
                    </View>

                    <TextInput
                        label="Title"
                        value={title}
                        onChangeText={setTitle}
                        style={[MyStyle.input, { marginBottom: 10 }]} //Thêm marginBottom để tạo khoảng cách dưới
                        
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="map-marker" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Địa chỉ nhà: </Text>
                    </View>
                    <TextInput
                        label="Address"
                        value={postAccommodation.address}
                        onChangeText={setPostAccommodation}
                        style={[MyStyle.input, { marginBottom: 10 }]}
                        
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="currency-usd" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Giá</Text>
                    </View>
                    <TextInput
                        label="Price"
                        value={price}
                        onChangeText={setPrice}
                        style={[MyStyle.input, { marginBottom: 10 }]}
                        left={<Icon source="currency-usd" />}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="file-document" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Mô tả: </Text>
                    </View>
                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={[MyStyle.input, { height: 100, marginBottom: 10 }]}
                        multiline={true}
                        numberOfLines={4}
                        left={<Icon source="file-document" />}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="longitude" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Tọa độ: </Text>
                    </View>
                    <TextInput
                        label="Longitude"
                        value={longitude}
                        onChangeText={setLongitude}
                        style={[MyStyle.input, { marginBottom: 10 }]}
                        left={<Icon source="longitude" />}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="latitude" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Tọa độ</Text>
                    </View>
                    <TextInput
                        label="Latitude"
                        value={latitude}
                        onChangeText={setLatitude}
                        style={[MyStyle.input, { marginBottom: 10 }]}
                        left={<Icon source="latitude" />}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="email" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Email</Text>
                    </View>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={[MyStyle.input, { marginBottom: 10 }]}
                        left={<Icon source="email" />}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="phone" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Sdt: </Text>
                    </View>

                    <TextInput
                        label="Phone"
                        value={phone}
                        onChangeText={setPhone}
                        style={[MyStyle.input, { marginBottom: 10 }]}
                        left={<Icon source="phone" />}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="door" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>loại phòng</Text>
                    </View>

                    <Menu
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        anchor={
                            <TouchableOpacity onPress={() => setVisible(true)}>
                                <TextInput
                                    label="Room Type"
                                    value={room_type}
                                    style={[MyStyle.input, { marginBottom: 10 }]}
                                    editable={false}
                                    right={<TextInput.Icon source="menu-down" />}
                                />
                            </TouchableOpacity>
                        }
                    >
                        {options.map((option, index) => (
                            <Menu.Item key={index} onPress={() => { setRoomType(option); setVisible(false); }} title={option} />
                        ))}
                    </Menu>




                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="account-group" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Số lượng người tối đa: </Text>
                    </View>
                    <TextInput
                        label="Max People"
                        value={max_people}
                        onChangeText={setMaxPeople}
                        style={[MyStyle.input, { marginBottom: 10 }]}
                        left={<Icon source="account-group" />}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="account" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Số người hiện tại</Text>
                    </View>
                    <TextInput
                        label="Current People"
                        value={current_people}
                        onChangeText={setCurrentPeople}
                        style={[MyStyle.input, { marginBottom: 10 }]}
                        left={<Icon source="account" />}
                    />
                    {/* Other TextInput components */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="home-account" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Hình ảnh: </Text>

                    </View>
                    <Text style={{ fontStyle: 'italic', color: 'purple' }}>(Vui lòng chọn ít nhất 3 hình ảnh)</Text>
                    <View style={{ marginBottom: 10 }}>
                        <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderColor: 'purple',
                                borderStyle: 'dashed',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 100,
                                width: 100,
                                marginTop: 10,
                                marginBottom: 10,
                            }}
                            onPress={pickImage}
                        >
                            <Icon source="camera" size={40} color="purple" />
                        </TouchableOpacity>
                        <FlatList
                            data={images}
                            horizontal
                            renderItem={({ item, index }) => (
                                <Image
                                    source={{ uri: item.uri }}
                                    style={{ width: 100, height: 100, margin: 5 }}
                                    key={index}
                                />
                            )}
                            ListEmptyComponent={() => (
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/100' }} // Default image
                                    style={{ width: 100, height: 100, margin: 5 }}
                                />
                            )}
                            ListFooterComponent={() => (
                                images.length > 3 && (
                                    <View
                                        style={{
                                            width: 100,
                                            height: 100,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        <Text style={{ color: 'white' }}>+{images.length - 3}</Text>
                                    </View>
                                )
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ marginTop: 10 }}
                        />
                    </View>

                    <Button
                        mode="contained"
                        onPress={updatePostAccomodations}
                        style={[MyStyle.button, { backgroundColor: "purple" }, { marginTop: 10 }]}
                    >
                        Lưu chỉnh sửa
                    </Button>

                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        duration={3000}
                    >
                        Đã lưu thành công
                    </Snackbar>
                </ScrollView>
            </View>
        </Provider>
    );
};

export default UpdatePostAccommodation;
