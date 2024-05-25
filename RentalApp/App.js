import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./components/Rental/Home";
<<<<<<< HEAD
import Login from "./components/Rental/Login";
import CreatePostAccommodation from "./components/Rental/CreatePostAccommodation";
=======
import Login from "./components/User/Login";
>>>>>>> b9a1f1ef313346634c3eb2588a6e1c3bcc906d3f

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} options={{ title: "Home" }} />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="CreatePostAccommodation"
        component={CreatePostAccommodation}
        options={{ title: "CreatePostAccommodation" }}
      />

    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
