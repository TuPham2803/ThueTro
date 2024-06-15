import React, { useEffect, useCallback, useState, useContext } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { IconButton, Searchbar, ActivityIndicator } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import APIs, { endpoints } from "../../configs/APIs";
import ItemPostRequest from "../../Utils/ItemPostRequest";
import { MyUserContext } from "../../configs/Contexts";
import { ColorAssets } from "../../assest/ColorAssets";
const ListPostRequest = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const user = useContext(MyUserContext);

  const loadPostRequests = async () => {
    try {
      const res = await APIs.get(`${endpoints["post_requests"]}?user_post=${user.id}&q=${q}`);
      setPosts(res.data.results || []);
    } catch (ex) {
      console.error(ex);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPostRequests();
    }, [q])
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="plus"
          iconColor={ColorAssets.content.text}
          size={30}
          onPress={() => navigation.navigate("CreatePostRequest")}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={[MyStyle.container]}>
      {/* <Searchbar placeholder="Search" onChangeText={setQ} value={q} /> */}
      <ScrollView>
        <View style={[MyStyle.container, MyStyle.margin]}>
          {posts.length === 0 ? (
            <ActivityIndicator />
          ) : (
            posts.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() =>
                  navigation.navigate("UpdatePostRequest", { post: p })
                }
              >
                <ItemPostRequest instance={p} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ListPostRequest;
