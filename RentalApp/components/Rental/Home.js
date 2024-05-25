import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import {
  Button,
  Card,
  Icon,
  IconButton,
  MD3Colors,
  Searchbar,
  TouchableRipple,
} from "react-native-paper";
import React from "react";
import Swiper from "react-native-swiper";
import APIs, { endpoints } from "../../configs/APIs";
import Item from "../../Utils/Item";

const Home = ({ navigation }) => {
  const [search, setSearch] = React.useState("");
  //thay doi thanh images cua nha tro
  const images = [
    "https://via.placeholder.com/800x200.png?text=Image+1",
    "https://via.placeholder.com/800x200.png?text=Image+2",
    "https://via.placeholder.com/800x200.png?text=Image+3",
  ];
  const [accommdation, setAccomodation] = React.useState([]);

  const loadPostAccomodations = async () => {
    try {
      let res = await APIs.get(endpoints["post_accomodations"]);
      setAccomodation(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  React.useEffect(() => {
    loadPostAccomodations();
  }, []);

  return (
    <ScrollView style={[MyStyle.container, MyStyle.top]}>
      <ScrollView>
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
            onPress={() => navigation.navigate("Login")}
            style={MyStyle.icon}
          />
        </View>

        <View style={[MyStyle.top, MyStyle.wrapper]}>
          <Swiper style={MyStyle.wrapper} showsButtons={false}>
            {images.map((image, index) => (
              <View style={MyStyle.slide} key={index}>
                <Image
                  source={{ uri: image }}
                  style={MyStyle.image}
                  resizeMode="cover"
                />
              </View>
            ))}
          </Swiper>
        </View>

        <View style={[MyStyle.container, MyStyle.top]}>
          <View style={[MyStyle.row]}>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <Icon source="account" color="purple" size={20} />
                <Text>Tìm kiếm theo vị trí</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <Icon source="account" color="purple" size={20} />
                <Text>Tìm kiếm theo giá</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <Icon source="account" color="purple" size={20} />
                <Text>Bạn ở chung</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <Icon source="account" color="purple" size={20} />
                <Text>Phòng riêng</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <Icon source="account" color="purple" size={20} />
                <Text>Nhà nhanh</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <Icon source="account" color="purple" size={20} />
                <Text>Đăng phòng trọ</Text>
              </View>
            </TouchableRipple>
          </View>
        </View>

        <View style={[MyStyle.container, MyStyle.margin]}>
          <Text style={MyStyle.header}>Search trending and quality</Text>
        </View>
      </ScrollView>
      <View style={MyStyle.container}>
        <ScrollView>
          {accommdation.map((a) => (
            <TouchableOpacity key={a.id}>
              <Item instance={a} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Home;
