import { ActivityIndicator, List, Text, Icon } from "react-native-paper";
import moment from "moment";
import { View, useWindowDimensions } from "react-native";
import MyStyle from "../styles/MyStyle";
import { useEffect, useState } from "react";
import APIs, { endpoints } from "../configs/APIs";
import { htmlToText } from "html-to-text";
import { ColorAssets } from "../assest/ColorAssets";
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
          <Text style={MyStyle.header}>{instance.title}</Text>
        ) : (
          "No description available"
        )
      }
      description={
        <View style={{ flexDirection: "column" }}>
          {instance.district && instance.city ? (
            <Text>
              <Icon
                source="map-marker"
                size={20}
                color={ColorAssets.content.icon}
              />
              {instance.district}, {instance.city}
            </Text>
          ) : null}

          <Text>
            <Icon
              source="currency-usd"
              size={20}
              color={ColorAssets.content.icon}
            />
            ${instance.min_price.toLocaleString()} - {instance.max_price.toLocaleString()}
          </Text>
        </View>
      }
      right={() => (
        <View style={[{ justifyContent: "flex-end", alignItems: "flex-end" }]}>
          <Text>{moment(instance.created_at).fromNow()}</Text>
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
