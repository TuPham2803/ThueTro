import { Dimensions, StyleSheet } from "react-native";
import { ColorAssets } from "../assets/ColorAssets";

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
    fontWeight: "normal",
    color: ColorAssets.content.text,
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
    alignItems: "center",
    backgroundColor: ColorAssets.input.background,
  },
  icon: {
    width: "8%",
    height: 50,
    alignSelf: "center",
  },
  marginDistantSide: {
    marginHorizontal: 10,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconFeature: {
    width: "30%",
    height: 50,
  },
  horizontalScroll: {
    marginTop: 10,
  },
  horizontalImageContainer: {
    display: "flex",
    marginRight: 10,
  },
  horizontalImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
  },
  card: {
    width: screenWidth / 2.5 - 20,
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
    margin: 5,
    textAlign: "center",
    color: ColorAssets.content.text,
  },
  border: {
    borderColor: ColorAssets.content.title,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  row_button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: ColorAssets.content.title,
    marginBottom: 5,
  },
});
