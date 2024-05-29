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
      right={() => <List.Icon icon="arrow-right" />}
    />
  );
};

export default Item;
