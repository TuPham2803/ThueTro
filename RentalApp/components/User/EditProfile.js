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
  RadioButton,
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
const EditProfile = () => {
  const [user, setUser] = React.useState(useContext(MyUserContext));
  const [err, setErr] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const fields = [
    {
      label: "First name",
      icon: "text",
      name: "first_name",
    },
    {
      label: "Last name",
      icon: "text",
      name: "last_name",
    },
    {
      label: "Email",
      icon: "mail",
      name: "email",
    },
    {
      label: "Username",
      icon: "account",
      name: "username",
    },
  ];
  const nav = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const [isViewerVisible, setViewerVisible] = React.useState(false); // State for image viewer

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
        updateSate("image", res.assets[0]);
      }
    }
  };

  const updateSate = (field, value) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };

  const deleteImage = () => {
    updateSate("image", null);
  };

  const handleUpdatePassword = async () => {
    console.log("abc");
  }

  return (
    <View
      style={[MyStyle.container, MyStyle.margin, MyStyle.justifyContentCenter]}
    >
      <ScrollView>
        <Text style={[MyStyle.title, MyStyle.margin]}>Cập nhật profile</Text>
        {fields.map((c) =>
          !c.hidden ? (
            <TextInput
              mode="outlined"
              outlineColor={ColorAssets.input.border}
              activeOutlineColor={ColorAssets.input.borderFocus}
              secureTextEntry={c.secureTextEntry}
              value={user[c.name]}
              onChangeText={(t) => updateSate(c.name, t)}
              style={[MyStyle.margin, MyStyle.input]}
              key={c.name}
              label={c.label}
              right={
                c.icon ? (
                  <TextInput.Icon
                    icon={c.icon}
                    color={ColorAssets.content.icon}
                  />
                ) : null
              }
            />
          ) : null
        )}

        <HelperText type="error" visible={err}>
          Mật khẩu không khớp!
        </HelperText>

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

          {user.image && (
            <TouchableRipple onPress={() => setViewerVisible(true)}>
              <Image
                source={{ uri: user.image.uri ? user.image.uri : user.image }}
                style={MyStyle.avatar}
              />
            </TouchableRipple>
          )}

          {user.image && (
            <Button icon="delete" mode="contained" onPress={deleteImage} style={MyStyle.button}>
              Xóa ảnh
            </Button>
          )}
        </View>

        <Button
          icon="account"
          mode="contained"
          onPress={console.log('abc')}
          style={[MyStyle.margin, MyStyle.button]}
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
          right={<TextInput.Icon icon="eye" color={ColorAssets.content.icon} />}
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
          right={<TextInput.Icon icon="eye" color={ColorAssets.content.icon} />}
        />
        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(t) => setConfirmPassword(t)}
          style={[MyStyle.margin, MyStyle.input]}
          label="Xác nhận mật khẩu"
          right={<TextInput.Icon icon="eye" color={ColorAssets.content.icon} />}
        />

        <Button
          icon="lock"
          mode="contained"
          onPress={handleUpdatePassword}
          style={[MyStyle.margin, MyStyle.button]}
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
