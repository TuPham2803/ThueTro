import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Button,
  TextInput,
  IconButton,
  Icon,
  Provider,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import ImageViewing from "react-native-image-viewing";
import MyStyle from "../../styles/MyStyle";
import styles from "../../styles/CreateUpdatePostAccommodationStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { endpoints } from "../../configs/APIs";

const UpdatePostAcccommodation = ({ route, navigation }) => {
  const { post } = route.params;
  console.log(post);
  const [title, setTitle] = useState(post.title);
  const [city, setCity] = useState(post.city);
  const [district, setDistrict] = useState(post.district);
  const [address, setAddress] = useState(post.address);
  const [price, setPrice] = useState(String(post.price));
  const [description, setDescription] = useState(post.description);
  const [images, setImages] = useState(post.images);
  const [acreage, setAcreage] = useState(String(post.acreage));
  const [phone, setPhone] = useState(post.phone_number);
  const [selectedHouseType, setSelectedHouseType] = useState(post.room_type);
  const [max_people, setMaxPeople] = useState(String(post.max_people));
  const [current_people, setCurrentPeople] = useState(
    String(post.current_people)
  );
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleHouseTypeSelection = (type) => {
    setSelectedHouseType(type);
  };
  const handleDeletePostAccommodation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated");
        return;
      }
      let res = await APIs.delete(endpoints["post_accomodation_details"](post.id), {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (res.status === 204) {
        alert("Delete post accommodation successfully");
        navigation.navigate("ListPostAccommodation");
      } else {
        console.error("Failed to delete post accommodation", res.data);
        alert("Failed to delete post accommodation");
      }
    } catch (err) {
      console.error("Error while delete post accommodation", err);
      alert("An error occurred while delete the post accommodation");
    }
  };
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Rental", "Permissions Denied!");
    } else {
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!res.cancelled) {
        setImages([...images, res.assets[0]]);
      }
    }
  };

  const deleteImage = (uri) => {
    setImages(images.filter((image) => image.uri !== uri));
  };

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setImageViewVisible(true);
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="delete"
          iconColor="purple"
          size={30}
          onPress={() => {
            Alert.alert(
              "Xác nhận xóa",
              "Bạn có chắc chắn muốn xóa bài đăng này không?",
              [
                {
                  text: "Không",
                  style: "cancel",
                },
                { text: "Có", onPress: () => handleDeletePostAccommodation() },
              ],
              { cancelable: false }
            );
          }}
        />
      ),
    });
  }, [navigation]);
  return (
    <Provider>
      <View style={[MyStyle.container, styles.container]}>
        <ScrollView style={[MyStyle.wrapper, styles.wrapper]}>
          <View style={styles.iconTextContainer}>
            <Icon source="home-account" size={30} color="purple" />
            <Text style={styles.iconText}>Tên bài đăng</Text>
          </View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={[MyStyle.input, styles.textInput]}
          />

          <View style={styles.iconTextContainer}>
            <Icon source="map-marker" size={30} color="purple" />
            <Text style={styles.iconText}>Địa chỉ: </Text>
          </View>
          <TextInput
            label="Thành phố"
            value={city}
            onChangeText={setCity}
            style={[MyStyle.input, styles.textInput]}
          />
          <TextInput
            label="Quận/Huyện"
            value={district}
            onChangeText={setDistrict}
            style={[MyStyle.input, styles.textInput]}
          />
          <TextInput
            label="Địa chỉ"
            value={address}
            onChangeText={setAddress}
            style={[MyStyle.input, styles.textInput]}
          />

          <View style={styles.iconTextContainer}>
            <Icon source="currency-usd" size={30} color="purple" />
            <Text style={styles.iconText}>Giá</Text>
          </View>
          <TextInput
            value={price}
            onChangeText={setPrice}
            style={[MyStyle.input, styles.textInput]}
          />

          <View style={styles.iconTextContainer}>
            <Icon source="file-document" size={30} color="purple" />
            <Text style={styles.iconText}>Mô tả: </Text>
          </View>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[MyStyle.input, styles.multilineTextInput]}
            multiline={true}
            numberOfLines={4}
          />

          <View style={styles.iconTextContainer}>
            <Icon source="ruler" size={30} color="purple" />
            <Text style={styles.iconText}>Diện tích</Text>
          </View>
          <TextInput
            value={acreage}
            onChangeText={setAcreage}
            style={[MyStyle.input, MyStyle.margin]}
          />

          <View style={styles.iconTextContainer}>
            <Icon source="phone" size={30} color="purple" />
            <Text style={styles.iconText}>SĐT </Text>
          </View>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={[MyStyle.input, styles.textInput]}
          />

          <View style={styles.iconTextContainer}>
            <Icon source="door" size={30} color="purple" />
            <Text style={styles.iconText}>Loại phòng</Text>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                selectedHouseType === "SH" && styles.selectedButton,
              ]}
              onPress={() => handleHouseTypeSelection("SH")}
            >
              <View style={styles.iconButtonContent}>
                <IconButton
                  icon="home-group"
                  size={30}
                  color={selectedHouseType === "SH" ? "white" : "white"}
                />
              </View>
              <Text style={styles.buttonText}>Ở Ghép</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.iconButton,
                selectedHouseType === "PR" && styles.selectedButton,
              ]}
              onPress={() => handleHouseTypeSelection("PR")}
            >
              <View style={styles.iconButtonContent}>
                <IconButton
                  icon="home"
                  size={30}
                  color={selectedHouseType === "PR" ? "white" : "white"}
                />
              </View>
              <Text style={styles.buttonText}>Ở riêng</Text>
            </TouchableOpacity>
          </View>
          {selectedHouseType === "SH" && (
            <View>
              <View style={styles.iconTextContainer}>
                <Icon source="account" size={30} color="purple" />
                <Text style={styles.iconText}>Số người tối đa</Text>
              </View>
              <TextInput
                value={max_people}
                onChangeText={setMaxPeople}
                style={[MyStyle.input, styles.textInput]}
              />
              <View style={styles.iconTextContainer}>
                <Icon source="account-group" size={30} color="purple" />
                <Text style={styles.iconText}>Số người hiện tại</Text>
              </View>
              <TextInput
                value={current_people}
                onChangeText={setCurrentPeople}
                style={[MyStyle.input, styles.textInput]}
              />
            </View>
          )}

          <View style={styles.iconTextContainer}>
            <Icon source="camera" size={30} color="purple" />
            <Text style={styles.iconText}>Hình ảnh</Text>
          </View>
          <View style={styles.imageWrapper}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <TouchableOpacity onPress={() => openImageViewer(index)}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageDeleteButton}
                  onPress={() => deleteImage(image.uri)}
                >
                  <IconButton icon="delete" size={20} color="purple" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <IconButton icon="plus" size={30} color="purple" />
            </TouchableOpacity>
          </View>

          <Button mode="contained" onPress={console.log("s")}>
            Đăng tin
          </Button>
        </ScrollView>

        <ImageViewing
          images={images.map((image) => ({ uri: image.uri }))}
          imageIndex={currentImageIndex}
          visible={isImageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
        />
      </View>
    </Provider>
  );
};

export default UpdatePostAcccommodation;
