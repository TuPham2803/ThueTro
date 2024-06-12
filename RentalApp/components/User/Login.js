import { Text, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput } from "react-native-paper";
import React, { useContext } from "react";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import APIs, { authApi, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorAssets } from "../../assest/ColorAssets";

const SERVER_CLIENT_ID = process.env.SERVER_CLIENT_ID; //Eh65pe9lGWTeVJBzZBj4sNbgshpOlEWvnLZ0en3b
const SERVER_CLIENT_SECRET = process.env.SERVER_CLIENT_SECRET; //mWbFHj6vwBRccXBwvOtQMLrOmuUmZiAjjTLFRCEma8zISfOr6p8zHyDnhYYMcVY85ac4AOgme4KlONf9i2VmNaSGkayLmnZo5KC6tvQ9bbjFuPc8yandkEvaSmjljzWh

const Login = () => {
  const [user, setUser] = React.useState({});
  const fields = [
    {
      label: "Tên đăng nhập",
      name: "username",
    },
    {
      label: "Mật khẩu",
      name: "password",
      secureTextEntry: true,
    },
  ];
  const [loading, setLoading] = React.useState(false);
  const nav = useNavigation();
  const dispatch = useContext(MyDispatchContext);

  const updateState = (field, value) => {
    setUser((current) => {
      return { ...current, [field]: value };
    });
  };

  const login = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("username", user.username);
      formData.append("password", user.password);
      formData.append("client_id", SERVER_CLIENT_ID);
      formData.append("client_secret", SERVER_CLIENT_SECRET);
      formData.append("grant_type", "password");

      let res = await APIs.post(endpoints["login"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await AsyncStorage.setItem("token", res.data.access_token);

      setTimeout(async () => {
        let user = await authApi(res.data.access_token).get(
          endpoints["current-user"]
        );

        const loginUser = (userData) => ({
          type: "login",
          payload: userData,
        });

        dispatch(loginUser(user.data));

        nav.navigate("Home");
      }, 100);
    } catch (ex) {
      console.error(
        "Login failed: ",
        ex.response ? ex.response.data : ex.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[MyStyle.container, MyStyle.justifyContentCenter]}
    >
      <View style={[MyStyle.alignCenter]}>
        <Text style={MyStyle.header}>ĐĂNG NHẬP NGƯỜI DÙNG</Text>
        {fields.map((c) => (
          <TextInput
            mode="outlined"
            outlineColor={ColorAssets.input.border}
            activeOutlineColor={ColorAssets.input.borderFocus}
            secureTextEntry={c.secureTextEntry}
            value={user[c.name]}
            onChangeText={(t) => updateState(c.name, t)}
            style={[MyStyle.input, MyStyle.margin, {width: "90%"}]}
            key={c.name}
            label={c.label}
          />
        ))}
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
          {/* <Button
            icon="account-lock-open"
            mode="contained"
            onPress={() => nav.navigate("Register")}
            style={MyStyle.margin}
            loading={loading}
          >
            Sign up
          </Button> */}
        </View>
        <Text>Forgot password?</Text>
      </View>
    </View>
  );
};

export default Login;
