import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {
  Button,
  RadioButton,
  TextInput,
  IconButton,
  TouchableRipple,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import APIs, { endpoints } from "../../configs/APIs";
import mime from "react-native-mime-types";

import ImageViewing from "react-native-image-viewing";
import { ColorAssets } from "../../assets/ColorAssets";
import MyStyle from "../../styles/MyStyle";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [image, setImage] = useState(null);
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const navigation = useNavigation();

  const picker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Rental", "Permissions Denied!");
    } else {
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!res.cancelled) {
        setImage(res.assets[0]);
      }
    }
  };

  const deleteImage = () => {
    setImage(null);
  };

  const register = async () => {
    let formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("user_type", userType);

    formData.append("image", {
      uri: image.uri,
      type: mime.lookup(image.uri) || "image/jpeg",
      name: image.uri.split("/").pop(),
    });

    try {
      setLoading(true);
      let res = await APIs.post(endpoints["register"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        navigation.navigate("Login");
      }
    } catch (ex) {
      console.error(
        "Register failed: ",
        ex.response ? ex.response.data : ex.message
      );
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[MyStyle.container]}>
      <Text style={[MyStyle.header, { textAlign: "center" }]}>
        ĐĂNG KÝ NGƯỜI DÙNG
      </Text>

      <TextInput
        mode="outlined"
        outlineColor={ColorAssets.input.border}
        activeOutlineColor={ColorAssets.input.borderFocus}
        value={firstName}
        onChangeText={setFirstName}
        style={[MyStyle.margin, MyStyle.input]}
        label={"Tên"}
      />
      <TextInput
        mode="outlined"
        outlineColor={ColorAssets.input.border}
        activeOutlineColor={ColorAssets.input.borderFocus}
        value={lastName}
        onChangeText={setLastName}
        style={[MyStyle.margin, MyStyle.input]}
        label={"Họ"}
      />
      <TextInput
        mode="outlined"
        outlineColor={ColorAssets.input.border}
        activeOutlineColor={ColorAssets.input.borderFocus}
        value={username}
        onChangeText={setUsername}
        style={[MyStyle.margin, MyStyle.input]}
        label={"Tên đăng nhập"}
      />
      <TextInput
        mode="outlined"
        outlineColor={ColorAssets.input.border}
        activeOutlineColor={ColorAssets.input.borderFocus}
        value={email}
        onChangeText={setEmail}
        style={[MyStyle.margin, MyStyle.input]}
        label={"Email"}
      />
      <TextInput
        mode="outlined"
        outlineColor={ColorAssets.input.border}
        activeOutlineColor={ColorAssets.input.borderFocus}
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
        style={[MyStyle.margin, MyStyle.input]}
        label={"Mật khẩu"}
      />
      <TextInput
        mode="outlined"
        outlineColor={ColorAssets.input.border}
        activeOutlineColor={ColorAssets.input.borderFocus}
        value={passwordConfirm}
        secureTextEntry={true}
        onChangeText={setPasswordConfirm}
        style={[MyStyle.margin, MyStyle.input]}
        label={"Xác nhận mật khẩu"}
      />

      <View
        style={[
          MyStyle.container,
          MyStyle.row,
          MyStyle.border,
          MyStyle.margin,
          MyStyle.alignCenter,
        ]}
      >
        <TouchableRipple
          style={[MyStyle.margin, MyStyle.border, MyStyle.alignCenter]}
          onPress={picker}
        >
          <Text>Chọn ảnh đại diện...</Text>
        </TouchableRipple>

        {image && (
          <TouchableRipple onPress={() => setViewerVisible(true)}>
            <Image source={{ uri: image.uri }} style={MyStyle.avatar} />
          </TouchableRipple>
        )}

        {image && (
          <IconButton icon="delete" onPress={deleteImage} iconColor="red" />
        )}
      </View>

      {/* Radio button group for user type */}
      <View style={[MyStyle.margin, MyStyle.border]}>
        <Text style={MyStyle.margin}>Loại người dùng</Text>
        <RadioButton.Group value={userType} onValueChange={setUserType}>
          <RadioButton.Item
            color={ColorAssets.checkbox.selected}
            label="Chủ trọ"
            value="landlord"
          />
          <RadioButton.Item
            color={ColorAssets.checkbox.selected}
            label="Người thuê"
            value="tenant"
          />
        </RadioButton.Group>
      </View>

      {/* Register button */}
      <Button
        style={[MyStyle.button, MyStyle.margin]}
        icon="account"
        loading={loading}
        mode="contained"
        onPress={register}
      >
        ĐĂNG KÝ
      </Button>

      {/* Image viewer modal */}
      {image && (
        <ImageViewing
          images={[{ uri: image.uri }]}
          imageIndex={0}
          visible={isViewerVisible}
          onRequestClose={() => setViewerVisible(false)}
        />
      )}
    </ScrollView>
  );
};

export default Register;
