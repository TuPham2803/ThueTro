import { List } from "react-native-paper";
import moment from "moment";
import { Image } from "react-native";
import MyStyle from "../styles/MyStyle";

const Item = ({ instance }) => {
  return (
    <List.Item
      style={MyStyle.margin}
      title={instance.title}
      description={
        instance.created_date ? moment(instance.created_date).fromNow() : ""
      }
      left={() => (
        <Image style={MyStyle.avatar} source={{ uri: instance.image }} />
      )}
    />
  );
};

export default Item;
