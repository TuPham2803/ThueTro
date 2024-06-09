import React, { useContext, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Button, List, Avatar, Title, Chip } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import MyStyle from "../../styles/MyStyle";

const Profile = ({ navigation }) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  console.log("User", user);

  return (
    <View
      style={[
        MyStyle.container,
        MyStyle.center,
        MyStyle.paddingVertical,
        MyStyle.marginDistantSide,
        { justifyContent: "space-between", paddingVertical: 20 },
      ]}
    >
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        {user && user.image ? (
          <Avatar.Image
            size={120}
            source={{ uri: user.image }}
            style={{ marginBottom: 10 }}
          />
        ) : (
          <Avatar.Icon size={120} icon="account" style={{ marginBottom: 10 }} />
        )}
        <Title style={{ color: "purple" }}>
          {user ? user.username : "Username"}
        </Title>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <List.Section>
            <List.Item
              title="First Name"
              description={user ? user.first_name : "First Name"}
              titleStyle={{ color: "purple" }}
              descriptionStyle={{ color: "purple" }}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
            <List.Item
              title="Last Name"
              description={user ? user.last_name : "Last Name"}
              titleStyle={{ color: "purple" }}
              descriptionStyle={{ color: "purple" }}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
            <List.Item
              title="Email"
              description={user ? user.email : "Email"}
              titleStyle={{ color: "purple" }}
              descriptionStyle={{ color: "purple" }}
              left={(props) => <List.Icon {...props} icon="email" />}
            />
            <List.Item
              title="User Type"
              description={user ? user.user_type : "User Type"}
              titleStyle={{ color: "purple" }}
              descriptionStyle={{ color: "purple" }}
              left={(props) => <List.Icon {...props} icon="account-group" />}
            />
          </List.Section>
        </View>
      </View>

      <View>
        {user && user.username !== "current-user" && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <List.Icon icon="account-multiple" />
            <Text style={{ marginRight: 10 }}>Followers:</Text>
            <Chip>{user.followersCount}</Chip>
          </View>
        )}

        <View
          style={[
            MyStyle.row_button,
            MyStyle.margin,
            MyStyle.marginDistantSide,
          ]}
        >
          <Button
            icon="account-cog"
            mode="contained"
            onPress={() => {
              navigation.navigate("EditProfile");
            }}
          >
            Chỉnh sửa Profile
          </Button>

          <Button
            icon="heart"
            mode="contained"
            onPress={() => console.log("Favorite Posts Pressed")}
          >
            Bài đăng yêu thích
          </Button>
        </View>

        <Button
          mode="contained"
          onPress={() => {
            dispatch({ type: "logout" });
            navigation.navigate("Home");
          }}
        >
          Logout
        </Button>
      </View>
    </View>
  );
};

export default Profile;
