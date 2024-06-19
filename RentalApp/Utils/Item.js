import { List, Text } from "react-native-paper";
import moment from "moment";
import { Image, View, useWindowDimensions } from "react-native";
import MyStyle from "../styles/MyStyle";
import { RenderHTML } from "react-native-render-html";
import { formatCurrency } from "./Utils";

const Item = ({ instance }) => {
  return (
    instance && (
      <View style={MyStyle.post_accomodations}>
        <Image
          style={MyStyle.post_thumbnail}
          source={{ uri: instance.main_image }}
          resizeMode="stretch"
        />

        <List.Item
          title={
            <View
              style={[MyStyle.marginDistantSide, { flexDirection: "column" }]}
            >
              <Text style={[MyStyle.header, { color: "black" }]}>
                {instance.title}
              </Text>
              <Text>{formatCurrency(instance.price)}đ/Tháng</Text>
              <Text>
                {instance.district}, {instance.city}
              </Text>
              <Text>{moment(instance.created_at).fromNow()}</Text>
            </View>
          }
          // right={() => (
          //   <View style={{ justifyContent: "flex-end" }}>
          //     <View style={[MyStyle.row, MyStyle.margin, MyStyle.alignCenter]}>
          //       <View style={[MyStyle.row, MyStyle.marginDistantSide]}>
          //         <List.Icon icon="heart-outline" />
          //         <Text>12</Text>
          //       </View>
          //       <View style={MyStyle.row}>
          //         <List.Icon icon="comment-outline" />
          //         <Text>12</Text>
          //       </View>
          //     </View>
          //   </View>
          // )}
        />
      </View>
    )
  );
};

export default Item;
