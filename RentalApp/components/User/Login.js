import { Text, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput } from "react-native-paper";
import React, { useContext } from "react";
import { MyDispatchContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";
import APIs, { authApi, endpoints } from "../../configs/APIs";

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
      let res = await APIs.post(endpoints["login"], {
        ...user,
        client_id: "oYGHb8Bt1odfEu8Wz2o8UHyLo52sI4rzCsB0xESW",
        client_secret:
          "5Ztf235KBvE5ycS00gNcJxLMoicbDuslEvenhSufkeUA4mbySMK1lFD9TWljaE3322g2gK9LIIjRQChdk7tbxGCBvV9CNLcpcccSGhqBRXRW1OjOYKd20vTMoKgVxFYl",
        grant_type: "password",
      });
      console.info(res.data);

      await AsyncStorage.setItem("token", res.data.access_token);

      setTimeout(async () => {
        let user = await authApi(res.data.access_token).get(
          endpoints["current-user"]
        );
        console.info(user.data);

        dispatch({
          type: "login",
          payload: user.data,
        });

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
      style={[MyStyle.container, MyStyle.top, MyStyle.justifyContentCenter]}
    >
      <View style={[MyStyle.alignCenter]}>
        <Text style={MyStyle.header}>ĐĂNG NHẬP NGƯỜI DÙNG</Text>
        {fields.map((c) => (
          <TextInput
            secureTextEntry={c.secureTextEntry}
            value={user[c.name]}
            onChangeText={(t) => updateState(c.name, t)}
            style={[MyStyle.searchBar, MyStyle.margin]}
            key={c.name}
            label={c.label}
          />
        ))}
        <View style={[MyStyle.row, MyStyle.margin]}>
          <Button
            icon="account-lock-open"
            mode="contained"
            onPress={login}
            style={MyStyle.margin}
            loading={loading}
          >
            Sign in
          </Button>
          <Button
            icon="account-lock-open"
            mode="contained"
            onPress={() => console.log("Pressed")}
            style={MyStyle.margin}
            loading={loading}
          >
            Sign up
          </Button>
        </View>
        <Text>Forgot password?</Text>
      </View>
    </View>
  );
};

export default Login;
