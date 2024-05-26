import { Text, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput } from "react-native-paper";
import React from "react";

const Login = ({navigation}) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <View
      style={[MyStyle.container, MyStyle.top, MyStyle.justifyContentCenter]}
    >
      <View style={[MyStyle.alignCenter]}>
        <Text style={MyStyle.header}>Hệ thống cho thuê phòng</Text>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={[MyStyle.searchBar, MyStyle.margin]}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={[MyStyle.searchBar, MyStyle.margin]}
        />
        <View style={[MyStyle.row, MyStyle.margin]}>
          <Button
            icon="account-lock-open"
            mode="contained"
            onPress={() => navigation.navigate("Home")}
            style={MyStyle.margin}
          >
            Sign in
          </Button>
          <Button
            icon="account-lock-open"
            mode="contained"
            onPress={() => console.log("Pressed")}
            style={MyStyle.margin}
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
