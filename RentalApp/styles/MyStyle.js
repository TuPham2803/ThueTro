import { Dimensions, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

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
    width: screenWidth / 3 - 20, // Ensures three cards fit within the screen width
    marginHorizontal: 5,
  },
  cardImage: {
    width: "100%",
    height: 80,
  },
  button: {
    alignItems: "center",
  },
  buttonCaption: {
    marginTop: 5,
    textAlign: "center",
  },
  border: {
    borderColor: "purple",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  row_button: {
    flexDirection: "row", // Đảm bảo các phần tử trong hàng nằm ngang
    justifyContent: "center", // Căn giữa các phần tử trong hàng
    alignItems: "center", // Căn giữa theo trục dọc
  },
  
});
