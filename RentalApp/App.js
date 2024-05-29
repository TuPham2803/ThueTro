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
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import ListPostAccommodation from "./components/Rental/ListPostAccommodation";
import UpdatePostAccommodation from "./components/Rental/UpdatePostAccommodation";



const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator >
      <Stack.Screen name="Home" component={Home} options={{ title: "Home" }} />
      <Stack.Screen name="CreatePostAccommodation" component={CreatePostAccommodation} options={{ title: "Tạo bài đăng" }} />
      <Stack.Screen name="CreatePostRequest" component={CreatePostRequest} options={{ title: "Tạo bài đăng" }} />

    </Stack.Navigator>
  );
};

const PostManagerStack = () => {
  const user = useContext(MyUserContext);

  return (
    <Stack.Navigator >
      {user.user_type == "landlord" ? <>
        <Stack.Screen name="CreatePostAccommodation" component={CreatePostAccommodation}
          options={{ title: "Tạo tin cho thuê" }} />
      </> : <>
        <Stack.Screen name="CreatePostRequest" component={CreatePostRequest}
          options={{ title: "Tạo tin tìm phòng" }} />
      </>}
    </Stack.Navigator>


  );
};
const MessageStack = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator >

    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const user = useContext(MyUserContext);

  return (
    <Stack.Navigator >
     
        <Stack.Screen name="Profile" component={Profile}/>

    </Stack.Navigator>

    
  );
};

const ListPostAccommodationStack = () => {
  const user = useContext(MyUserContext);
  return (
    <Stack.Navigator >
      <Stack.Screen name="ListPostAccommodation" component={ListPostAccommodation} options={{ title: "Danh sách bài đăng" }} />
      <Stack.Screen name = "UpdatePostAccommodation" component = {UpdatePostAccommodation} options={{ title: "Chỉnh sửa bài đăng" }}/>
    </Stack.Navigator>
  );
}






const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}
    tabBarOptions={{ activeTintColor: 'purple' }} >
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarIcon: () => <Icon size={30} color="purple" source="home" /> }} />
      {user === null ? <>
        <Tab.Screen name="Register" component={Register} options={{ title: "Đăng ký", tabBarIcon: () => <Icon size={30} color="purple" source="account" />}} />
        <Tab.Screen name="Login" component={Login} options={{ title: "Đăng nhập", tabBarIcon: () => <Icon size={30} color="purple" source="login" /> }} />
      </> : <>
        <Tab.Screen name="ListPostAccommodationStack" component={ListPostAccommodationStack} options={{ title: "Danh sách Bài đăng", tabBarIcon: () => <Icon size={30} color="purple" source="post" /> }} />
        <Tab.Screen name="Message" component={MessageStack} options={{ title: "Tin nhắn", tabBarIcon: () => <Icon size={30} color="purple" source="message" /> }} />
        <Tab.Screen name="Profile" component={ProfileStack} options={{ title: user.username, tabBarIcon: () => <Icon size={30} color="purple" source="account" /> }} />
      </>}

    </Tab.Navigator>
  );
}

export default function App() {
  const userData = {username: "chutro", user_type: "landlord"}
  // const userData = {username: "thuetro", user_type: "tenant"}r
  // const userData = null
  const [user, dispatch] = useReducer(MyUserReducer, userData);
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
