import { useContext } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import MyStyle from "../../styles/MyStyle";

const Profile = ({ navigation }) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  return (
    <View style={[MyStyle.container, MyStyle.center]}>
      <Text style={[MyStyle.title]}>Profile</Text>
      <Text style={[MyStyle.text]}>
        {user ? user.username : "You are not logged in"}
      </Text>
      {/* if not current user profile then show a follow button */}
      {user && user.username !== "current-user" && (
        <Button mode="contained" style={[MyStyle.button, MyStyle.margin]}>
          Follow
        </Button>
      )}
      <Button
        mode="contained"
        onPress={() => {
          dispatch({ type: "logout" });
          navigation.navigate("Home");
        }}
        style={[MyStyle.button, MyStyle.margin]}
      >
        Logout
      </Button>
    </View>
  );
};

export default Profile;
