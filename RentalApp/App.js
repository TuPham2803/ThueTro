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
import PostAccommodations from "./components/Rental/PostAccomodations";
import PostAccommodationDetails from "./components/Rental/PostAccommodationDetails";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  const user = useContext(MyUserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        name="CreatePostAccommodation"
        component={CreatePostAccommodation}
        options={{ title: "CreatePostAccommodation" }}
      />
      <Stack.Screen
        name="CreatePostRequest"
        component={CreatePostRequest}
        options={{ title: "CreatePostRequest" }}
      />
      <Stack.Screen
        name="PostAccommodations"
        component={PostAccommodations}
        options={{ title: "PostAccomodations" }}
      />
      <Stack.Screen
        name="PostAccommodationDetails"
        component={PostAccommodationDetails}
        options={{ title: "PostAccommodationDetails" }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <MyStack />
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}
