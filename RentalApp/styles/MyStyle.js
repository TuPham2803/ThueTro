import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    marginTop: 50,
  },
  subject: {
    fontSize: 20,
    fontWeight: "bold",
    color: "blue",
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
  },
});
