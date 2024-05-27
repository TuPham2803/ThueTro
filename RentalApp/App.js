import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Rental/Home";
import Login from "./components/User/Login";
import { useContext, useReducer } from "react";
import { MyUserReducer } from "./configs/Reducer";
import { MyDispatchContext, MyUserContext } from "./configs/Contexts";
import Profile from "./components/User/Profile";
import React from "react";
import CreatePostAccommodation from "./components/Rental/CreatePostAccommodation";
import CreatePostRequest from "./components/Rental/CreatePostRequest";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';


const Stack = createNativeStackNavigator();

const MyStack = () => {
  const user = useContext(MyUserContext);


  return (
    <Stack.Navigator >
      <Stack.Screen name="Home" component={Home} options={{ title: "Home" }} />
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name="CreatePostAccommodation" component={CreatePostAccommodation}
        options={{ title: "Tạo tin cho thuê" }}/>
      <Stack.Screen name="CreatePostRequest" component={CreatePostRequest}
        options={{ title: "Tạo tin tìm phòng" }}/>
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Index" component={MyStack} options={{ tabBarIcon: () => <Icon size={30} color="blue" source="home" /> }} />
      {user === null ? <>
        {/* <Tab.Screen name="Register" component={Register} options={{ title: "Đăng ký", tabBarIcon: () => <Icon size={30} color="blue" source="account" />}} /> */}
        <Tab.Screen name="Login" component={Login} options={{ title: "Đăng nhập", tabBarIcon: () => <Icon size={30} color="blue" source="login" /> }} />
      </> : <>
        <Tab.Screen name="Profile" component={Profile} options={{ title: user.username, tabBarIcon: () => <Icon size={30} color="blue" source="account" /> }} />
      </>}

    </Tab.Navigator>
  );
}

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
