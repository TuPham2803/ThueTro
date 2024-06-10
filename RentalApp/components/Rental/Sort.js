import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Icon,
  Modal,
  PaperProvider,
  Portal,
  RadioButton,
  Text,
  TextInput,
} from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import React, { useState } from "react";
import SortStyle from "../../styles/SortStyle";
import data from "../../Utils/CitiesData";

const Sort = () => {
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [selectedCity, setSelectedCity] = useState(Object.keys(data)[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(
    data[Object.keys(data)[0]][0]
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // 'city' hoặc 'district'
  const flatListRef = React.useRef();

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedDistrict(data[city][0]);
    setModalVisible(false);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setModalVisible(false);
  };

  return (
    <View style={[MyStyle.top]}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}
      >
        <Icon source="currency-usd" size={30} color="purple" />
        <Text style={styles.label}>Khoảng Giá</Text>
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}> 0</Text>
        <Text style={styles.sliderLabel}>20.000.000</Text>
      </View>
      <View style={styles.sliderContainer}>
        <MultiSlider
          values={priceRange}
          onValuesChange={(values) => setPriceRange(values)}
          min={0}
          max={20000000}
          step={500000}
          selectedStyle={{ backgroundColor: "purple" }}
          unselectedStyle={{ backgroundColor: "#000000" }}
          containerStyle={styles.slider}
          trackStyle={{ height: 10 }}
          markerStyle={styles.thumbStyle}
        />
      </View>
      <Text style={styles.currentValue}>
        Giá mong muốn: {priceRange[0].toLocaleString()} -{" "}
        {priceRange[1].toLocaleString()}
      </Text>

      <View style={(SortStyle.container, MyStyle.alignCenter)}>
        <Text style={SortStyle.label}>Chọn Thành Phố/Tỉnh</Text>
        <TouchableOpacity
          onPress={() => {
            setModalType("city");
            setModalVisible(true);
          }}
          style={SortStyle.selectionButton}
        >
          <Text style={SortStyle.selectionText}>{selectedCity}</Text>
        </TouchableOpacity>

        <Text style={SortStyle.label}>Chọn Quận/Huyện</Text>
        <TouchableOpacity
          onPress={() => {
            setModalType("district");
            setModalVisible(true);
          }}
          style={SortStyle.selectionButton}
        >
          <Text style={SortStyle.selectionText}>{selectedDistrict}</Text>
        </TouchableOpacity>

        <View
          style={[MyStyle.row, MyStyle.top, { justifyContent: "space-around" }]}
        >
          <View>
            <Text style={[MyStyle.alignCenter, MyStyle.justifyContentCenter]}>
              Số người ở tối thiểu
            </Text>
            <TextInput
              style={[MyStyle.marginDistantSide, { marginTop: 10 }]}
              placeholder="Nhập số người"
            ></TextInput>
          </View>
          <View>
            <Text style={[MyStyle.alignCenter, MyStyle.justifyContentCenter]}>
              Số người đang ở
            </Text>
            <TextInput
              style={[MyStyle.marginDistantSide, { marginTop: 10 }]}
              placeholder="Nhập số người"
            ></TextInput>
          </View>
        </View>

        <TouchableOpacity
          style={[
            SortStyle.closeButton,
            MyStyle.alignCenter,
            {
              padding: 10,
              width: "50%",
              backgroundColor: "purple",
              borderRadius: 10,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Tìm kiếm</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={SortStyle.modalContainer}>
            <View style={SortStyle.modalContent}>
              {modalType === "city" && (
                <FlatList
                  data={Object.keys(data)}
                  keyExtractor={(item) => item}
                  contentContainerStyle={SortStyle.flatListContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={SortStyle.optionButton}
                      onPress={() => handleCitySelect(item)}
                    >
                      <Text style={SortStyle.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              {modalType === "district" && (
                <FlatList
                  data={data[selectedCity]}
                  keyExtractor={(item) => item}
                  contentContainerStyle={SortStyle.flatListContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={SortStyle.optionButton}
                      onPress={() => handleDistrictSelect(item)}
                    >
                      <Text style={SortStyle.optionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
              <Button
                onPress={() => setModalVisible(false)}
                style={SortStyle.closeButton}
              >
                Đóng
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    color: "purple",
    marginRight: 5,
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16,
  },
  sliderContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center", // Center the slider horizontally
  },
  slider: {
    width: "100%",
    height: 40,
  },
  thumbStyle: {
    height: 20,
    width: 20,
    backgroundColor: "purple",
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    color: "purple",
    marginRight: 5,
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 16,
  },
  currentValue: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
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
    backgroundColor: "#b39ddb",
  },
});

export default Sort;
