import MultiSlider from "@ptomasroos/react-native-multi-slider";
import {
  FlatList,
  SafeAreaView,
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
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import React, { useState } from "react";
import SortStyle from "../../styles/SortStyle";
import data from "../../Utils/CitiesData";

const PostAccommodationsFilter = ({ navigation }) => {
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [selectedCity, setSelectedCity] = useState(Object.keys(data)[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(
    data[Object.keys(data)[0]][0]
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(""); // 'city' hoặc 'district'
  const [minPeople, setMinPeople] = useState(999999);
  const [maxPeople, setMaxPeople] = useState(1);
  const [areaFindingType, setAreaFindingType] = useState("");

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedDistrict(data[city][0]);
    setModalVisible(false);
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setModalVisible(false);
  };

  const handleSortClick = () => {
    navigation.navigate("PostAccommodations", {
      data: {
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        city: selectedCity === "Chọn thành phố" ? "" : selectedCity,
        district:
          selectedDistrict === "Chọn quận/huyện" ? "" : selectedDistrict,
        minPeople: minPeople,
        maxPeople: maxPeople,
      },
    });
  };

  React.useEffect(() => {}, [areaFindingType]);

  //xai react native picker de xu ly viec hien thi thong tin city va district
  //su dung bien toan cuc de load city va district
  //them segmentedbuttons de chon loai tim kiem city hoac district theo khu vuc hoac ban do
  //them chon loai phong tro -> so nguoi o toi thieu va toi da

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
        <Text style={styles.sliderLabel}>100.000.000</Text>
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

      <SafeAreaView style={styles.container}>
        <SegmentedButtons
          value={areaFindingType}
          onValueChange={setAreaFindingType}
          buttons={[
            {
              value: 1,
              label: "Tìm kiếm theo khu vực",
            },
            {
              value: 2,
              label: "Tìm kiếm theo bản đồ",
            },
          ]}
        />
      </SafeAreaView>

      <View style={(SortStyle.container, MyStyle.alignCenter)}>
        {areaFindingType === 1 && (
          <>
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
          </>
        )}

        {areaFindingType === 2 && (
          <>
            <Text>Bản đồ</Text>
          </>
        )}

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
              value={minPeople}
              onChangeText={setMinPeople}
            ></TextInput>
          </View>
          <View>
            <Text style={[MyStyle.alignCenter, MyStyle.justifyContentCenter]}>
              Số người đang ở
            </Text>
            <TextInput
              style={[MyStyle.marginDistantSide, { marginTop: 10 }]}
              placeholder="Nhập số người"
              value={maxPeople}
              onChangeText={setMaxPeople}
            ></TextInput>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSortClick}
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

export default PostAccommodationsFilter;
