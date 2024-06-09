import { List, Text } from "react-native-paper";
import moment from "moment";
import { Image, View, useWindowDimensions } from "react-native";
import MyStyle from "../styles/MyStyle";
import { RenderHTML } from "react-native-render-html";

const Item = ({ instance }) => {
  return (
    <List.Item
      style={MyStyle.margin}
      title={
        <Text numberOfLines={null} style={MyStyle.header}>
          {instance.title}
        </Text>
      }
      titleStyle={MyStyle.header}
      description={
        <View style={{ flexDirection: "column" }}>
          {/* {instance.price ? <Text>{instance.price} đ/Tháng</Text> : null} */}
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
        instance.images && instance.images.length > 0 ? (
          <Image style={MyStyle.avatar} source={{ uri: instance.images[0] }} />
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

export default Item;
