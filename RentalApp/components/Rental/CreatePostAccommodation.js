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
  const [selectedHouseType, setSelectedHouseType] = useState("");
  const [max_people, setMaxPeople] = useState("");
  const [current_people, setCurrentPeople] = useState("");
  const [visible, setVisible] = useState(false);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
        setImages([...images, ...res.assets]);
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

export default CreatePostAccommodation;
