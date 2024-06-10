import { List, Text } from "react-native-paper";
import moment from "moment";
import { Image, View, useWindowDimensions } from "react-native";
import MyStyle from "../styles/MyStyle";
import { RenderHTML } from "react-native-render-html";

const Item = ({ instance }) => {
  return (
    instance && (
      <View>
        <Image
          style={MyStyle.post_thumbnail}
          source={{ uri: instance.images[0] }}
          resizeMode="stretch"
        />

        <List.Item
          left={() => (
            <View
              style={[MyStyle.marginDistantSide, { flexDirection: "column" }]}
            >
              <Text style={MyStyle.header}>{instance.title}</Text>
              <Text>{instance.price} đ/Tháng</Text>
              <Text>
                {instance.district}, {instance.city}
              </Text>
              <Text>{moment(instance.created_at).fromNow()}</Text>
            </View>
          )}
          right={() => (
            <View style={{ justifyContent: "flex-end" }}>
              <View style={[MyStyle.row, MyStyle.margin, MyStyle.alignCenter]}>
                <View style={MyStyle.row}>
                  <List.Icon icon="heart-outline" />
                  <Text>12</Text>
                </View>
                <View style={MyStyle.row}>
                  <List.Icon icon="comment-outline" />
                  <Text>12</Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      // <List.Item
      //   style={MyStyle.margin}
      //   title={
      //     <Text numberOfLines={null} style={MyStyle.header}>
      //       {instance.title}
      //     </Text>
      //   }
      //   titleStyle={MyStyle.header}
      //   description={
      //     <View style={{ flexDirection: "column" }}>
      //       {instance.price ? <Text>{instance.price} đ/Tháng</Text> : null}
      //       {instance.district && instance.city ? (
      //         <Text>
      //           {instance.district}, {instance.city}
      //         </Text>
      //       ) : null}
      //       {instance.created_at ? (
      //         <Text>{moment(instance.created_at).fromNow()}</Text>
      //       ) : null}
      //     </View>
      //   }
      //   left={() =>
      //     instance.images && instance.images.length > 0 ? (
      //       <Image
      //         style={MyStyle.post_thumbnail}
      //         source={{ uri: instance.images[0] }}
      //         resizeMode="stretch"
      //       />
      //     ) : null
      //   }
      //   right={() => (
      //     <View
      //       style={[{ justifyContent: "flex-end", alignItems: "flex-end" }]}
      //     >
      //       <View style={[MyStyle.row, MyStyle.margin, MyStyle.alignCenter]}>
      //         <View style={[MyStyle.marginDistantSide, MyStyle.row]}>
      //           <List.Icon icon="heart-outline" />
      //           <Text>12</Text>
      //         </View>
      //         <View style={[MyStyle.marginDistantSide, MyStyle.row]}>
      //           <List.Icon icon="comment-outline" />
      //           <Text>12</Text>
      //         </View>
      //       </View>
      //     </View>
      //   )}
      // />
    )
  );
};

export default Item;
