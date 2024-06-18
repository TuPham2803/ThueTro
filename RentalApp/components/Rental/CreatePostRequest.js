import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  TextInput,
  IconButton,
  Icon,
  Provider,
} from "react-native-paper";
import React, { useState, useRef, useEffect } from "react";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import APIs, { endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyStyle from "../../styles/MyStyle";
import { ColorAssets } from "../../assets/ColorAssets";
import { Picker } from "@react-native-picker/picker";
const CreatePostRequest = ({ navigation }) => {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [gender, setGender] = useState("");
  const [quanity, setQuanity] = useState("");
  const [selectedHouseType, setSelectedHouseType] = useState("");
  const [priceRange, setPriceRange] = useState([0, 20000000]);

  const handleHouseTypeSelection = (type) => {
    setSelectedHouseType(type);
  };

  const handleCreatePostRequest = async () => {
    if (
      !city ||
      !district ||
      !title ||
      !note ||
      !gender ||
      !selectedHouseType ||
      (selectedHouseType === "SH" && !quanity)
    ) {
      alert("Please fill out all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("city", city);
    formData.append("district", district);
    formData.append("title", title);
    formData.append("description", note);
    formData.append("gender", gender);
    if (selectedHouseType === "SH") formData.append("quanity", quanity);
    formData.append("room_type", selectedHouseType);
    formData.append("min_price", priceRange[0]);
    formData.append("max_price", priceRange[1]);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated");
        return;
      }
      let res = await APIs.post(endpoints["post_requests"], formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 201) {
        alert("Create post request successfully");
        navigation.navigate("ListPostRequest");
      } else {
        console.error("Failed to create post request", res.data);
        alert("Failed to create post request");
      }
    } catch (err) {
      console.error("Error while creating post request", err);
      alert("An error occurred while creating the post request");
    }
  };

  return (
    <Provider>
      <View style={[MyStyle.container, { padding: 10 }]}>
        <ScrollView style={[MyStyle.wrapper]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Icon
              source="home-account"
              size={30}
              color={ColorAssets.content.icon}
            />
            <Text
              style={{
                color: ColorAssets.content.title,
                marginRight: 5,
                fontFamily: "Roboto",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Tên bài đăng
            </Text>
          </View>
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            outlineStyle={(borderRadius = 50)}
            value={title}
            onChangeText={setTitle}
            style={[MyStyle.input, MyStyle.margin]}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Icon
              source="map-marker"
              size={30}
              color={ColorAssets.content.icon}
            />
            <Text
              style={{
                color: ColorAssets.content.title,
                marginRight: 5,
                fontFamily: "Roboto",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Khu vực mong muốn:
            </Text>
          </View>
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            label="Thành phố"
            value={city}
            onChangeText={setCity}
            style={[MyStyle.input, MyStyle.margin]}
          />
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            label="Quận/Huyện"
            value={district}
            onChangeText={setDistrict}
            style={[MyStyle.input, MyStyle.margin]}
          />

          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <Icon
                source="currency-usd"
                size={30}
                color={ColorAssets.content.icon}
              />
              <Text style={styles.label}>Khoảng Giá</Text>
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}> 0</Text>
              <Text style={styles.sliderLabel}>20.000.000</Text>
            </View>
            <View style={styles.sliderContainer}>
              <MultiSlider
                values={priceRange}
                onValuesChange={setPriceRange}
                min={0}
                max={20000000}
                step={500000}
                selectedStyle={{ backgroundColor: ColorAssets.range.selected }}
                unselectedStyle={{
                  backgroundColor: ColorAssets.range.unselected,
                }}
                containerStyle={styles.slider}
                markerStyle={styles.thumbStyle}
              />
            </View>
            <Text style={styles.currentValue}>
              Giá mong muốn: {priceRange[0].toLocaleString()} -{" "}
              {priceRange[1].toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Icon
              source="file-document"
              size={30}
              color={ColorAssets.content.icon}
            />
            <Text
              style={{
                color: ColorAssets.content.title,
                marginRight: 5,
                fontFamily: "Roboto",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Ghi chú:{" "}
            </Text>
          </View>
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            value={note}
            onChangeText={setNote}
            style={[MyStyle.input, MyStyle.margin]}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Icon
              source="gender-male-female"
              size={30}
              color={ColorAssets.content.icon}
            />
            <Text
              style={{
                color: ColorAssets.content.title,
                marginRight: 5,
                fontFamily: "Roboto",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Giới tính
            </Text>
          </View>
          <View style={[MyStyle.input, MyStyle.margin]}>
            <Picker
              selectedValue={gender}
              onValueChange={setGender}
              style={styles.picker}
              mode="dialog" // or "dialog"
            >
              <Picker.Item
                label="Chọn giới tính..."
                value=""
                color={ColorAssets.input.placeholder}
              />
              <Picker.Item label="Nữ" value="1" />
              <Picker.Item label="Nam" value="0" />
            </Picker>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Icon source="door" size={30} color={ColorAssets.content.icon} />
            <Text
              style={{
                color: ColorAssets.content.title,
                marginRight: 5,
                fontFamily: "Roboto",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Loại phòng
            </Text>
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
                  icon="home"
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
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 5,
                }}
              >
                <Icon
                  source="account"
                  size={30}
                  color={ColorAssets.content.icon}
                />
                <Text
                  style={{
                    color: ColorAssets.content.title,
                    marginRight: 5,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  Số người
                </Text>
              </View>
              <TextInput
                mode="outlined"
                outlineColor={ColorAssets.input.border}
                activeOutlineColor={ColorAssets.input.borderFocus}
                value={quanity}
                onChangeText={setQuanity}
                style={[MyStyle.input, MyStyle.margin]}
              />
            </View>
          )}
          <Button
            style={[MyStyle.button]}
            mode="contained"
            onPress={handleCreatePostRequest}
          >
            Đăng tin
          </Button>
        </ScrollView>
      </View>
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    color: ColorAssets.content.title,
    marginRight: 5,
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16,
  },
  sliderContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center", // Center the slider horizontally
  },
  slider: {
    width: "100%",
    height: 40,
  },
  thumbStyle: {
    height: 20,
    width: 20,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    color: ColorAssets.content.title,
    marginRight: 5,
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16,
  },
  currentValue: {
    color: ColorAssets.content.title,
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: ColorAssets.checkbox.selected,
  },
});

export default CreatePostRequest;
