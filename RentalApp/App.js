import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Rental/Home";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import { useContext, useReducer, useEffect } from "react";
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
import PostAccommodationsFilter from "./components/Rental/PostAccomodationsFilter";
import { ColorAssets } from "./assest/ColorAssets";
import APIs, { authApi, endpoints } from "./configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerStyle: { backgroundColor: ColorAssets.header.background },
        headerTintColor: ColorAssets.header.text,
        statusBarColor: ColorAssets.header.background,
        navigationBarColor: ColorAssets.nav.background,
      })}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: "Home",
        }}
      />
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
        name="Filter"
        component={PostAccommodationsFilter}
        options={{ title: "Lọc tìm kiếm" }}
      />
    </Stack.Navigator>
  );
};

const PostManagerStack = () => {
  const user = useContext(MyUserContext);

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerStyle: { backgroundColor: ColorAssets.header.background },
        headerTintColor: ColorAssets.header.text,
        statusBarColor: ColorAssets.header.background,
        navigationBarColor: ColorAssets.nav.background,
      })}
    >
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
    <Stack.Navigator
      screenOptions={() => ({
        headerStyle: { backgroundColor: ColorAssets.header.background },
        headerTintColor: ColorAssets.header.text,
        statusBarColor: ColorAssets.header.background,
        navigationBarColor: ColorAssets.nav.background,
      })}
    >
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
    <Stack.Navigator
      screenOptions={() => ({
        headerStyle: { backgroundColor: ColorAssets.header.background },
        headerTintColor: ColorAssets.header.text,
        statusBarColor: ColorAssets.header.background,
        navigationBarColor: ColorAssets.nav.background,
      })}
    >
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
        tabBarInactiveBackgroundColor: "#fff",
        tabBarActiveTintColor: ColorAssets.nav.icon,
        tabBarStyle: ((route) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          let style = { backgroundColor: ColorAssets.nav.background };
          const listScreenHide = [
            "Chat",
            "CreatePostRequest",
            "CreatePostAccommodation",
            "UpdatePostAccommodation",
            "UpdatePostRequest",
            "EditProfile",
          ];
          if (listScreenHide.includes(routeName)) {
            style.display = "none";
          }

          return style;
        })(route),
        tabBarLabelStyle: ({ focused }) => ({
          color: focused ? ColorAssets.nav.background : ColorAssets.nav.text,
        }),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "HomeStack") {
            iconName = "home";
          } else if (route.name === "Register") {
            iconName = "account";
          } else if (route.name === "Login") {
            iconName = "login";
          } else if (route.name === "PostManagerStack") {
            iconName = "post";
          } else if (route.name === "Message") {
            iconName = "message";
          } else if (route.name === "ProfileStack") {
            iconName = "account";
          }

          return (
            <Icon
              source={iconName}
              size={size}
              color={
                focused ? ColorAssets.nav.icon : ColorAssets.nav.background
              }
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          title: "Home",
        }}
      />
      {user === null ? (
        <>
          <Tab.Screen
            name="Register"
            component={Register}
            options={{
              title: "Đăng ký",
            }}
          />
          <Tab.Screen
            name="Login"
            component={Login}
            options={{
              title: "Đăng nhập",
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
            }}
          />
          <Tab.Screen
            name="Message"
            component={MessageStack}
            options={{
              title: "Tin nhắn",
            }}
          />
          <Tab.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
              title: user.username,
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          const response = await authApi(token).get(endpoints["current-user"]);

          if (response.ok) {
            const data = await response.json();
            dispatch({ type: "login", payload: data });
          } else {
            dispatch({ type: "logout" });
          }
        } else {
          dispatch({ type: "logout" });
        }
      } catch (error) {
        console.error("Error checking token:", error);
        dispatch({ type: "logout" });
      }
    };

    checkToken();
  }, []);
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
