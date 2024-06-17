import { Text, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput } from "react-native-paper";
import React, { useContext } from "react";
import { MyDispatchContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorAssets } from "../../assest/ColorAssets";
import { SERVER_CLIENT_ID, SERVER_CLIENT_SECRET } from "@env";

const Login = ({ route }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();
  const dispatch = useContext(MyDispatchContext);

  const login = async () => {
    setLoading(true);
    try {
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
      const loginUser = (userData) => ({
        type: "login",
        payload: userData,
      });

      dispatch(loginUser(userResponse.data));

      if ( route.params?.next == "CreatePost") {
        navigation.navigate(
          userResponse.data.user_type == "landlord"
            ? "CreatePostAccommodationHome"
            : "CreatePostRequestHome"
        );
      } else {
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error(
        "Login failed: ",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[MyStyle.container, MyStyle.justifyContentCenter]}>
      <View style={MyStyle.alignCenter}>
        <Text style={MyStyle.header}>ĐĂNG NHẬP NGƯỜI DÙNG</Text>
        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          value={username}
          onChangeText={setUsername}
          style={[MyStyle.input, MyStyle.margin, { width: "90%" }]}
          label="Tên đăng nhập"
        />
        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[MyStyle.input, MyStyle.margin, { width: "90%" }]}
          label="Mật khẩu"
        />
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
  );
};

export default Login;
