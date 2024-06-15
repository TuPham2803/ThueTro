import React, { useEffect, useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import { IconButton, Searchbar, ActivityIndicator } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import Item from "../../Utils/Item";
import APIs, { endpoints } from "../../configs/APIs";
import Swiper from "react-native-swiper";
import RenderHTML from "react-native-render-html";
import { MyUserContext } from "../../configs/Contexts";
import { Button } from "react-native-paper";
import { ColorAssets } from "../../assest/ColorAssets";

const ListPostAccommodation = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [q, setQ] = React.useState("");
  const user = useContext(MyUserContext);
  const loadPostAccomodations = async () => {
    try {
      let res = await APIs.get(
        `${endpoints["post_accomodations"]}?user_post=${user.id}&q=${q}`
      );
      setPosts(res.data.results);
    } catch (ex) {
      console.error(ex);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadPostAccomodations();
    }, [q])
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus"
          iconColor={ColorAssets.header.text}
          size={30}
          onPress={() => navigation.navigate("CreatePostAccommodation")}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={[MyStyle.container]}>
      {/* <Searchbar  style={[MyStyle.input, MyStyle.searchBar, {textAlign:'center'}]} placeholder="Search" onChangeText={setQ} value={q} /> */}
      <ScrollView>
        <View style={[MyStyle.container, MyStyle.margin]}>
          {posts === null ? (
            <ActivityIndicator />
          ) : (
            <>
              {posts.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() =>
                    navigation.navigate("UpdatePostAccommodation", {
                      post: p,
                    })
                  }
                >
                  <Item instance={p} />

                  <Text
                    style={{
                      fontStyle: "italic",
                      color: "gray",
                      alignSelf: "center",
                      marginTop: 5,
                    }}
                  >
                    {p.pending_status === "PD"
                      ? "Chưa được xét duyệt"
                      : "Đã được xét duyệt"}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default ListPostAccommodation;
