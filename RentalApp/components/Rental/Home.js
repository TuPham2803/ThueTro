import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import MyStyle from "../../styles/MyStyle";
import {
  Card,
  IconButton,
  Searchbar,
  TouchableRipple,
  BottomNavigation,
  ActivityIndicator,
} from "react-native-paper";
import React, { useContext } from "react";
import Swiper from "react-native-swiper";
import APIs, { endpoints } from "../../configs/APIs";
import Item from "../../Utils/Item";
import { MyUserContext } from "../../configs/Contexts";
import { ImagesAssets } from "../../assets/images/ImagesAssets";
import { ColorAssets } from "../../assets/ColorAssets";
const Home = ({ navigation }) => {
  const [search, setSearch] = React.useState("");
  const images = [
    ImagesAssets.quan1,
    ImagesAssets.quan12,
    ImagesAssets.quantanbinh,
  ];
  const [accommdation, setAccomodation] = React.useState([]);
  const user = useContext(MyUserContext);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);

  const handlePress = () => {
    if (user) {
      if (user.user_type === "landlord") {
        navigation.navigate("CreatePostAccommodationHome");
      } else {
        navigation.navigate("CreatePostRequestHome");
      }
    } else {
      navigation.navigate("Login", {
        screen: "Login",
        next: "CreatePost",
      });
    }
  };
  const loadMore = ({ nativeEvent }) => {
    if (loading === false && isCloseToBottom(nativeEvent)) {
      setPage(page + 1);
    }
  };
  // const loadPostAccomodations = async () => {
  //   if (page > 0) {
  //     let url = `${endpoints["post_accomodations"]}?pending_status=APR?page=${page}`;
  //     try {
  //       setLoading(true);
  //       let res = await APIs.get(url);
  //       if (page === 1) {
  //         setAccomodation(res.data.results);
  //       } else if (page > 1) {
  //         setAccomodation((current) => {
  //           return [...current, ...res.data.results];
  //         });
  //       }
  //       if (res.data.next === null) setPage(0);
  //     } catch (ex) {
  //       console.error(ex);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  React.useEffect(() => {
    // loadPostAccomodations();
  }, [user]);
  return (
    <ScrollView style={[MyStyle.container]}>
      <View style={[MyStyle.wrapper]}>
        <Swiper
          style={MyStyle.wrapper}
          showsButtons={false}
          autoplay={true}
          autoplayTimeout={2}
          dotColor="rgba(255, 255, 255, 0.5)"
          activeDotColor="#fff"
        >
          {images.map((image, index) => (
            <View style={MyStyle.slide} key={index}>
              <Image source={image} style={MyStyle.image} resizeMode="cover" />
            </View>
          ))}
        </Swiper>
      </View>

      <View style={[MyStyle.row]}>
        <Searchbar
          iconColor={ColorAssets.content.icon}
          rippleColor={ColorAssets.content.icon}
          placeholder="Search"
          value={search}
          onPress={() => navigation.navigate("PostAccommodations")}
          style={[MyStyle.searchBar, MyStyle.margin]}
        />
      </View>
      <View style={[MyStyle.container]}>
        <View style={[MyStyle.row]}>
          <TouchableRipple
            onPress={() => navigation.navigate("PostAccommodations")}
            rippleColor="rgba(0, 0, 0, .32)"
            style={[MyStyle.iconFeature, MyStyle.margin]}
          >
            <View style={[MyStyle.alignCenter]}>
              <IconButton
                icon="home"
                iconColor={ColorAssets.content.icon}
                size={20}
              />
              <Text>Tin cho thuê</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => navigation.navigate("PostRequests")}
            rippleColor="rgba(0, 0, 0, .32)"
            style={[MyStyle.iconFeature, MyStyle.margin]}
          >
            <View style={[MyStyle.alignCenter]}>
              <IconButton
                icon="map-search"
                iconColor={ColorAssets.content.icon}
                size={20}
              />
              <Text>Tin tìm trọ</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => navigation.navigate("PostAccommodations")}
            rippleColor="rgba(0, 0, 0, .32)"
            style={[MyStyle.iconFeature, MyStyle.margin]}
          >
            <View style={[MyStyle.alignCenter]}>
              <IconButton
                icon="account-group"
                iconColor={ColorAssets.content.icon}
                size={20}
              />
              <Text>Trọ ở ghép</Text>
            </View>
          </TouchableRipple>
        </View>
        <View style={[MyStyle.row, { marginTop: 10 }]}>
          <TouchableRipple
            onPress={() => navigation.navigate("PostAccommodations")}
            rippleColor="rgba(0, 0, 0, .32)"
            style={[MyStyle.iconFeature, MyStyle.margin]}
          >
            <View style={[MyStyle.alignCenter]}>
              <IconButton
                icon="bed"
                iconColor={ColorAssets.content.icon}
                size={20}
              />
              <Text>Trọ ở riêng</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => navigation.navigate("PostAccommodations")}
            rippleColor="rgba(0, 0, 0, .32)"
            style={[MyStyle.iconFeature, MyStyle.margin]}
          >
            <View style={[MyStyle.alignCenter]}>
              <IconButton
                icon="map-marker"
                iconColor={ColorAssets.content.icon}
                size={20}
              />
              <Text>Trọ theo vị trí</Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            onPress={handlePress}
            rippleColor="rgba(0, 0, 0, .32)"
            style={[MyStyle.iconFeature, MyStyle.margin]}
          >
            <View style={[MyStyle.alignCenter]}>
              <IconButton
                icon="plus"
                iconColor={ColorAssets.content.icon}
                size={20}
              />
              <Text>Đăng tin</Text>
            </View>
          </TouchableRipple>
        </View>
      </View>

      <View style={[MyStyle.container, MyStyle.margin, MyStyle.top]}>
        <Text style={MyStyle.header}>Search trending and quality</Text>
      </View>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={MyStyle.horizontalScroll}
      >
        {[
          {
            image: ImagesAssets.quan1,
            caption: "Quận 1",
            screen: "PostAccommodations",
          },
          {
            image: ImagesAssets.quan12,
            caption: "Quận 12",
            screen: "PostAccommodations",
          },
          {
            image: ImagesAssets.quangovap,
            caption: "Quận Gò Vấp",
            screen: "PostAccommodations",
          },
          {
            image: ImagesAssets.quantanbinh,
            caption: "Quận Tân Bình",
            screen: "PostAccommodations",
          },
          {
            image: ImagesAssets.quantanphu,
            caption: "Quận Tân Phú",
            screen: "PostAccommodations",
          },
        ].map((item, index) => (
          <Card key={index} style={[MyStyle.card]}>
            <TouchableOpacity
              style={[MyStyle.button, { borderRadius: 10 }]}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Card.Cover source={item.image} style={MyStyle.cardImage} />
              <Card.Content>
                <Text style={MyStyle.buttonCaption}>{item.caption}</Text>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
      {/* <View style={MyStyle.container}>
        <View style={[MyStyle.container, MyStyle.margin]}>
          {accommdation === null ? (
            <ActivityIndicator />
          ) : (
            <>
              {accommdation.map((a) => (
                <TouchableOpacity
                  key={a.id}
                  onPress={() =>
                    navigation.navigate("PostAccommodationDetails", {
                      postId: a.id,
                    })
                  }
                >
                  <Item instance={a} />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </View> */}
    </ScrollView>
  );
};

export default Home;
