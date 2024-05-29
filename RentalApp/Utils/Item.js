import { List, Text } from "react-native-paper";
import moment from "moment";
import { Image, View, useWindowDimensions } from "react-native";
import MyStyle from "../styles/MyStyle";
import { RenderHTML } from "react-native-render-html";

const Item = ({ instance }) => {
  const windowWidth = useWindowDimensions().width;
  const limitedDescription = instance.description
    ? instance.description.substring(0, 20)
    : "";

  return (
    <List.Item
      style={MyStyle.margin}
      title={instance.title}
      titleStyle={MyStyle.header}
      description={
        <View style={{ flexDirection: "column" }}>
          {instance.description ? (
            <RenderHTML
              contentWidth={windowWidth}
              originWhitelist={["*"]}
              source={{ html: limitedDescription }}
            />
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
