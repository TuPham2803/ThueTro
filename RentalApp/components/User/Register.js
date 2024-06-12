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
import { ColorAssets } from "../../assest/ColorAssets";
const Register = () => {
  const [user, setUser] = React.useState({});
  const [err, setErr] = React.useState(false);
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
    {
      label: "Password",
      icon: "eye",
      name: "password",
      secureTextEntry: true,
    },
    {
      label: "Confirm password",
      icon: "eye",
      name: "confirm",
      secureTextEntry: true,
    },
    {
      label: "User type",
      icon: "account",
      name: "user_type",
      hidden: true,
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

  const register = async () => {
    if (user["password"] !== user["confirm"]) {
      setErr(true);
    } else {
      setErr(false);

      let form = new FormData();
      for (let key in user) {
        if (key !== "confirm") {
          if (key === "image" && user.image) {
            form.append(key, {
              uri: user.image.uri,
              name: user.image.uri.split("/").pop(),
              type: mime.lookup(user.image.uri) || "image/jpeg",
            });
          } else {
            form.append(key, user[key]);
          }
        }
      }

      setLoading(true);

      try {
        let res = await APIs.post(endpoints["register"], form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 201) nav.navigate("Login");
      } catch (ex) {
        console.error(
          "Register failed: ",
          ex.response ? ex.response.data : ex.message
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View
      style={[
        MyStyle.container,
        MyStyle.margin,
        MyStyle.justifyContentCenter,
        { marginTop: 0 },
      ]}
    >
      <ScrollView>
        <Text style={[MyStyle.header, { textAlign: "center" }]}>
          ĐĂNG KÝ NGƯỜI DÙNG
        </Text>

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
                    color={ColorAssets.input.icon}
                    icon={c.icon}
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
              <Image source={{ uri: user.image.uri }} style={MyStyle.avatar} />
            </TouchableRipple>
          )}

          {user.image && (
            <Button
              icon="delete"
              mode="contained"
              onPress={deleteImage}
              style={[MyStyle.button]}
            >
              Xóa ảnh
            </Button>
          )}
        </View>

        <View style={[MyStyle.margin, MyStyle.border]}>
          <Text style={MyStyle.margin}>Loại người dùng</Text>
          <RadioButton.Group
            onValueChange={(value) => updateSate("user_type", value)}
            value={user.user_type}
          >
            <RadioButton.Item
              color={ColorAssets.checkbox.selected}
              label="Landlord"
              value="landlord"
            />
            <RadioButton.Item
              color={ColorAssets.checkbox.selected}
              label="Tenant"
              value="tenant"
            />
          </RadioButton.Group>
        </View>

        <Button
          style={[MyStyle.button]}
          icon="account"
          loading={loading}
          mode="contained"
          onPress={register}
        >
          ĐĂNG KÝ
        </Button>
      </ScrollView>

      {user.image && (
        <ImageViewing
          images={[{ uri: user.image.uri }]}
          imageIndex={0}
          visible={isViewerVisible}
          onRequestClose={() => setViewerVisible(false)}
        />
      )}
    </View>
  );
};

export default Register;
