import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Rental/Home";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import { useContext, useReducer } from "react";
import { MyUserReducer } from "./configs/Reducer";
import { MyDispatchContext, MyUserContext } from "./configs/Contexts";
import Profile from "./components/User/Profile";
import React from "react";
import CreatePostAccommodation from "./components/Rental/CreatePostAccommodation";
import CreatePostRequest from "./components/Rental/CreatePostRequest";
import PostAccommodations from "./components/Rental/PostAccomodations";
import PostAccommodationDetails from "./components/Rental/PostAccommodationDetails";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import ListPostAccommodation from "./components/Rental/ListPostAccommodation";
import ListPostRequest from "./components/Rental/ListPostRequest";
import UpdatePostAccommodation from "./components/Rental/UpdatePostAccommodation";
import UpdatePostRequest from "./components/Rental/UpdatePostRequest";
import PostRequests from "./components/Rental/PostRequests";
import PostRequestDetails from "./components/Rental/PostRequestDetails";
import EditProfile from "./components/User/EditProfile";
import Conversation from "./components/Rental/Conversation";
import Chat from "./components/Rental/Chat";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ title: "Home" }} />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="PostAccommodations"
        component={PostAccommodations}
        options={{ title: "Bài đăng cho thuê nhà" }}
      />
      <Stack.Screen
        name="PostAccommodationDetails"
        component={PostAccommodationDetails}
        options={{ title: "Chi tiết bài đăng" }}
      />
      <Stack.Screen
        name="PostRequests"
        component={PostRequests}
        options={{ title: "Bài đăng tìm kiếm nhà" }}
      />
      <Stack.Screen
        name="PostRequestDetails"
        component={PostRequestDetails}
        options={{ title: "Chi tiết bài đăng" }}
      />
      <Stack.Screen
        name="CreatePostAccommodation"
        component={CreatePostAccommodation}
        options={{ title: "Tạo bài đăng" }}
      />
    </Stack.Navigator>
  );
};

const PostManagerStack = () => {
  const user = useContext(MyUserContext);

  return (
    <Stack.Navigator>
      {user.user_type == "landlord" ? (
        <>
          <Stack.Screen
            name="ListPostAccommodation"
            component={ListPostAccommodation}
            options={{ title: "Danh sách bài đăng" }}
          />
          <Stack.Screen
            name="UpdatePostAccommodation"
            component={UpdatePostAccommodation}
            options={{ title: "Chỉnh sửa bài đăng" }}
          />
          <Stack.Screen
            name="CreatePostAccommodation"
            component={CreatePostAccommodation}
            options={{ title: "Đăng tin cho thuê" }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="ListPostRequest"
            component={ListPostRequest}
            options={{ title: "Danh sách bài đăng" }}
          />
          <Stack.Screen
            name="UpdatePostRequest"
            component={UpdatePostRequest}
            options={{ title: "Chỉnh sửa bài đăng" }}
          />
          <Stack.Screen
            name="CreatePostRequest"
            component={CreatePostRequest}
            options={{ title: "Đăng tin tìm phòng" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
const MessageStack = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Conversation"
        component={Conversation}
        options={{ title: "Cuộc trò chuyện" }}
      />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const user = useContext(MyUserContext);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          if (routeName === "Chat" || routeName === "CreatePostRequest") {
            return { display: "none" };
          }
          return {};
        })(route),
        tabBarOptions: { activeTintColor: "purple" },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: "Home",
          tabBarIcon: () => <Icon size={30} color="purple" source="home" />,
        }}
      />
      {user === null ? (
        <>
          <Tab.Screen
            name="Register"
            component={Register}
            options={{
              title: "Đăng ký",
              tabBarIcon: () => (
                <Icon size={30} color="purple" source="account" />
              ),
            }}
          />
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              title: "Đăng nhập",
              tabBarIcon: () => (
                <Icon size={30} color="purple" source="login" />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="PostManagerStack"
            component={PostManagerStack}
            options={{
              title: "Danh sách Bài đăng",
              tabBarIcon: () => <Icon size={30} color="purple" source="post" />,
            }}
          />
          <Tab.Screen
            name="Message"
            component={MessageStack}
            options={{
              title: "Tin nhắn",
              tabBarIcon: () => (
                <Icon size={30} color="purple" source="message" />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
              title: user.username,
              tabBarIcon: () => (
                <Icon size={30} color="purple" source="account" />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default function App() {

  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyTab />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}
