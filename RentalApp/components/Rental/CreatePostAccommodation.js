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
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MyStyle from "../../styles/MyStyle";
import styles from "../../styles/CreateUpdatePostAccommodationStyle";
import mime from "react-native-mime-types";
import APIs, { endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorAssets } from "../../assest/ColorAssets";
import { CommonActions } from "@react-navigation/native";
const CreatePostAccommodation = ({ route, navigation }) => {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setmainImage] = useState("");
  const [images, setImages] = useState([]);
  const [acreage, setAcreage] = useState("");
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedHouseType, setSelectedHouseType] = useState("");
  const [max_people, setMaxPeople] = useState("");
  const [current_people, setCurrentPeople] = useState("");
  const [visible, setVisible] = useState(false);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [isMainImageViewVisible, setMainImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleHouseTypeSelection = (type) => {
    setSelectedHouseType(type);
  };

  const pickMainImage = async () => {
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
        setmainImage(res.assets[0]);
      }
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

  const deleteImage = (index) => {
    arr = [...images];
    arr.splice(index, 1);
    setImages(arr);
  };

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setImageViewVisible(true);
  };

  const openMainImageViewer = () => {
    setMainImageViewVisible(true);
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
      Alert.alert(
        "Rental",
        "Please fill all the fields and upload at least three images!"
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("city", city);
    formData.append("district", district);
    formData.append("ward", ward);
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
    formData.append("main_image", {
      uri: mainImage.uri,
      name: mainImage.uri.split("/").pop(),
      type: mime.lookup(mainImage.uri) || "image/jpeg",
    });
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
        if (route.name == "CreatePostAccommodationHome") {
          // clear HomeStack and navigate to PostManagerStack
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "PostManagerStack",
                  state: {
                    routes: [{ name: "ListPostAccommodation" }],
                  },
                },
              ],
            })
          );
        } else {
          navigation.navigate("ListPostAccommodation");
        }
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
  };

  const moveToCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
  };

  const handleSearch = async () => {
    try {
      const response = await Location.geocodeAsync(searchQuery);
      if (response && response.length > 0) {
        const { latitude, longitude } = response[0];
        setLatitude(latitude);
        setLongitude(longitude);
      } else {
        Alert.alert("Không tìm thấy địa chỉ");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm địa chỉ", error);
      Alert.alert("Lỗi khi tìm kiếm địa chỉ");
    }
  };

  return (
    <Provider>
      <View style={[MyStyle.container, { padding: 10 }]}>
        <ScrollView style={[MyStyle.wrapper]}>
          {/* Input fields for the form */}
          <View style={styles.iconTextContainer}>
            <Icon
              source="home-account"
              size={30}
              color={ColorAssets.content.icon}
            />
            <Text style={styles.iconText}>Tên bài đăng</Text>
          </View>
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            value={title}
            onChangeText={setTitle}
            style={[MyStyle.input, styles.textInput]}
          />
          {/* More input fields */}
          <View style={styles.iconTextContainer}>
            <Icon
              source="map-marker"
              size={30}
              color={ColorAssets.content.icon}
            />
            <Text style={styles.iconText}>Địa chỉ: </Text>
          </View>
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            label="Thành phố"
            value={city}
            onChangeText={setCity}
            style={[MyStyle.input, styles.textInput]}
          />
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            label="Quận/Huyện"
            value={district}
            onChangeText={setDistrict}
            style={[MyStyle.input, styles.textInput]}
          />
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            label="Phường/Xã"
            value={ward}
            onChangeText={setWard}
            style={[MyStyle.input, styles.textInput]}
          />
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            label="Địa chỉ"
            value={address}
            onChangeText={setAddress}
            style={[MyStyle.input, styles.textInput]}
          />
          <View style={styles.iconTextContainer}>
            <Icon source="map" size={30} color={ColorAssets.content.icon} />
            <Text style={styles.iconText}>Vị trí bản đồ</Text>
          </View>
          {latitude && longitude ? (
            <View style={styles.mapContainer}>
              <MapView
                style={{ width: "100%", height: 300 }}
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.0025,
                  longitudeDelta: 0.0025,
                }}
                region={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.0025,
                  longitudeDelta: 0.0025,
                }}
                onPress={handleMapPress}
              >
                <Marker coordinate={{ latitude, longitude }} />
              </MapView>
              <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={moveToCurrentLocation}
              >
                <Icon
                  source="crosshairs-gps"
                  size={30}
                  color={ColorAssets.content.icon}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={MyStyle.buttonContainer}>
            <View style={styles.searchRow}>
              <TextInput
                mode="outlined"
                outlineColor={ColorAssets.input.border}
                activeOutlineColor={ColorAssets.input.borderFocus}
                label="Tìm kiếm địa chỉ"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[MyStyle.input, styles.searchInput]}
              />
              <IconButton
                icon="map-search-outline"
                iconColor={ColorAssets.button.text}
                size={28}
                onPress={handleSearch}
                style={styles.searchButton}
              />
            </View>
          </View>

          {/* More input fields and buttons */}
          <View style={styles.iconTextContainer}>
            <Icon
              source="cash-multiple"
              size={30}
              color={ColorAssets.content.icon}
            />
            <Text style={styles.iconText}>Giá</Text>
          </View>
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            value={price}
            onChangeText={setPrice}
            style={[MyStyle.input, styles.textInput]}
          />
          <View style={styles.iconTextContainer}>
            <Icon
              source="file-document"
              size={30}
              color={ColorAssets.content.icon}
            />
            <Text style={styles.iconText}>Mô tả: </Text>
          </View>
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            value={description}
            onChangeText={setDescription}
            style={[MyStyle.input, styles.multilineTextInput]}
            multiline={true}
            numberOfLines={4}
          />
          <View style={styles.iconTextContainer}>
            <Icon source="ruler" size={30} color={ColorAssets.content.icon} />
            <Text style={styles.iconText}>Diện tích</Text>
          </View>
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            value={acreage.toString()}
            onChangeText={setAcreage}
            style={[MyStyle.input, MyStyle.margin]}
          />
          <View style={styles.iconTextContainer}>
            <Icon source="phone" size={30} color={ColorAssets.content.icon} />
            <Text style={styles.iconText}>SĐT </Text>
          </View>
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            value={phone}
            onChangeText={setPhone}
            style={[MyStyle.input, styles.textInput]}
          />
          <View style={styles.iconTextContainer}>
            <Icon source="door" size={30} color={ColorAssets.content.icon} />
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
                  iconColor={
                    selectedHouseType === "SH"
                      ? ColorAssets.checkbox.text
                      : "#000"
                  }
                  icon="home-group"
                  size={30}
                />
              </View>
              <Text
                style={[
                  selectedHouseType === "SH" && {
                    color: ColorAssets.checkbox.text,
                  },
                ]}
              >
                Ở Ghép
              </Text>
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
                  iconColor={
                    selectedHouseType === "PR"
                      ? ColorAssets.checkbox.text
                      : "#000"
                  }
                  icon="home-group"
                  size={30}
                />
              </View>
              <Text
                style={[
                  selectedHouseType === "PR" && {
                    color: ColorAssets.checkbox.text,
                  },
                ]}
              >
                Ở riêng
              </Text>
            </TouchableOpacity>
          </View>
          {selectedHouseType === "SH" && (
            <View>
              <View style={styles.iconTextContainer}>
                <Icon
                  source="account"
                  size={30}
                  color={ColorAssets.content.icon}
                />
                <Text style={styles.iconText}>Số người tối đa</Text>
              </View>
              <TextInput
                mode="outlined"
                outlineColor={ColorAssets.input.border}
                activeOutlineColor={ColorAssets.input.borderFocus}
                value={max_people}
                onChangeText={setMaxPeople}
                style={[MyStyle.input, styles.textInput]}
              />
              <View style={styles.iconTextContainer}>
                <Icon
                  source="account-group"
                  size={30}
                  color={ColorAssets.content.icon}
                />
                <Text style={styles.iconText}>Số người hiện tại</Text>
              </View>
              <TextInput
                mode="outlined"
                outlineColor={ColorAssets.input.border}
                activeOutlineColor={ColorAssets.input.borderFocus}
                value={current_people}
                onChangeText={setCurrentPeople}
                style={[MyStyle.input, styles.textInput]}
              />
            </View>
          )}
          <View style={styles.iconTextContainer}>
            <Icon source="camera" size={30} color={ColorAssets.content.icon} />
            <Text style={styles.iconText}>Hình ảnh chính</Text>
          </View>
          <View style={styles.imageWrapper}>
            {mainImage && mainImage.uri && (
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => openMainImageViewer()}>
                  <Image source={{ uri: mainImage.uri }} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageDeleteButton}
                  onPress={() => setmainImage("")}
                >
                  <IconButton icon="delete" size={20} iconColor="red" />
                </TouchableOpacity>
              </View>
            )}
            {mainImage == "" && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={pickMainImage}
              >
                <IconButton
                  icon="plus"
                  size={30}
                  color={ColorAssets.content.icon}
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.iconTextContainer}>
            <Icon source="camera" size={30} color={ColorAssets.content.icon} />
            <Text style={styles.iconText}>Hình ảnh phụ</Text>
          </View>
          <View style={styles.imageWrapper}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <TouchableOpacity onPress={() => openImageViewer(index)}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageDeleteButton}
                  onPress={() => deleteImage(index)}
                >
                  <IconButton icon="delete" size={20} iconColor="red" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
              <IconButton
                icon="plus"
                size={30}
                color={ColorAssets.content.icon}
              />
            </TouchableOpacity>
          </View>
          <Button
            mode="contained"
            onPress={handleCreatePostAccommodation}
            loading={loading}
            style={MyStyle.button}
          >
            Đăng tin
          </Button>
        </ScrollView>
        <ImageViewing
          images={images.map((image) => ({ uri: image.uri }))}
          imageIndex={currentImageIndex}
          visible={isImageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
        />
        <ImageViewing
          images={[{ uri: mainImage.uri }]}
          imageIndex={0}
          visible={isMainImageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
        />
      </View>
    </Provider>
  );
};

export default CreatePostAccommodation;
