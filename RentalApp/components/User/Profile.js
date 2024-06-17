import React, { useContext, useState, useEffect } from "react";
import { View } from "react-native";
import { Button, List, Avatar, Title, Chip } from "react-native-paper";
import { MyDispatchContext, MyUserContext } from "../../configs/Contexts";
import MyStyle from "../../styles/MyStyle";
import { ColorAssets } from "../../assest/ColorAssets";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  return (
    <View
      style={[
        MyStyle.container,
        MyStyle.center,
        MyStyle.paddingVertical,
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
        <Title>{user ? user.username : "Username"}</Title>
        <View style={{ width: "100%", marginBottom: 20 }}>
          <List.Section>
            <List.Section style={MyStyle.row}>
              <List.Item
                title="First Name"
                description={user ? user.first_name : "First Name"}
                titleStyle={{ color: ColorAssets.content.title }}
                descriptionStyle={{ fontSize: 18 }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="account"
                    color={ColorAssets.content.icon}
                  />
                )}
              />
              <List.Item
                title="Last Name"
                description={user ? user.last_name : "Last Name"}
                titleStyle={{ color: ColorAssets.content.title }}
                descriptionStyle={{ fontSize: 18 }}
              />
            </List.Section>
            <List.Item
              title="Email"
              description={user ? user.email : "Email"}
              titleStyle={{ color: ColorAssets.content.title }}
              descriptionStyle={{ fontSize: 18 }}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="email"
                  color={ColorAssets.content.icon}
                />
              )}
            />
            <List.Item
              title="User Type"
              description={user ? user.user_type : "User Type"}
              titleStyle={{ color: ColorAssets.content.title }}
              descriptionStyle={{ fontSize: 18 }}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="account-group"
                  color={ColorAssets.content.icon}
                />
              )}
            />
          </List.Section>
        </View>
      </View>

      <View>
        <Button
          style={[MyStyle.margin, MyStyle.button]}
          icon="account-cog"
          mode="contained"
          onPress={() => {
            navigation.navigate("EditProfile");
          }}
        >
          Chỉnh sửa Profile
        </Button>
        <Button
          style={[MyStyle.margin, MyStyle.button]}
          icon="logout"
          mode="contained"
          onPress={async () => {
            await AsyncStorage.removeItem("token");
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
