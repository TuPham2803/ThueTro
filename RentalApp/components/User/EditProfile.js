import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Button,
  HelperText,
  IconButton,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import MyStyle from "../../styles/MyStyle";
import APIs, { endpoints } from "../../configs/APIs";
import mime from "react-native-mime-types";
import ImageViewing from "react-native-image-viewing"; // Import ImageViewing
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import { useContext, useState, useEffect } from "react";
import { ColorAssets } from "../../assest/ColorAssets";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = ({navigation}) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [username, setUsername] = React.useState(user.username);
  const [email, setEmail] = React.useState(user.email);
  const [first_name, setFirstName] = React.useState(user.first_name);
  const [last_name, setLastName] = React.useState(user.last_name);
  const [image, setImage] = React.useState(user.image);
  const [oldPassword, setOldPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [passwordLoading, setPasswordLoading] = React.useState(false);
  const [isViewerVisible, setViewerVisible] = React.useState(false);
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
      if (!res.canceled) {
        setImage(res.assets[0]);
      }
    }
  };

  const deleteImage = () => {
    console.log("Delete image");
    setImage(null);
  };

  const handleUpdatePassword = async () => {
    if (oldPassword === "" || password === "" || confirmPassword === "") {
      Alert.alert("Rental", "Please fill all fields!");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Rental", "Password not match!");
      return;
    }
    let formData = new FormData();
    formData.append("old_password", oldPassword);
    formData.append("new_password", password);
    formData.append("confirm_password", confirmPassword);
    setPasswordLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated");
        return;
      }
      let res = await APIs.patch(endpoints["update_password"], formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        alert("Update password successfully");
        setOldPassword("");
        setPassword("");
        setConfirmPassword("");
      } else {
        console.error("Failed to update password", res.data);
        alert("Failed to update password");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.error("Bad request: ", err.response.data);
        alert("Bad request: " + err.response.data.error);
      } else {
        console.error("Error while update password", err);
        alert("An error occurred while updating password");
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (
      first_name === "" ||
      last_name === "" ||
      username === "" ||
      email === "" ||
      !image
    ) {
      Alert.alert("Rental", "Please fill all fields!");
      return;
    }
    let formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("username", username);
    formData.append("email", email);
    if (image.uri) {
      formData.append("image", {
        uri: image.uri,
        name: image.uri.split("/").pop(),
        type: mime.lookup(image.uri),
      });
    }
    try {
      setProfileLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("User is not authenticated");
        return;
      }
      let res = await APIs.patch(endpoints["update_profile"], formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        dispatch({
          type: "login",
          payload: res.data,
        });
        alert("Update profile successfully");
        navigation.navigate("Profile");

      } else {
        console.error("Failed to update profile", res.data);
        alert("Failed to update profile");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.error("Bad request: ", err.response.data);
        alert("Bad request: " + err.response.data.error);
      } else {
        console.error("Error while update profile", err);
        alert("An error occurred while updating profile");
      }
    }finally {
      setProfileLoading(false);
    }
  };

  return (
    <View style={[MyStyle.container, MyStyle.justifyContentCenter]}>
      <ScrollView>
        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          value={first_name}
          onChangeText={setFirstName}
          style={[MyStyle.margin, MyStyle.input]}
          label={"Tên"}
        />
        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          value={last_name}
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
          label={"Username"}
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
              <Image
                source={{ uri: image.uri ? image.uri : image }}
                style={MyStyle.avatar}
              />
            </TouchableRipple>
          )}

          {image && (
            <IconButton icon="delete" onPress={deleteImage} iconColor="red" />
          )}
        </View>

        <Button
          icon="account"
          mode="contained"
          style={[MyStyle.margin, MyStyle.button]}
          onPress={handleUpdateProfile}
          loading={profileLoading}
        >
          Cập nhật profile
        </Button>
        <Text style={[MyStyle.title, MyStyle.margin]}>Cập nhật mật khẩu</Text>
        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          secureTextEntry={true}
          value={oldPassword}
          onChangeText={(t) => setOldPassword(t)}
          style={[MyStyle.margin, MyStyle.input]}
          label="Mật khẩu cũ"
        />
        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          secureTextEntry={true}
          value={password}
          onChangeText={(t) => setPassword(t)}
          style={[MyStyle.margin, MyStyle.input]}
          label="Mật khẩu cũ"
        />
        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          secureTextEntry={true}
          value={hidePassword}
          onChangeText={(t) => setConfirmPassword(t)}
          style={[MyStyle.margin, MyStyle.input]}
          label="Xác nhận mật khẩu"
        />

        <Button
          icon="lock"
          mode="contained"
          onPress={handleUpdatePassword}
          style={[MyStyle.margin, MyStyle.button]}
          loading={passwordLoading}
        >
          Cập nhật mật khẩu
        </Button>
      </ScrollView>

      {user.image && (
        <ImageViewing
          images={[{ uri: user.image.uri ? user.image.uri : user.image }]}
          imageIndex={0}
          visible={isViewerVisible}
          onRequestClose={() => setViewerVisible(false)}
        />
      )}
    </View>
  );
};

export default EditProfile;
