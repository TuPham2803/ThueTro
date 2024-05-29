import React from "react";
import {
  View,
  Text,
  useWindowDimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { Button, Card, List } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import APIs, { endpoints } from "../../configs/APIs";
import RenderHTML from "react-native-render-html";
import Swiper from "react-native-swiper";

const PostAccommodationDetails = ({ route }) => {
  const [post, setPost] = React.useState(null);
  const [comments, setComments] = React.useState(null);
  const postId = route.params?.postId;
  const { width } = useWindowDimensions();

  const loadPost = async () => {
    try {
      let res = await APIs.get(endpoints["post_accomodation_details"](postId));
      setPost(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  React.useEffect(() => {
    loadPost();
  }, [postId]);

  return (
    <View style={[MyStyle.container, MyStyle.margin, MyStyle.top]}>
      {post === null ? (
        <ActivityIndicator />
      ) : (
        <>
          <Card>
            <Card.Title titleStyle={MyStyle.header} title={post.title} />

            {/* <Card.Cover source={{ uri: post.images[0] }} /> */}

            <View style={[MyStyle.top, MyStyle.wrapper, MyStyle.margin]}>
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

            <Card.Content style={MyStyle.margin}>
              <RenderHTML
                contentWidth={width}
                source={{ html: post.description }}
              />
            </Card.Content>
          </Card>
        </>
      )}
    </View>
  );
};

export default PostAccommodationDetails;
