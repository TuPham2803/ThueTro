import { View, ScrollView, Text, Image, FlatList, TouchableOpacity } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput, IconButton, Icon, Appbar } from "react-native-paper"; // Import IconButton
import React from "react";
import * as ImagePicker from 'react-native-image-picker';

const CreatePostAccommodation = () => {
  const [title, setTitle] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [images, setImages] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [room_type, setRoomType] = React.useState("");
  const [max_people, setMaxPeople] = React.useState("");
  const [current_people, setCurrentPeople] = React.useState("");


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
    <View style={[MyStyle.container, MyStyle.top]}>

      <Appbar.Header style={{ backgroundColor: "purple" }}>
        <Appbar.BackAction onPress={() => console.log("Go back")} />
        <Appbar.Content
          title={<Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Bài Đăng Phòng</Text>}
        />
      </Appbar.Header>

      <ScrollView style={[MyStyle.top, MyStyle.wrapper, { paddingHorizontal: 20 }]}>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Icon source="home-account" size={30} color="purple" />
          <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Tên bài đăng</Text>
        </View>

        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={[MyStyle.input, { marginBottom: 10 }]} //Thêm marginBottom để tạo khoảng cách dưới
          left={<Icon source="home-account" size={40} color="purple" />}
        />
         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Icon source="map-marker" size={30} color="purple" />
          <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Địa chỉ nhà: </Text>
        </View>
        <TextInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          style={[MyStyle.input, { marginBottom: 10 }]}
          left={<Icon source="map-marker" />}
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
        <TextInput
          label="Room Type"
          value={room_type}
          onChangeText={setRoomType}
          style={[MyStyle.input, { marginBottom: 10 }]}
          left={<Icon source="door" />}
        />
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
          onPress={() => console.log("Pressed")}
          style={[MyStyle.button, { backgroundColor: "purple" }]}
        >
          Create Post
        </Button>
      </ScrollView>
    </View>
  );
};

export default CreatePostAccommodation;
