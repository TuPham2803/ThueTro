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
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import ImageViewing from "react-native-image-viewing";
import MyStyle from "../../styles/MyStyle";
import styles from "../../styles/CreateUpdatePostAccommodationStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mime from "react-native-mime-types";
import APIs, { endpoints } from "../../configs/APIs";
import { ColorAssets } from "../../assets/ColorAssets";
const UpdatePostAcccommodation = ({ route, navigation }) => {
  const { post } = route.params;
  const [title, setTitle] = useState(post.title);
  const [city, setCity] = useState(post.city);
  const [district, setDistrict] = useState(post.district);
  const [ward, setWard] = useState(post.district);
  const [address, setAddress] = useState(post.address);
  const [price, setPrice] = useState(String(post.price));
  const [description, setDescription] = useState(post.description);
  const [mainImage, setmainImage] = useState(post.main_image);
  const [images, setImages] = useState(post.images);
  const [acreage, setAcreage] = useState(String(post.acreage));
  const [phone, setPhone] = useState(post.phone_number);
  const [latitude, setLatitude] = useState(post.latitude);
  const [longitude, setLongitude] = useState(post.longitude);
  const [selectedHouseType, setSelectedHouseType] = useState(post.room_type);
  const [max_people, setMaxPeople] = useState(String(post.max_people));
  const [current_people, setCurrentPeople] = useState(
    String(post.current_people)
  );
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [isMainImageViewVisible, setMainImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleHouseTypeSelection = (type) => {
    setSelectedHouseType(type);
  };
  const handleUpdatePostAccommodation = async () => {
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
    if (mainImage.uri) {
      formData.append("main_image", {
        uri: mainImage.uri,
        name: mainImage.uri.split("/").pop(),
        type: mime.lookup(mainImage.uri) || "image/jpeg",
      });
    }
    images.forEach((image, index) => {
      if (image.uri) {
        formData.append("new_images", {
          uri: image.uri,
          name: image.uri.split("/").pop(),
          type: mime.lookup(image.uri) || "image/jpeg",
        });
      } else {
        formData.append("existing_images", image);
      }
    });

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated");
        return;
      }

      let res = await APIs.patch(
        endpoints["post_accommodation_details"](post.id),
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        alert("Update post accommodation successfully");
        navigation.navigate("ListPostAccommodation");
      } else {
        console.error("Failed to update post accommodation", res.data);
        alert("Failed to update post accommodation");
      }
    } catch (err) {
      console.error("Error while update post accommodation", err);
      alert("An error occurred while update the post accommodation");
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePostAccommodation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated");
        return;
      }
      let res = await APIs.delete(
        endpoints["post_accomodation_details"](post.id),
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
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
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="delete"
          iconColor={ColorAssets.header.icon}
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
      setSearchLoading(true);
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
    } finally {
      setSearchLoading(false);
    }
  };
  return (
    <Provider>
      <View style={[MyStyle.container, { padding: 10 }]}>
        <ScrollView style={[MyStyle.wrapper]}>
          {post.pending_status == "FL" && (
            <View
              style={[
                MyStyle.container,
                MyStyle.row,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Icon source="close-circle-outline" size={30} color="red" />
              <Text style={{ color: "red" }}>Bài đăng bị từ chối</Text>
            </View>
          )}
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
            disabled={post.pending_status === "FL"}
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
            disabled={post.pending_status === "FL"}
          />
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            label="Quận/Huyện"
            value={district}
            onChangeText={setDistrict}
            style={[MyStyle.input, styles.textInput]}
            disabled={post.pending_status === "FL"}
          />
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            label="Phường/Xã"
            value={ward}
            onChangeText={setWard}
            style={[MyStyle.input, styles.textInput]}
            disabled={post.pending_status === "FL"}
          />
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            label="Địa chỉ"
            value={address}
            onChangeText={setAddress}
            style={[MyStyle.input, styles.textInput]}
            disabled={post.pending_status === "FL"}
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
                onPress={post.pending_status !== "FL" && handleMapPress}
              >
                <Marker coordinate={{ latitude, longitude }} />
              </MapView>
              {post.pending_status !== "FL" && (
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
              )}
            </View>
          ) : null}
          {post.pending_status !== "FL" && (
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
                  disabled={post.pending_status === "FL"}
                />
                <IconButton
                  icon="map-search-outline"
                  iconColor={ColorAssets.button.text}
                  size={28}
                  onPress={handleSearch}
                  style={styles.searchButton}
                  loading={searchLoading}
                />
              </View>
            </View>
          )}

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
            disabled={post.pending_status === "FL"}
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
            disabled={post.pending_status === "FL"}
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
            disabled={post.pending_status === "FL"}
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
            disabled={post.pending_status === "FL"}
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
              disabled={post.pending_status === "FL"}
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
                  disabled={post.pending_status === "FL"}
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
              disabled={post.pending_status === "FL"}
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
                  disabled={post.pending_status === "FL"}
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
                disabled={post.pending_status === "FL"}
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
                disabled={post.pending_status === "FL"}
              />
            </View>
          )}
          <View style={styles.iconTextContainer}>
            <Icon source="camera" size={30} color={ColorAssets.content.icon} />
            <Text style={styles.iconText}>Hình ảnh chính</Text>
          </View>
          <View style={styles.imageWrapper}>
            {mainImage && (
              <View style={styles.imageContainer}>
                <TouchableOpacity onPress={() => openMainImageViewer()}>
                  <Image
                    source={{ uri: mainImage.uri ? mainImage.uri : mainImage }}
                    style={styles.image}
                  />
                </TouchableOpacity>
                {post.pending_status !== "FL" && (
                  <TouchableOpacity
                    style={styles.imageDeleteButton}
                    onPress={() => setmainImage("")}
                  >
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor="red"
                      disabled={post.pending_status === "FL"}
                    />
                  </TouchableOpacity>
                )}
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
                  disabled={post.pending_status === "FL"}
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
                  <Image
                    source={{ uri: image.uri ? image.uri : image }}
                    style={styles.image}
                  />
                </TouchableOpacity>
                {post.pending_status !== "FL" && (
                  <TouchableOpacity
                    style={styles.imageDeleteButton}
                    onPress={() => deleteImage(index)}
                  >
                    <IconButton icon="delete" size={20} iconColor="red" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {post.pending_status !== "FL" && (
              <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                <IconButton
                  icon="plus"
                  size={30}
                  color={ColorAssets.content.icon}
                  disabled={post.pending_status === "FL"}
                />
              </TouchableOpacity>
            )}
          </View>
          {post.pending_status !== "FL" && (
            <Button
              mode="contained"
              onPress={handleUpdatePostAccommodation}
              loading={loading}
              style={MyStyle.button}
            >
              Cập nhật
            </Button>
          )}
        </ScrollView>
        <ImageViewing
          images={[{ uri: mainImage.uri ? mainImage.uri : mainImage }]}
          imageIndex={0}
          visible={isMainImageViewVisible}
          onRequestClose={() => setMainImageViewVisible(false)}
          
        />
        <ImageViewing
          images={images.map((image) => ({
            uri: image.uri ? image.uri : image,
          }))}
          imageIndex={currentImageIndex}
          visible={isImageViewVisible}
          onRequestClose={() => setImageViewVisible(false)}
        />
      </View>
    </Provider>
  );
};

export default UpdatePostAcccommodation;
