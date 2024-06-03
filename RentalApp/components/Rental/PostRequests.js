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
import APIs, { endpoints } from "../../configs/APIs";
import Swiper from "react-native-swiper";
import RenderHTML from "react-native-render-html";
import ItemPostRequest from "../../Utils/ItemPostRequest";

/* 
get all accommodation posts from the server and display them in a list
show a short details of accommodation posts in Chip card so users can review them first, including the first image and title
users can click on each item to see more details and contact the owner
using react-native-paper 
*/
const PostRequests = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);

  const loadPostRequests = async () => {
    setLoading(true);
    if (page > 0) {
      let url = `${endpoints["post_requests"]}?page=${page}`;
      try {
        let res = await APIs.get(url);
        if (page === 1) {
          setPosts(res.data.results);
        } else if (page > 1) {
          setPosts((current) => {
            return [...current, ...res.data.results];
          });
        }
        if (res.data.next === null) setPage(0);
        console.log(res.data.results);
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    loadPostRequests();
  }, [page]);

  const loadMore = ({ nativeEvent }) => {
    if (loading === false && isCloseToBottom(nativeEvent)) {
      setPage(page + 1);
    }
  };

  return (
    <View style={[MyStyle.container, MyStyle.margin]}>
      <Searchbar placeholder="Search" onChangeText={setQ} value={q} />
      <ScrollView onScroll={loadMore}>
        <View style={[MyStyle.container, MyStyle.margin]}>
          {posts === null ? (
            <ActivityIndicator />
          ) : (
            <>
              {posts.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() =>
                    navigation.navigate("PostRequestDetails", {
                      postId: p.id,
                    })
                  }
                >
                  <ItemPostRequest instance={p} />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostRequests;
