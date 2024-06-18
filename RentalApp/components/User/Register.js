import {
  View,
  Text,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import {
  Button,
  RadioButton,
  TextInput,
  IconButton,
  TouchableRipple,
  HelperText,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import APIs, { endpoints } from "../../configs/APIs";
import mime from "react-native-mime-types";
import ImageViewing from "react-native-image-viewing";
import { ColorAssets } from "../../assets/ColorAssets";
import MyStyle from "../../styles/MyStyle";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [image, setImage] = useState(null);
  const [userType, setUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const navigation = useNavigation();

  const [firstNameError, setFirstNameError] = useState({ error: false });
  const [lastNameError, setLastNameError] = useState({ error: false });
  const [emailError, setEmailError] = useState({ error: false });
  const [usernameError, setUsernameError] = useState({ error: false });
  const [passwordError, setPasswordError] = useState({ error: false });
  const [passwordConfirmError, setPasswordConfirmError] = useState({
    error: false,
  });
  const [imageError, setImageError] = useState({ error: false });
  const [userTypeError, setUserTypeError] = useState({ error: false });

  const validate = () => {
    let isValid = true;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;
    if (firstName.trim() === "") {
      setFirstNameError({
        error: true,
        message: "Tên không được để trống",
      });
      isValid = false;
    } else {
      setFirstNameError({ error: false });
    }

    if (lastName.trim() === "") {
      setLastNameError({
        error: true,
        message: "Họ không được để trống",
      });
      isValid = false;
    } else {
      setLastNameError({ error: false });
    }

    if (email.trim() === "" || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError({
        error: true,
        message: "Email không hợp lệ",
      });
      isValid = false;
    } else {
      setEmailError({ error: false });
    }

    if (username.trim() === "") {
      setUsernameError({
        error: true,
        message: "Tên đăng nhập không được để trống",
      });
      isValid = false;
    } else {
      setUsernameError({ error: false });
    }

    if (password.trim() === "") {
      setPasswordError({
        error: true,
        message: "Mật khẩu không được để trống",
      });
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError({
        error: true,
        message:
          "Mật khẩu phải có ít nhất 10 ký tự, bao gồm chữ thường, chữ hoa và số",
      });
      isValid = false;
    } else {
      setPasswordError({ error: false });
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError({
        error: true,
        message: "Mật khẩu xác nhận không khớp",
      });
      isValid = false;
    } else {
      setPasswordConfirmError({ error: false });
    }

    if (!image) {
      setImageError({
        error: true,
        message: "Ảnh đại diện không được để trống",
      });
      isValid = false;
    } else {
      setImageError({ error: false });
    }

    if (userType === "") {
      setUserTypeError({
        error: true,
        message: "Loại người dùng không được để trống",
      });
      isValid = false;
    } else {
      setUserTypeError({ error: false });
    }

    return isValid;
  };

  const picker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Rental", "Permissions Denied!");
    } else {
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!res.cancelled) {
        setImage(res.assets[0]);
      }
    }
  };

  const deleteImage = () => {
    setImage(null);
  };

  const register = async () => {
    if (!validate()) {
      return;
    }

    let formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("user_type", userType);

    if (image) {
      formData.append("image", {
        uri: image.uri,
        type: mime.lookup(image.uri) || "image/jpeg",
        name: image.uri.split("/").pop(),
      });
    }

    try {
      setLoading(true);
      let res = await APIs.post(endpoints["register"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setImage(null);
        setUserType("");
        navigation.navigate("Login");
      }
    } catch (ex) {
      console.log(
        "Register failed: ",
        ex.response ? ex.response.data : ex.message
      );

      let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại sau.";
      if (ex.response && ex.response.data) {
        if (ex.response.data.username) {
          errorMessage =
            "Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.";
        }
      }

      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Lỗi",
        textBody: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertNotificationRoot>
      <ScrollView style={[MyStyle.container, { paddingHorizontal: 10 }]}>
        <Text style={[MyStyle.header, { textAlign: "center" }]}>
          ĐĂNG KÝ NGƯỜI DÙNG
        </Text>

        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          value={firstName}
          onChangeText={setFirstName}
          style={[MyStyle.input, { marginTop: 10 }]}
          label={"Tên"}
          error={firstNameError.error}
        />
        {firstNameError.error && (
          <HelperText type="error" visible={firstNameError.error}>
            {firstNameError.message}
          </HelperText>
        )}

        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          value={lastName}
          onChangeText={setLastName}
          style={[MyStyle.input, { marginTop: 10 }]}
          label={"Họ"}
          error={lastNameError.error}
        />
        {lastNameError.error && (
          <HelperText type="error" visible={lastNameError.error}>
            {lastNameError.message}
          </HelperText>
        )}

        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          value={email}
          onChangeText={setEmail}
          style={[MyStyle.input, { marginTop: 10 }]}
          label={"Email"}
          error={emailError.error}
        />
        {emailError.error && (
          <HelperText type="error" visible={emailError.error}>
            {emailError.message}
          </HelperText>
        )}

        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          value={username}
          onChangeText={setUsername}
          style={[MyStyle.input, { marginTop: 10 }]}
          label={"Tên đăng nhập"}
          error={usernameError.error}
        />
        {usernameError.error && (
          <HelperText type="error" visible={usernameError.error}>
            {usernameError.message}
          </HelperText>
        )}

        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
          style={[MyStyle.input, { marginTop: 10 }]}
          label={"Mật khẩu"}
          error={passwordError.error}
        />
        {passwordError.error && (
          <HelperText type="error" visible={passwordError.error}>
            {passwordError.message}
          </HelperText>
        )}

        <TextInput
          mode="outlined"
          outlineColor={ColorAssets.input.border}
          activeOutlineColor={ColorAssets.input.borderFocus}
          value={passwordConfirm}
          secureTextEntry={true}
          onChangeText={setPasswordConfirm}
          style={[MyStyle.input, { marginTop: 10 }]}
          label={"Xác nhận mật khẩu"}
          error={passwordConfirmError.error}
        />
        {passwordConfirmError.error && (
          <HelperText type="error" visible={passwordConfirmError.error}>
            {passwordConfirmError.message}
          </HelperText>
        )}

        <View
          style={[
            MyStyle.container,
            MyStyle.row,
            MyStyle.border,
            MyStyle.margin,
            MyStyle.alignCenter,
          ]}
        >
          <TouchableRipple
            style={[MyStyle.margin, MyStyle.border, MyStyle.alignCenter]}
            onPress={picker}
          >
            <Text>Chọn ảnh đại diện...</Text>
          </TouchableRipple>

          {image && (
            <TouchableRipple onPress={() => setViewerVisible(true)}>
              <Image source={{ uri: image.uri }} style={MyStyle.avatar} />
            </TouchableRipple>
          )}

          {image && (
            <IconButton icon="delete" onPress={deleteImage} iconColor="red" />
          )}
          {imageError.error && (
            <HelperText type="error" visible={imageError.error}>
              {imageError.message}
            </HelperText>
          )}
        </View>

        {/* Radio button group for user type */}
        <View style={[MyStyle.margin, MyStyle.border]}>
          <Text style={MyStyle.margin}>Loại người dùng</Text>
          <RadioButton.Group value={userType} onValueChange={setUserType}>
            <RadioButton.Item
              color={ColorAssets.checkbox.selected}
              label="Chủ trọ"
              value="landlord"
            />
            <RadioButton.Item
              color={ColorAssets.checkbox.selected}
              label="Người thuê"
              value="tenant"
            />
          </RadioButton.Group>
          {userTypeError.error && (
            <HelperText type="error" visible={userTypeError.error}>
              {userTypeError.message}
            </HelperText>
          )}
        </View>

        <Button
          style={[MyStyle.button, MyStyle.margin]}
          icon="account"
          loading={loading}
          mode="contained"
          onPress={register}
        >
          ĐĂNG KÝ
        </Button>

        {image && (
          <ImageViewing
            images={[{ uri: image.uri }]}
            imageIndex={0}
            visible={isViewerVisible}
            onRequestClose={() => setViewerVisible(false)}
          />
        )}
      </ScrollView>
    </AlertNotificationRoot>
  );
};

export default Register;
