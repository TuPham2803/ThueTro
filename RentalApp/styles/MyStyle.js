import { Dimensions, StyleSheet } from "react-native";
import { ColorAssets } from "../assest/ColorAssets";
const screenWidth = Dimensions.get("window").width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    backgroundColor: ColorAssets.input.background,
  },
  top: {
    marginTop: 20,
  },
  subject: {
    fontSize: 15,
    fontWeight: "",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: ColorAssets.content.title,
    flexShrink: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: ColorAssets.content.title,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  col: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  margin: {
    margin: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  searchBar: {
    width: "95%",
  },
  icon: {
    width: "8%",
    height: 50,
    alignSelf: "center",
  },
  marginDistantSide: {
    marginLeft: 10,
    marginRight: 10,
  },
  wrapper: {
    height: 200,
  },
  alignCenter: {
    alignItems: "center",
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
  image: {
    width: screenWidth,
    height: 200,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconFeature: {
    width: "30%",
    height: 50,
  },
  horizontalScroll: {
    marginTop: 10,
    paddingLeft: 10,
  },
  card: {
    width: screenWidth / 2.5 - 20, // Ensures three cards fit within the screen width
    marginHorizontal: 5,
  },
  cardImage: {
    width: "100%",
    height: 80,
  },
  button: {
    backgroundColor: ColorAssets.button.background,
    color: ColorAssets.button.text,
  },
  buttonCaption: {
    marginTop: 5,
    textAlign: "center",
  },
  border: {
    borderColor: ColorAssets.content.title,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  row_button: {
    flexDirection: "row", // Đảm bảo các phần tử trong hàng nằm ngang
    justifyContent: "center", // Căn giữa các phần tử trong hàng
    alignItems: "center", // Căn giữa theo trục dọc
  },
  post_accomodations: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    width: "100%",
    height: 350,
    borderRadius: 10,
  },
  post_thumbnail: {
    width: "90%",
    height: "60%",
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 10,
  },
});
