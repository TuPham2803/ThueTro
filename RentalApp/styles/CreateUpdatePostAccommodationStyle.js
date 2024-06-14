import { StyleSheet, Dimensions } from "react-native";
import { ColorAssets } from "../assest/ColorAssets";


export default StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
  },
  wrapper: {
    paddingHorizontal: 20,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  iconText: {
    color: ColorAssets.content.title,
    marginRight: 5,
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16,
  },
  textInput: {
    marginBottom: 10,
  },
  multilineTextInput: {
    height: 100,
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "#38ab9e",
  },
  imageWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  imageContainer: {
    flexBasis: "50%",
    padding: 5,
  },
  imageDeleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 15,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    overflow: "hidden", 
  },
  addButton: {
    borderWidth: 1,
    borderColor: ColorAssets.input.borderFocus,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    width: 100,
  },
  submitButton: {
    backgroundColor: "purple",
  },
});
