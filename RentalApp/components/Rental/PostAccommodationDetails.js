import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Button, Card, List, TextInput, IconButton } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import APIs, { endpoints } from "../../configs/APIs";
import RenderHTML from "react-native-render-html";
import SwiperFlatList from "react-native-swiper-flatlist";
import { isCloseToBottom } from "../../Utils/Utils";
import moment from "moment";
import { MyUserContext } from "../../configs/Contexts";
import { useNavigation } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorAssets } from "../../assets/ColorAssets";
import ImageViewing from "react-native-image-viewing";

const PostAccommodationDetails = ({ route }) => {
  const { post } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectIndex, setSelectIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const windowWidth = useWindowDimensions().width;
  const user = useContext(MyUserContext);
  const navigation = useNavigation();

  console.log(user.id);
  console.log(post.user_post.id);
  const ENUM_OBJECT = {
    PR: "Ở riêng",
    SH: "Ở ghép",
  };
  const swiperRef = useRef(null); // Ref for SwiperFlatList

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      let res = await APIs.get(endpoints.comments(post.id));
      setComments(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const loadMoreInfo = ({ nativeEvent }) => {
    if (comments.length === 0 && isCloseToBottom(nativeEvent)) {
      loadComments();
    }
  };

  const comment = async () => {
    if (newComment.length === 0) {
      return;
    }
    try {
      const token = await AsyncStorage.getItem("token");

      let res = await APIs.post(
        endpoints.comments(post.id),
        {
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (ex) {
      console.error(ex);
    }
  };

  const scrollToIndex = (index) => {
    setSelectIndex(index);
    swiperRef.current.scrollToIndex({ index }); // Scroll to specific index
  };

  return (
    <View style={[MyStyle.container]}>
      {post === null ? (
        <ActivityIndicator />
      ) : (
        <>
          <ScrollView onScroll={loadMoreInfo}>
            <View style={[MyStyle.wrapper]}>
              <SwiperFlatList
                ref={swiperRef} // Assign ref to SwiperFlatList
                autoplay={false}
                autoplayLoop={false}
                index={0} // Initial index
                showPagination
                paginationStyleItem={{
                  width: 10,
                  height: 10,
                  marginHorizontal: 5,
                }}
                onChangeIndex={({ index }) => setSelectIndex(index)}
                data={[post.main_image, ...post.images]}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={MyStyle.slide}
                    onPress={() => {
                      setImageViewVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: item }}
                      style={MyStyle.image}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Horizontal list of images */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={MyStyle.horizontalScroll}
              style={[MyStyle.marginDistantSide]}
            >
              {[post.main_image, ...post.images].map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    MyStyle.horizontalImageContainer,
                    { justifyContent: "center" },
                  ]}
                  onPress={() => scrollToIndex(index)}
                >
                  <Image
                    source={{ uri: image }}
                    style={[
                      MyStyle.horizontalImage,
                      index == selectIndex && {
                        borderColor: ColorAssets.input.borderFocus,
                        borderWidth: 4,
                        width: 135,
                        height: 135,
                      },
                    ]}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <ImageViewing
              images={[post.main_image, ...post.images].map((image) => ({
                uri: image,
              }))}
              imageIndex={selectIndex}
              visible={isImageViewVisible}
              onRequestClose={() => setImageViewVisible(false)}
            />
            <View style={{ paddingHorizontal: 15 }}>
              <Card
                style={[
                  MyStyle.top,
                  { backgroundColor: ColorAssets.input.background },
                ]}
              >
                <Card.Content>
                  <View
                    style={[
                      MyStyle.container,
                      MyStyle.marginDistantSide,
                      { backgroundColor: ColorAssets.input.background },
                    ]}
                  >
                    <View
                      style={[MyStyle.row, { justifyContent: "space-between" }]}
                    >
                      <View
                        style={[
                          MyStyle.margin,
                          MyStyle.alignCenter,
                          { flex: 1 },
                        ]}
                      >
                        <List.Icon
                          color={ColorAssets.content.icon}
                          icon="map"
                        />
                        <Text>Diện tích</Text>
                        <Text style={{ fontWeight: "bold" }}>
                          {post.acreage} m²
                        </Text>
                      </View>
                      <View
                        style={[
                          MyStyle.margin,
                          MyStyle.alignCenter,
                          { flex: 1 },
                        ]}
                      >
                        <List.Icon
                          color={ColorAssets.content.icon}
                          icon="home"
                        />
                        <Text>Loại nhà trọ</Text>
                        <Text style={{ fontWeight: "bold" }}>
                          {ENUM_OBJECT[post.room_type]}
                        </Text>
                      </View>
                    </View>
                    {post.room_type === "SH" && (
                      <View
                        style={[
                          MyStyle.row,
                          { justifyContent: "space-between" },
                        ]}
                      >
                        <View
                          style={[
                            MyStyle.margin,
                            MyStyle.alignCenter,
                            { flex: 1 },
                          ]}
                        >
                          <List.Icon
                            color={ColorAssets.content.icon}
                            icon="account-multiple"
                          />
                          <Text>Số người tối đa</Text>
                          <Text style={{ fontWeight: "bold" }}>
                            {post.max_people}
                          </Text>
                        </View>
                        <View
                          style={[
                            MyStyle.margin,
                            MyStyle.alignCenter,
                            { flex: 1 },
                          ]}
                        >
                          <List.Icon
                            color={ColorAssets.content.icon}
                            icon="account"
                          />
                          <Text>Số người đang ở</Text>
                          <Text style={{ fontWeight: "bold" }}>
                            {post.current_people}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </Card.Content>
              </Card>
              <Card
                style={[
                  MyStyle.top,
                  { backgroundColor: ColorAssets.input.background },
                ]}
              >
                <Card.Content>
                  <Text style={MyStyle.header}>{post.title}</Text>

                  <Text>Giá tiền: {post.price} đ/tháng</Text>
                  <Text>
                    Địa chỉ: {post.address}, Quận {post.district}, {post.city}
                  </Text>
                  <Text>SĐT: {post.phone_number}</Text>
                </Card.Content>
              </Card>

              <Card
                style={[
                  MyStyle.top,
                  { backgroundColor: ColorAssets.input.background },
                ]}
              >
                <Card.Content>
                  <Text style={MyStyle.header}>Mô tả</Text>
                  <RenderHTML
                    contentWidth={windowWidth}
                    originWhitelist={["*"]}
                    source={{ html: post.description }}
                  />
                </Card.Content>
              </Card>
              <Card
                style={[
                  MyStyle.top,
                  { backgroundColor: ColorAssets.input.background },
                ]}
              >
                <Card.Content>
                  <View style={MyStyle.row}>
                    <Image
                      source={{ uri: post.user_post.image }}
                      style={MyStyle.avatar}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={MyStyle.username}>
                        {post.user_post.username}
                      </Text>
                      {post.user_post.id != user.id && (
                        <View style={[MyStyle.row]}>
                          <Button
                            mode="contained"
                            onPress={() => console.log("Follow")}
                            style={[MyStyle.button, { marginRight: 10 }]}
                          >
                            Follow
                          </Button>
                          <Button
                            mode="contained"
                            style={MyStyle.button}
                            onPress={() =>
                              navigation.navigate("ChatHome", {
                                conversationId: null,
                                friendDetails: post.user_post,
                              })
                            }
                          >
                            Chat
                          </Button>
                        </View>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
              <Card
                style={[
                  MyStyle.top,
                  { backgroundColor: ColorAssets.input.background },
                ]}
              >
                <Card.Content>
                  {user !== null ? (
                    <>
                      <Text style={MyStyle.header}>Bình luận</Text>
                      <View style={MyStyle.row}>
                        <TextInput
                          mode="outlined"
                          outlineColor={ColorAssets.input.border}
                          activeOutlineColor={ColorAssets.input.borderFocus}
                          label="Add a comment..."
                          value={newComment}
                          onChangeText={setNewComment}
                          style={[
                            {
                              flex: 1,
                            },
                          ]}
                          disabled={post.pending_status === "FL"}
                        />
                        <IconButton
                          icon="send"
                          iconColor={ColorAssets.button.text}
                          size={28}
                          onPress={comment}
                          style={[
                            { backgroundColor: ColorAssets.button.background },
                          ]}
                        />
                      </View>
                    </>
                  ) : null}

                  {comments === null ? (
                    <ActivityIndicator />
                  ) : (
                    <>
                      {comments.map((c) => (
                        <List.Item
                          key={c.id}
                          style={MyStyle.margin}
                          title={c.content}
                          description={moment(c.created_date).fromNow()}
                          left={() => (
                            <Image
                              style={MyStyle.avatar}
                              source={{ uri: c.user.image }}
                            />
                          )}
                        />
                      ))}
                    </>
                  )}
                </Card.Content>
              </Card>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default PostAccommodationDetails;
