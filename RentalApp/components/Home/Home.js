import { Text, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import {
  Button,
  Card,
  IconButton,
  MD3Colors,
  Searchbar,
} from "react-native-paper";
import React from "react";

const Home = () => {
  const [search, setSearch] = React.useState("");

  return (
    <View style={[MyStyle.container, MyStyle.top]}>
      <View style={[MyStyle.row]}>
        <Searchbar
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          style={[MyStyle.searchBar, MyStyle.margin]}
        />

        <IconButton
          icon="cart"
          iconColor="purple"
          size={20}
          onPress={() => console.log("Pressed")}
          style={MyStyle.icon}
        />
        <IconButton
          icon="wechat"
          iconColor="purple"
          size={20}
          onPress={() => console.log("Pressed")}
          style={MyStyle.icon}
        />
        <IconButton
          icon="account"
          iconColor="purple"
          size={20}
          onPress={() => console.log("Pressed")}
          style={MyStyle.icon}
        />
      </View>
    </View>
  );
};

export default Home;
