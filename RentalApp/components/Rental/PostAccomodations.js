import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet,
  TextInput,
  Button,
} from "react-native";
import { Searchbar, IconButton, Text } from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import Item from "../../Utils/Item";
import APIs, { endpoints } from "../../configs/APIs";
import { isCloseToBottom } from "../../Utils/Utils";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Picker } from "@react-native-picker/picker";
import data from "../../Utils/CitiesData";
import { ColorAssets } from "../../assets/ColorAssets";
import { formatCurrency } from "../../Utils/Utils";

const FilterModal = ({ isVisible, onClose, applyFilter, initialFilters }) => {
  const [minPrice, setMinPrice] = useState(
    initialFilters.minPrice?.toString() || 0
  );
  const [maxPrice, setMaxPrice] = useState(
    initialFilters.maxPrice?.toString() || 20000000
  );
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [maxPeople, setMaxPeople] = useState(
    initialFilters.maxPeople?.toString() || null
  );
  const [currentPeople, setCurrentPeople] = useState(
    initialFilters.currentPeople?.toString() || null
  );

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSelectedDistrict(null); // Reset district selection when city changes
  };

  const handleDistrictChange = (district) => {
    setSelectedDistrict(district);
  };

  const resetSelection = () => {
    setSelectedCity(null);
    setSelectedDistrict(null);
  };

  const handleApply = () => {
    const filters = {
      minPrice: parseFloat(minPrice) || undefined,
      maxPrice: parseFloat(maxPrice) || undefined,
      city: selectedCity || undefined,
      district: selectedDistrict || undefined,
      maxPeople: parseInt(maxPeople) || undefined,
      currentPeople: parseInt(currentPeople) || undefined,
    };
    applyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(20000000);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setMaxPeople("");
    setCurrentPeople("");
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer]}>
        <Text
          style={[
            MyStyle.heading,
            { color: "green", fontSize: 20, alignSelf: "center" },
          ]}
        >
          Lọc tìm kiếm
        </Text>
        <Text>Price Range:</Text>
        <View style={styles.sliderContainer}>
          <MultiSlider
            selectedStyle={{ backgroundColor: ColorAssets.range.selected }}
            unselectedStyle={{
              backgroundColor: ColorAssets.range.unselected,
            }}
            containerStyle={styles.slider}
            markerStyle={styles.thumbStyle}
            values={[minPrice, maxPrice]}
            min={0}
            max={20000000}
            step={500000}
            onValuesChange={(values) => {
              setMinPrice(values[0]);
              setMaxPrice(values[1]);
            }}
          />
        </View>
        <View style={styles.priceLabels}>
          <Text>{`Giá thấp nhất: ${formatCurrency(minPrice)} đ`}</Text>
          <Text>{`Giá cao nhất: ${formatCurrency(maxPrice)} đ`}</Text>
        </View>
        <Text style={[styles.heading, { color: ColorAssets.content.text }]}>
          Chọn thành phố và quận/huyện
        </Text>
        <Picker
          selectedValue={selectedCity}
          onValueChange={(itemValue) => handleCityChange(itemValue)}
        >
          <Picker.Item label="Chọn thành phố" value={null} />
          {Object.keys(data).map((city) => (
            <Picker.Item key={city} label={city} value={city} />
          ))}
        </Picker>
        {selectedCity &&
          selectedCity !== "Chọn thành phố" &&
          data[selectedCity] && (
            <Picker
              selectedValue={selectedDistrict}
              onValueChange={(itemValue) => handleDistrictChange(itemValue)}
            >
              {data[selectedCity].map((district) => (
                <Picker.Item key={district} label={district} value={district} />
              ))}
            </Picker>
          )}
        {selectedCity && selectedDistrict && (
          <View style={styles.result}>
            <Text>
              Bạn đã chọn: {selectedCity} - {selectedDistrict}
            </Text>
          </View>
        )}
        {selectedCity && (
          <Button
            title="Bỏ chọn thành phố"
            onPress={resetSelection}
            color="red"
          />
        )}
        <Text>Max People:</Text>
        <TextInput
          style={styles.input}
          value={maxPeople}
          onChangeText={setMaxPeople}
          keyboardType="numeric"
        />
        <Text>Current People:</Text>
        <TextInput
          style={styles.input}
          value={currentPeople}
          onChangeText={setCurrentPeople}
          keyboardType="numeric"
        />
        <View style={styles.buttonContainer}>
          <Button title="Lọc tìm kiếm" onPress={handleApply} />
          <Button title="Trở về mặc định" onPress={handleReset} />
          <Button title="Đóng" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const PostAccommodations = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: route?.params?.data?.minPrice || null,
    maxPrice: route?.params?.data?.maxPrice || null,
    city: route?.params?.data?.city || null,
    district: route?.params?.data?.district || null,
    maxPeople: route?.params?.data?.maxPeople || null,
    currentPeople: route?.params?.data?.currentPeople || null,
  });

  const loadPostAccommodations = async (reset = false) => {
    setLoading(true);
    if (page > 0) {
      const pageToLoad = reset ? 1 : page;
      const queryParams = new URLSearchParams({
        page: pageToLoad.toString(),
        pending_status: "APR",
        ...(filters.minPrice && { min_price: filters.minPrice }),
        ...(filters.maxPrice && { max_price: filters.maxPrice }),
        ...(filters.city && { city: filters.city }),
        ...(filters.district && { district: filters.district }),
        ...(filters.maxPeople && { max_people: filters.maxPeople }),
        ...(filters.currentPeople && { current_people: filters.currentPeople }),
        ...(q && { q }),
      });

      let url = `${endpoints["post_accommodations"]}?${queryParams.toString()}`;

      try {
        let res = await APIs.get(url);
        if (reset) {
          setPosts(res.data.results);
          setPage(1);
        } else if (page > 1) {
          setPosts((current) => [...current, ...res.data.results]);
        }
        if (res.data.next === null) setPage(0);
      } catch (ex) {
        console.error(ex);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setPage(1); // Reset the page to 1
  }, [filters]);

  useEffect(() => {
    if (page === 1) {
      loadPostAccommodations(true); // Reset the API call
    } else {
      loadPostAccommodations();
    }
  }, [page]);

  const loadMore = ({ nativeEvent }) => {
    if (!loading && isCloseToBottom(nativeEvent)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleFilterApply = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <View style={[MyStyle.container, MyStyle.margin]}>
      <View
        style={[MyStyle.row, MyStyle.margin, { justifyContent: "flex-end" }]}
      >
        <Searchbar
          style={{ width: "90%" }}
          placeholder="Search"
          onChangeText={setQ}
          value={q}
        />
        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          style={{
            width: "10%",
            backgroundColor: "pink",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
        >
          <IconButton
            icon="sort"
            size={20}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: [{ translateY: -12 }],
            }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView onScroll={loadMore}>
        <View style={[MyStyle.container, MyStyle.margin]}>
          {loading && page === 1 ? (
            <ActivityIndicator />
          ) : (
            posts.map((p) => (
              <TouchableOpacity
                style={[MyStyle.top, MyStyle.post_accomodations]}
                key={p.id}
                onPress={() =>
                  navigation.navigate("PostAccommodationDetails", {
                    post: p,
                  })
                }
              >
                <Item instance={p} />
              </TouchableOpacity>
            ))
          )}
        </View>
        {loading && page > 1 && <ActivityIndicator />}
      </ScrollView>

      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        applyFilter={handleFilterApply}
        initialFilters={filters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: ColorAssets.input.border,
    backgroundColor: ColorAssets.input.background,
    padding: 10,
    marginVertical: 5,
  },
  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  sliderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  thumbStyle: {
    height: 20,
    width: 20,
  },
  buttonContainer: {
    color: ColorAssets.button.text,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

export default PostAccommodations;
