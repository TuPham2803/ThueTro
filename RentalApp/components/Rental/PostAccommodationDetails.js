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
import { Button, Card, List, TextInput } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import APIs, { endpoints } from "../../configs/APIs";
import RenderHTML from "react-native-render-html";
import SwiperFlatList from "react-native-swiper-flatlist";
import { isCloseToBottom } from "../../Utils/Utils";
import moment from "moment";
import { MyUserContext } from "../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorAssets } from "../../assets/ColorAssets";
import ImageViewing from "react-native-image-viewing";

const PostAccommodationDetails = ({ route }) => {
  const { post } = route.params;
  console.log(post.user_post);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [selectIndex, setSelectIndex] = useState(0);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const windowWidth = useWindowDimensions().width;
  const user = useContext(MyUserContext);
  const ENUM_OBJECT = {
    PR: "Nguyên căn",
    SH: "Phòng trọ",
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
                  onPress={() => scrollToIndex(index)} // Call scrollToIndex on press
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
            <View style={{ paddingHorizontal: 10 }}>
              <Card style={MyStyle.top}>
                <Card.Content>
                  <View
                    style={[
                      MyStyle.container,
                      MyStyle.row,
                      MyStyle.marginDistantSide,
                      { justifyContent: "space-between" },
                    ]}
                  >
                    <View
                      style={[
                        MyStyle.margin,
                        MyStyle.alignCenter,
                        MyStyle.container,
                      ]}
                    >
                      <List.Icon color={ColorAssets.content.icon} icon="map" />
                      <Text>Diện tích</Text>
                      <Text style={{ fontWeight: "bold" }}>{post.acreage}</Text>
                    </View>
                    <View
                      style={[
                        MyStyle.margin,
                        MyStyle.alignCenter,
                        MyStyle.container,
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
                    <View
                      style={[
                        MyStyle.margin,
                        MyStyle.alignCenter,
                        MyStyle.container,
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
                        MyStyle.container,
                      ]}
                    >
                      <List.Icon color={ColorAssets.content.icon} icon="home" />
                      <Text>Loại nhà trọ</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {ENUM_OBJECT[post.room_type]}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
              <Card style={MyStyle.top}>
                <Card.Title
                  title={post.title}
                  titleStyle={[MyStyle.title, MyStyle.marginDistantSide]}
                  subtitle={`${post.price} đ/tháng`}
                  subtitleStyle={MyStyle.subtitle} // Optional: Add a subtitle style
                  titleNumberOfLines={1}
                  titleEllipsizeMode="tail"
                />
                <Card.Content>
                  <Text>Giá tiền: {post.price} đ/tháng</Text>
                  <Text>
                    Địa chỉ: {post.address}, Quận {post.district}, {post.city}
                  </Text>
                  <Text>SĐT: {post.phone_number}</Text>
                </Card.Content>
              </Card>
              <Card style={MyStyle.top}>
                <Card.Content>
                  <Text style={MyStyle.header}>Mô tả</Text>
                  <RenderHTML
                    contentWidth={windowWidth}
                    originWhitelist={["*"]}
                    source={{ html: post.description }}
                  />
                </Card.Content>
              </Card>
              <Card style={MyStyle.top}>
                <Card.Content>
                  {user !== null ? (
                    <>
                      <TextInput
                        style={MyStyle.input}
                        placeholder="Add a comment..."
                        onChangeText={(text) => setNewComment(text)}
                        value={newComment}
                      />
                      <Button
                        style={[MyStyle.button, MyStyle.top]}
                        onPress={comment}
                      >
                        Submit
                      </Button>
                    </>
                  ) : null}

                  {comments === null ? (
                    <ActivityIndicator />
                  ) : (
                    <>
                      <Text style={MyStyle.header}>Bình luận</Text>
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
