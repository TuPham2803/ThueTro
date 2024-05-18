import { Dimensions, StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    marginTop: 50,
  },
  subject: {
    fontSize: 15,
    fontWeight: "",
    color: "purple",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "purple",
  },
  row: {
    flexDirection: "row",
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
    width: "60%",
  },
  icon: {
    width: "8%",
    height: 50,
    alignSelf: "center",
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
    width: Dimensions.get("window").width,
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
});
