import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button, IconButton, Card, List, Avatar } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import MyStyle from "../../styles/MyStyle";

const Profile = ({ navigation }) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  return (
    <View style={[MyStyle.container, MyStyle.center, MyStyle.marginDistantSide, MyStyle.col, {justifyContent: "space-between"}]}>
      <View>
        <List.Section>
          <List.Item
            title="Username"
            description={user ? user.username : "KhaTu"}
            titleStyle={{ color: "purple" }}
            descriptionStyle={{ color: "purple" }}
            left={(props) => <List.Icon {...props} icon="account" />}
            right={() =>
              user && user.avatar ? (
                <Avatar.Image
                  size={40}
                  source={{ uri: user.avatar }}
                  style={{ marginRight: 10 }}
                />
              ) : null
            }
          />
          <List.Item
            title="Email"
            description={user ? user.email : "PhamTu"}
            titleStyle={{ color: "purple" }}
            descriptionStyle={{ color: "purple" }}
            left={(props) => <List.Icon {...props} icon="email" />}

          />
          <List.Item
            title="Phone Number"
            description={user ? user.phone : "09090909"}
            titleStyle={{ color: "purple" }}
            descriptionStyle={{ color: "purple" }}
            left={(props) => <List.Icon {...props} icon="phone" />}
          />
          <List.Item
            title="Address"
            description={user ? user.address : "BinhTan/A"}
            titleStyle={{ color: "purple" }}
            descriptionStyle={{ color: "purple" }}
            left={(props) => <List.Icon {...props} icon="map" />}
          />
          <List.Item
            title="User Type"
            description={user ? user.user_type : "Nguoi Thue"}
            titleStyle={{ color: "purple" }}
            descriptionStyle={{ color: "purple" }}
            left={(props) => <List.Icon {...props} icon="account-group" />}
          />
        </List.Section>
      </View>
      <View>
        {/* if not current user profile then show a follow button */}
        {user && user.username !== "current-user" && (
          <Button mode="contained" style={[MyStyle.button, MyStyle.margin]}>
            Follow
          </Button>
        )}

        {/* Thêm nút "Quản lý bài đăng" */}
        <View style={[MyStyle.row_button, MyStyle.margin, MyStyle.marginDistantSide]}>
          <Button
            icon="account-cog"
            mode="contained"
            onPress={() => console.log("Manage Posts Pressed")}
          // style={[MyStyle.button, MyStyle.margin]}
          >
            Quản lý bài đăng
          </Button>

          <Button
            icon="heart"
            mode="contained"
            onPress={() => console.log("Favorite Posts Pressed")}
          // style={[MyStyle.button, MyStyle.margin]}
          >
            Bài đăng yêu thích
          </Button>
        </View>

        {/* Thêm nút "Logout" */}
        <Button
          mode="contained"
          onPress={() => {
            dispatch({ type: "logout" });
            navigation.navigate("Home");
          }}
        // style={[MyStyle.button, MyStyle.margin]}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

export default Profile;
