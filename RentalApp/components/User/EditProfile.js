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
import APIs, { authApi, endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = ({ navigation }) => {
  const [user, setUser] = React.useState({});
  const [err, setErr] = React.useState(false);
  const currentUser = React.useContext(MyUserContext);
  const fields = [
    {
      label: "First name",
      icon: "text",
      name: "first_name",
      value: currentUser.first_name,
    },
    {
      label: "Last name",
      icon: "text",
      name: "last_name",
      value: currentUser.last_name,
    },
    {
      label: "Email",
      icon: "mail",
      name: "email",
      value: currentUser.email,
    },
    {
      label: "Username",
      icon: "account",
      name: "username",
      value: currentUser.username,
    },
    {
      label: "Password",
      icon: "eye",
      name: "password",
      secureTextEntry: true,
      value: currentUser.password,
    },
    {
      label: "Confirm password",
      icon: "eye",
      name: "confirm",
      secureTextEntry: true,
      value: currentUser.password,
    },
    {
      label: "User type",
      icon: "account",
      name: "user_type",
      hidden: true,
      value: currentUser.user_type,
    },
  ];
  const nav = useNavigation();
  const [loading, setLoading] = React.useState(false);

  const picker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") Alert.alert("Rental", "Permissions Denied!");
    else {
      let res = await ImagePicker.launchImageLibraryAsync();
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

  const update = async () => {
    if (user["password"] !== user["confirm"]) setErr(true);
    else {
      setErr(false);

      let form = new FormData();
      for (let key in user) {
        if (key !== "confirm") {
          if (key === "image") {
            form.append(key, {
              uri: user.image.uri,
              name: user.image.fileName,
              type: user.image.type,
            });
          } else {
            form.append(key, user[key]);
          }
        }
      }

      setLoading(true);
      let token = await AsyncStorage.getItem("token");

      try {
        let res = await authApi(token).patch(
          endpoints["update_profile"],
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.status === 201) nav.navigate("Login");
      } catch (ex) {
        console.error(
          "Updated failed: ",
          ex.response ? ex.response.data : ex.message
        );
      } finally {
        setLoading(false);
      }
    }
  };

  //thêm thông báo trước khi thoát trang EditProfile
  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();

        Alert.alert("Xác nhận thoát", "Bạn có chắc muốn thoát không?", [
          { text: "Cancel", style: "cancel", onPress: () => {} },
          {
            text: "Thoát",
            style: "destructive",
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]);
      }),
    [navigation]
  ),
    [currentUser];

  return (
    <View
      style={[MyStyle.container, MyStyle.margin, MyStyle.justifyContentCenter]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <Text style={MyStyle.subject}>Profile của bạn</Text>

          {fields.map((c) =>
            !c.hidden ? (
              <TextInput
                secureTextEntry={c.secureTextEntry}
                value={c.value}
                onChangeText={(t) => updateSate(c.name, t)}
                style={MyStyle.margin}
                key={c.name}
                label={c.label}
                right={c.icon ? <TextInput.Icon icon={c.icon} /> : null}
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

            {user.image ? (
              <>
                <Image
                  source={{ uri: user.image.uri }}
                  style={MyStyle.avatar}
                />
              </>
            ) : (
              <>
                <Image
                  source={currentUser.image ? { uri: currentUser.image } : null}
                  style={MyStyle.avatar}
                />
              </>
            )}
          </View>

          <View style={[MyStyle.margin, MyStyle.border]}>
            <Text style={MyStyle.margin}>Loại người dùng</Text>
            <RadioButton.Group
              onValueChange={(value) => updateSate("user_type", value)}
              value={user.user_type}
            >
              <RadioButton.Item label="Landlord" value="landlord" />
              <RadioButton.Item label="Tenant" value="tenant" />
            </RadioButton.Group>
          </View>

          <Button
            icon="account"
            loading={loading}
            mode="contained"
            onPress={update}
          >
            Lưu chỉnh sửa
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfile;
