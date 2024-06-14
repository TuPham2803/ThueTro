import React, { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import MyStyle from "../../styles/MyStyle";
import { ActivityIndicator, Card, List } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import { htmlToText } from "html-to-text";
import { MyUserContext } from "../../configs/Contexts";

//them room type va dien tich va thoi gian dang bai
//them chat, them nut like
const PostRequestDetails = ({ route }) => {
  const [post, setPost] = React.useState(null);
  const [comment, setComment] = React.useState("");
  const [comments, setComments] = React.useState([]);
  const postId = route.params?.postId;
  const user = useContext(MyUserContext);

  const loadPost = async () => {
    try {
      let res = await APIs.get(endpoints["post_request_details"](postId));
      setPost(res.data);
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

  const sendComment = async () => {
    try {
      let res = await APIs.post(endpoints["comments"](postId), {
        content: newComment,
        user: user.id,
      });
      setComments([res.data, ...comments]);
      setComment("");
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
            {comments === null ? (
              <ActivityIndicator />
            ) : (
              <>
                <View style={[MyStyle.container, MyStyle.margin]}>
                  <Text
                    style={MyStyle.title}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {htmlToText(post.description) || "No title available"}
                  </Text>
                  <View style={[MyStyle.container, MyStyle.top]}>
                    <Text style={MyStyle.header}>Khu vực mong muốn</Text>
                    <Text style={[MyStyle.subject, MyStyle.marginDistantSide]}>
                      <List.Icon color="blue" icon="map-marker-outline" />
                      {post.district}, {post.city}
                    </Text>
                    <Text style={MyStyle.header}>Khoảng giá cần tìm</Text>
                    <Text style={[MyStyle.subject, MyStyle.marginDistantSide]}>
                      <List.Icon color="green" icon="cash" />
                      {post.min_price} - {post.max_price} triệu/tháng
                    </Text>
                    <Text style={MyStyle.header}>Số lượng người ở</Text>
                    <Text style={[MyStyle.subject, MyStyle.marginDistantSide]}>
                      <List.Icon color="pink" icon="account" />
                      {post.quanity} người
                    </Text>
                    <Text style={MyStyle.header}>Loại phòng</Text>
                    <Text style={[MyStyle.subject, MyStyle.marginDistantSide]}>
                      <List.Icon color="cyan" icon="home" />
                      {post.room_type === "SH" ? "Trọ chung" : "Trọ riêng"}
                    </Text>
                  </View>
                </View>

                <Text style={MyStyle.header}>Bình luận</Text>
                {user !== null ? (
                  <>
                    <TextInput
                      style={MyStyle.input}
                      placeholder="Add a comment..."
                      onChangeText={(text) => setComment(text)}
                      value={comment}
                    />
                    <Button
                      style={{ color: "purple" }}
                      title="Submit"
                      onPress={sendComment}
                    />
                  </>
                ) : null}
                {comment ? (
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
                ) : (
                  <>
                    <Text style={[MyStyle.subject, MyStyle.marginDistantSide]}>
                      Chưa có bình luận nào!
                    </Text>
                  </>
                )}
              </>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};
export default PostRequestDetails;
