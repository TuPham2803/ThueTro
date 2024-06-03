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
import {
  Chip,
  Card,
  Searchbar,
  ActivityIndicator,
  Button,
} from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import Item from "../../Utils/Item";
import APIs, { endpoints } from "../../configs/APIs";
import Swiper from "react-native-swiper";
import RenderHTML from "react-native-render-html";
import { isCloseToBottom } from "../../Utils/Utils";

const PostAccommodations = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);

  const loadPostAccomodations = async () => {
    setLoading(true);
    if (page > 0) {
      let url = `${endpoints["post_accomodations"]}?page=${page}&pending_status=APR`;
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
        console.log(page);
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    loadPostAccomodations();
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
              {posts.map((p) =>
                p ? (
                  <TouchableOpacity
                    style={[MyStyle.top, MyStyle.border]}
                    key={p.id}
                    onPress={() =>
                      navigation.navigate("PostAccommodationDetails", {
                        postId: p.id,
                      })
                    }
                  >
                    <Item instance={p} />
                  </TouchableOpacity>
                ) : null
              )}
            </>
          )}
        </View>
        {loading && page > 1 && <ActivityIndicator />}
      </ScrollView>
    </View>
  );
};

export default PostAccommodations;
