import React, { useContext } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import { Button, Card, Icon, List, TextInput } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import APIs, { endpoints } from "../../configs/APIs";
import RenderHTML from "react-native-render-html";
import Swiper from "react-native-swiper";
import { isCloseToBottom } from "../../Utils/Utils";
import moment from "moment";
import { MyUserContext } from "../../configs/Contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostAccommodationDetails = ({ route }) => {
  const [post, setPost] = React.useState(null);
  const [comments, setComments] = React.useState(null);
  const [newComment, setNewComment] = React.useState(null);
  const postId = route.params?.postId;
  const ENUM_OBJECT = {
    PR: "Nguyên căn",
    SH: "Phòng trọ",
  };
  const windowWidth = useWindowDimensions().width;
  const user = useContext(MyUserContext);

  const loadPost = async () => {
    try {
      let res = await APIs.get(endpoints["post_accomodation_details"](postId));
      setPost(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const loadComments = async () => {
    try {
      let res = await APIs.get(endpoints["comments"](postId));
      setComments(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  React.useEffect(() => {
    loadPost();
  }, [postId]);

  const loadMoreInfo = ({ nativeEvent }) => {
    if (!comments && isCloseToBottom(nativeEvent)) {
      loadComments();
    }
  };

  const comment = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem("token");

      // Include the token in the Authorization header
      let res = await APIs.post(
        endpoints["comments"](postId),
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

  return (
    <View style={[MyStyle.container, MyStyle.margin]}>
      {post === null ? (
        <ActivityIndicator />
      ) : (
        <>
          <ScrollView onScroll={loadMoreInfo}>
            <View style={[MyStyle.top, MyStyle.wrapper]}>
              <Swiper style={MyStyle.wrapper} showsButtons={false}>
                {post.images.map((image, index) => (
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
            <Card style={MyStyle.top}>
              <Text
                style={[MyStyle.title, MyStyle.marginDistantSide]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {post.title}
              </Text>
              <Card.Content>
                <Text>{post.price} đ/tháng</Text>
                <Text>
                  {post.address}, Quận {post.district}, {post.city}
                </Text>
                <Text>{post.phone_number}</Text>
              </Card.Content>
            </Card>

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
                    <List.Icon color="purple" icon="map" />
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
                    <List.Icon color="purple" icon="account" />
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
                    <List.Icon color="purple" icon="account-multiple" />
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
                    <List.Icon color="purple" icon="home" />
                    <Text>Loại nhà trọ</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {ENUM_OBJECT[post.room_type]}
                    </Text>
                  </View>
                </View>
                <Text style={MyStyle.header}>Tin đối tác</Text>
                <Text style={MyStyle.subject}>
                  {" "}
                  Các tin đăng của chủ nhà đối tác với ứng dụng được hiển thị
                  nổi bật, uy tín hơn với các chủ nhà thường để giúp bạn an tâm
                  hơn khi thuê phòng với trải nghiệm trên ứng dụng
                </Text>
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
                      style={{ color: "purple" }}
                      title="Submit"
                      onPress={comment}
                    />
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
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default PostAccommodationDetails;
