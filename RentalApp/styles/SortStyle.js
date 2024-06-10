import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const SortStyle = StyleSheet.create({
  container: {},
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectionButton: {
    padding: 10,
    backgroundColor: "pink",
    borderRadius: 5,
    alignItems: "center",
  },
  selectionText: {
    fontSize: 16,
  },
  modalContainer: {
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.7, // 80% of screen height
    alignSelf: "center",
  },
  optionButton: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
  },
  optionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    borderWidth: 1,
  },
  flatListContent: {
    width: "100%",
  },
});

export default SortStyle;
