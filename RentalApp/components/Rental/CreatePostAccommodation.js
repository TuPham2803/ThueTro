import React, { useState } from "react";
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
import mime from "react-native-mime-types"; // Use react-native-mime-types
import APIs, { endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CreatePostAccommodation = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [acreage, setAcreage] = useState(0);
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [selectedHouseType, setSelectedHouseType] = useState("");
  const [max_people, setMaxPeople] = useState("");
  const [current_people, setCurrentPeople] = useState("");
  const [visible, setVisible] = useState(false);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleHouseTypeSelection = (type) => {
    setSelectedHouseType(type);
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

  const handleCreatePostAccommodation = async () => {
    if (
      title === "" ||
      city === "" ||
      district === "" ||
      address === "" ||
      price === "" ||
      description === "" ||
      images.length < 3 ||
      acreage === 0 ||
      phone === "" ||
      selectedHouseType === ""
    ) {
      Alert.alert("Rental", "Please fill all the fields and upload at least three images!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("city", city);
    formData.append("district", district);
    formData.append("address", address);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("acreage", acreage);
    formData.append("phone_number", phone);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("room_type", selectedHouseType);
    if (selectedHouseType === "SH") {
      formData.append("max_people", max_people);
      formData.append("current_people", current_people);
    }
    
    // Append images one by one to formData
    images.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        name: image.uri.split("/").pop(),
        type: mime.lookup(image.uri) || "image/jpeg",
      });
    });

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated");
        return;
      }

      let res = await APIs.post(endpoints["post_accomodations"], formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        alert("Create post accommodation successfully");
        navigation.navigate("ListPostAccommodation");
      } else {
        console.error("Failed to create post accommodation", res.data);
        alert("Failed to create post accommodation");
      }
    } catch (err) {
      console.error("Error while creating post accommodation", err);
      alert("An error occurred while creating the post accommodation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider>
      <View style={[MyStyle.container, styles.container]}>
        <ScrollView style={[MyStyle.wrapper, styles.wrapper]}>
          {/* Input fields for the form */}
          <View style={styles.iconTextContainer}>
            <Icon source="home-account" size={30} color="purple" />
            <Text style={styles.iconText}>Tên bài đăng</Text>
          </View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={[MyStyle.input, styles.textInput]}
          />
          {/* More input fields */}
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
          {/* Price */}
          <View style={styles.iconTextContainer}>
            <Icon source="currency-usd" size={30} color="purple" />
            <Text style={styles.iconText}>Giá</Text>
          </View>
          <TextInput
            value={price}
            onChangeText={setPrice}
            style={[MyStyle.input, styles.textInput]}
          />
          {/* Description */}
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
          {/* Acreage */}
          <View style={styles.iconTextContainer}>
            <Icon source="ruler" size={30} color="purple" />
            <Text style={styles.iconText}>Diện tích</Text>
          </View>
          <TextInput
            value={acreage.toString()}
            onChangeText={setAcreage}
            style={[MyStyle.input, MyStyle.margin]}
          />
          {/* Phone */}
          <View style={styles.iconTextContainer}>
            <Icon source="phone" size={30} color="purple" />
            <Text style={styles.iconText}>SĐT </Text>
          </View>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={[MyStyle.input, styles.textInput]}
          />
          {/* House Type */}
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
          {/* Images */}
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
          <Button mode="contained" onPress={handleCreatePostAccommodation} loading={loading}>
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

export default CreatePostAccommodation;
