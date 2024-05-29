import { ActivityIndicator, List, Text } from "react-native-paper";
import moment from "moment";
import { Image, View, useWindowDimensions } from "react-native";
import MyStyle from "../styles/MyStyle";
import { RenderHTML } from "react-native-render-html";
import { useEffect, useState } from "react";
import APIs, { endpoints } from "../configs/APIs";
import { htmlToText } from "html-to-text";

const ItemPostRequest = ({ instance }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadUser = async () => {
    setLoading(true);
    try {
      let res = await APIs.get(endpoints["user-details"](instance.user_post));
      setUser(res.data);
    } catch (ex) {
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <List.Item
      style={MyStyle.margin}
      titleStyle={MyStyle.header}
      title={
        instance.description ? (
          <Text style={MyStyle.header}>{htmlToText(instance.description)}</Text>
        ) : (
          "No description available"
        )
      }
      description={
        <View style={{ flexDirection: "column" }}>
          {instance.district && instance.city ? (
            <Text>
              {instance.district}, {instance.city}
            </Text>
          ) : null}
          {instance.created_at ? (
            <Text>{moment(instance.created_at).fromNow()}</Text>
          ) : null}
        </View>
      }
      left={() =>
        user ? (
          <Image style={MyStyle.avatar} source={{ uri: user.image }} />
        ) : null
      }
      right={() => (
        <View style={[{ justifyContent: "flex-end", alignItems: "flex-end" }]}>
          <View style={[MyStyle.row, MyStyle.margin, MyStyle.alignCenter]}>
            <View style={[MyStyle.marginDistantSide, MyStyle.row]}>
              <List.Icon icon="heart-outline" />
              <Text>12</Text>
            </View>
            <View style={[MyStyle.marginDistantSide, MyStyle.row]}>
              <List.Icon icon="comment-outline" />
              <Text>12</Text>
            </View>
          </View>
        </View>
      )}
    />
  );
};

export default ItemPostRequest;
