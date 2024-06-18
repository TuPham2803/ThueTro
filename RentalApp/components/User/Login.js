import { Text, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput, HelperText } from "react-native-paper";
import React, { useContext, useState } from "react";
import { MyDispatchContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorAssets } from "../../assets/ColorAssets";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { SERVER_CLIENT_ID, SERVER_CLIENT_SECRET } from "@env";

const Login = ({ route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState({
    error: false,
  });
  const [passwordError, setPasswordError] = useState({
    error: false,
  });
  const [loginError, setLoginError] = useState(""); // New state variable for login error message
  const navigation = useNavigation();
  const dispatch = useContext(MyDispatchContext);

  const validate = () => {
    let isValid = true;
    if (username.trim() === "") {
      setUsernameError({
        error: true,
        message: "Tên đăng nhập không được để trống",
      });
      isValid = false;
    } else {
      setUsernameError({ error: false });
    }

    if (password.trim() === "") {
      setPasswordError({
        error: true,
        message: "Mật khẩu không được để trống",
      });
      isValid = false;
    } else {
      setPasswordError({ error: false });
    }
    console.log(isValid);
    return isValid;
  };

  const login = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      setLoginError(""); // Reset login error message

      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      formData.append("client_id", SERVER_CLIENT_ID);
      formData.append("client_secret", SERVER_CLIENT_SECRET);
      formData.append("grant_type", "password");

      const res = await APIs.post(endpoints["login"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await AsyncStorage.setItem("token", res.data.access_token);

      const userResponse = await authApi(res.data.access_token).get(
        endpoints["current-user"]
      );
      if (["landlord", "tenant"].indexOf(userResponse.data.user_type) === -1) {
        throw new Error("User type is not landlord or tenant");
      }

      dispatch({
        type: "login",
        payload: userResponse.data,
      });

      if (route.params?.next == "CreatePost") {
        navigation.navigate(
          userResponse.data.user_type == "landlord"
            ? "CreatePostAccommodationHome"
            : "CreatePostRequestHome"
        );
      } else {
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log(
        "Login failed: ",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.data.error === "invalid_grant") {
        setLoginError("Thông tin đăng nhập không chính xác.");
      } else {
        setLoginError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Lỗi",
        textBody: loginError,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertNotificationRoot>
      <View style={[MyStyle.container, MyStyle.justifyContentCenter]}>
        <View style={MyStyle.alignCenter}>
          <Text style={MyStyle.header}>ĐĂNG NHẬP NGƯỜI DÙNG</Text>
          <View style={{ width: "90%", marginTop: 10 }}>
            <TextInput
              mode="outlined"
              outlineColor={ColorAssets.input.border}
              activeOutlineColor={ColorAssets.input.borderFocus}
              value={username}
              onChangeText={setUsername}
              style={MyStyle.input}
              label="Tên đăng nhập"
              error={usernameError.error}
            />
            {usernameError.error && (
              <HelperText type="error" visible={usernameError.error}>
                {usernameError.message}
              </HelperText>
            )}
          </View>
          <View style={{ width: "90%", marginTop: 10 }}>
            <TextInput
              mode="outlined"
              outlineColor={ColorAssets.input.border}
              activeOutlineColor={ColorAssets.input.borderFocus}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              style={MyStyle.input}
              label="Mật khẩu"
              error={passwordError.error}
            />
            {passwordError.error && (
              <HelperText type="error" visible={passwordError.error}>
                {passwordError.message}
              </HelperText>
            )}
          </View>
          <View style={[MyStyle.row, MyStyle.margin]}>
            <Button
              icon="account-lock-open"
              mode="contained"
              onPress={login}
              style={[MyStyle.margin, MyStyle.button]}
              loading={loading}
            >
              Đăng nhập
            </Button>
          </View>
        </View>
      </View>
    </AlertNotificationRoot>
  );
};

export default Login;
