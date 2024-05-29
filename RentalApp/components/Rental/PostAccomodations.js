import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import { Chip, Card, Searchbar, ActivityIndicator } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import Item from "../../Utils/Item";
import APIs, { endpoints } from "../../configs/APIs";
import Swiper from "react-native-swiper";
import RenderHTML from "react-native-render-html";

/* 
get all accommodation posts from the server and display them in a list
show a short details of accommodation posts in Chip card so users can review them first, including the first image and title
users can click on each item to see more details and contact the owner
using react-native-paper 
*/
const PostAccommodations = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [q, setQ] = React.useState("");

  const loadPostAccomodations = async () => {
    try {
      let res = await APIs.get(endpoints["post_accomodations"]);
      setPosts(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  React.useEffect(() => {
    loadPostAccomodations();
  }, []);

  return (
    <View style={[MyStyle.container, MyStyle.margin, MyStyle.top]}>
      <Searchbar placeholder="Search" onChangeText={setQ} value={q} />
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
                    navigation.navigate("PostAccommodationDetails", {
                      postId: p.id,
                    })
                  }
                >
                  <Item instance={p} />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostAccommodations;
