import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MyStyle from "../../styles/MyStyle";
import {
  Card,
  IconButton,
  Searchbar,
  TouchableRipple,
} from "react-native-paper";
import React, { useContext } from "react";
import Swiper from "react-native-swiper";
import APIs, { endpoints } from "../../configs/APIs";
import Item from "../../Utils/Item";
import { MyUserContext } from "../../configs/Contexts";

const Home = ({ navigation }) => {
  const [search, setSearch] = React.useState("");
  //thay doi thanh images cua nha tro
  const images = [
    "https://via.placeholder.com/800x200.png?text=Image+1",
    "https://via.placeholder.com/800x200.png?text=Image+2",
    "https://via.placeholder.com/800x200.png?text=Image+3",
  ];
  const [accommdation, setAccomodation] = React.useState([]);
  const user = useContext(MyUserContext);

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
            onPress={() => {
              navigation.navigate(user ? "Profile" : "Login");
            }}
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
                <IconButton icon="map-marker" color="purple" size={20} />
                <Text>Tìm kiếm theo vị trí</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <IconButton icon="cash" color="purple" size={20} />
                <Text>Tìm kiếm theo giá</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <IconButton icon="account-group" color="purple" size={20} />
                <Text>Bạn ở chungggg</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <IconButton icon="bed" color="purple" size={20} />
                <Text>Phòng riêng</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <IconButton icon="home" color="purple" size={20} />
                <Text>Nhà nhanh</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log("Pressed")}
              rippleColor="rgba(0, 0, 0, .32)"
              style={[MyStyle.iconFeature, MyStyle.margin]}
            >
              <View style={[MyStyle.alignCenter]}>
                <IconButton icon="plus" color="purple" size={20} />
                <Text>Đăng phòng trọ</Text>
              </View>
            </TouchableRipple>
          </View>
        </View>

        <View style={[MyStyle.container, MyStyle.margin, MyStyle.top]}>
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
      {/* Thêm 5 buttons có chưa hình ảnh và caption, có thể trượt ngang, ấn vào chuyển sang trang tìm kiếm */}
      <ScrollView horizontal={true} style={MyStyle.horizontalScroll}>
        {[
          {
            image: "https://via.placeholder.com/100.png?text=Feature+1",
            caption: "Feature 1",
            screen: "Login",
          },
          {
            image: "https://via.placeholder.com/100.png?text=Feature+2",
            caption: "Feature 2",
            screen: "CreatePostAccommodation",
          },
          {
            image: "https://via.placeholder.com/100.png?text=Feature+3",
            caption: "Feature 3",
            screen: "Feature3Screen",
          },
          {
            image: "https://via.placeholder.com/100.png?text=Feature+4",
            caption: "Feature 4",
            screen: "Feature4Screen",
          },
          {
            image: "https://via.placeholder.com/100.png?text=Feature+5",
            caption: "Feature 5",
            screen: "Feature5Screen",
          },
        ].map((item, index) => (
          <Card key={index} style={MyStyle.card}>
            <TouchableOpacity
              style={MyStyle.button}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Card.Cover
                source={{ uri: item.image }}
                style={MyStyle.cardImage}
              />
              <Card.Content>
                <Text style={MyStyle.buttonCaption}>{item.caption}</Text>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>

      
    </ScrollView>
  );
};

export default Home;
