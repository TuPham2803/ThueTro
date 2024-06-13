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
  Icon,
} from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import Item from "../../Utils/Item";
import APIs, { endpoints } from "../../configs/APIs";
import Swiper from "react-native-swiper";
import RenderHTML from "react-native-render-html";
import { isCloseToBottom } from "../../Utils/Utils";
import { min } from "moment";

// hien thi
const PostAccommodations = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const minPrice = route.params?.data?.minPrice || 0;
  const maxPrice = route.params?.data?.maxPrice || 200000;
  const city = route.params?.data?.city || "";
  const district = route.params?.data?.district || "";
  const maxPeople = route.params?.data?.maxPeople || 0;
  const currentPeople = route.params?.data?.currentPeople || 90000;

  const loadPostAccomodations = async () => {
    setLoading(true);
    if (page > 0) {
      let url = `${endpoints["post_accomodations"]}?page=${page}&pending_status=APR&min_price=${minPrice}&max_price=${maxPrice}&city=${city}&district=${district}&max_people=${maxPeople}&current_people=${currentPeople}`;
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
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setPage(1);
    loadPostAccomodations();
  }, [minPrice, maxPrice, city, district, maxPeople, currentPeople]);

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
      <View
        style={[MyStyle.row, MyStyle.margin, { justifyContent: "flex-end" }]}
      >
        <Searchbar
          style={{ width: "90%" }}
          placeholder="Search"
          onChangeText={setQ}
          value={q}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Sort")}
          style={{
            width: "10%",
            backgroundColor: "pink",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <Icon
            source="sort"
            size={20}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: [{ translateY: -12 }],
            }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView onScroll={loadMore}>
        <View style={[MyStyle.container, MyStyle.margin]}>
          {posts === null ? (
            <ActivityIndicator />
          ) : (
            <>
              {posts.map((p) =>
                p ? (
                  <TouchableOpacity
                    style={[MyStyle.top, MyStyle.post_accomodations]}
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
