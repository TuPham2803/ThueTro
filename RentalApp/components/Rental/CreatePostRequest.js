import { View, ScrollView, Text, Image, FlatList, TouchableOpacity, ScrollViewBase, StyleSheet } from "react-native";
import MyStyle from "../../styles/MyStyle";
import { Button, TextInput, IconButton, Icon, Appbar, Picker, Menu, Provider } from "react-native-paper"; // Import IconButton
import React, { useState } from "react";
import * as ImagePicker from 'react-native-image-picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';


const CreatePostRequest = ({ navigation }) => {
    const [address, setAddress] = React.useState("");
	const [city, setCity] = React.useState("");
	const [district, setDistrict] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [note, setNote] = React.useState("");
    const [acreage, setAcreage] = React.useState(0);
    const [quanity, setQuanity] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [selectedHouseType, setSelectedHouseType] = useState('');
    const [priceRange, setPriceRange] = useState([0, 20000000]);
    const handleHouseTypeSelection = (type) => {
        setSelectedHouseType(type);
    };
    return (
        <Provider>
            <View style={[MyStyle.container,{marginTop:20, marginBottom:30}]}>
                {/* <Appbar.Header style={{ backgroundColor: "purple" }}>
                    <Appbar.BackAction onPress={() => console.log("Go back")} />
                    <Appbar.Content
                        title={<Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>Bài Đăng Tìm Phòng</Text>}
                    />
                </Appbar.Header> */}
                <ScrollView style={[ MyStyle.wrapper, { paddingHorizontal: 20 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="map-marker" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Khu vực mong muốn: </Text>
                    </View>
                    <TextInput
                        label="Thành phố"
                        value={city}
                        onChangeText={setCity}
                        style={[MyStyle.input, MyStyle.margin]}
                    />
					<TextInput
                        label="Quận/Huyện"
                        value={district}
                        onChangeText={setDistrict}
                        style={[MyStyle.input, MyStyle.margin]}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="home-account" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Tên bài đăng</Text>
                    </View>
                    <TextInput
                        label="Title"
                        value={title}
                        onChangeText={setTitle}
                        style={[MyStyle.input, MyStyle.margin]}
                    />
					<View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon source="currency-usd" size={30} color="purple" />
                            <Text style={styles.label}>Khoảng Giá</Text>
                        </View>
                        <View style={styles.sliderLabels}>
                            <Text style={styles.sliderLabel}>   0</Text>
                            <Text style={styles.sliderLabel}>20.000.000</Text>
                        </View>
							<View style={styles.sliderContainer}>
							<MultiSlider
								values={priceRange}
								onValuesChange={(values) => setPriceRange(values)}
								min={0}
								max={20000000}
								step={500000}
								selectedStyle={{ backgroundColor: 'purple' }}
								unselectedStyle={{ backgroundColor: '#000000' }}
								containerStyle={styles.slider}
								trackStyle={{ height: 10 }}
								markerStyle={styles.thumbStyle}
							/>
						</View>
                        <Text style={styles.currentValue}>
							Giá mong muốn: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="file-document" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Ghi chú: </Text>
                    </View>
                    <TextInput
                        label="Note"
                        value={note}
                        onChangeText={setNote}
                        style={[MyStyle.input, MyStyle.margin]}
                    />

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="ruler" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Diện tích</Text>
                    </View>
                    <TextInput
                        label="Diện tích"
                        value={acreage}
                        onChangeText={setAcreage}
                        style={[MyStyle.input, MyStyle.margin]}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                        <Icon source="door" size={30} color="purple" />
                        <Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>loại phòng</Text>
                    </View>


                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={[
                                styles.iconButton,
                                selectedHouseType === 'SH' && styles.selectedButton,
                            ]}
                            onPress={() => handleHouseTypeSelection('SH')}
                        >
                            <View style={styles.iconButtonContent}>
                                <IconButton
                                    icon="home-group"
                                    size={30}
                                    color={selectedHouseType === 'SH' ? "white" : "White"}
                                />

                            </View>
                            <Text style={styles.buttonText}>ở Ghép</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.iconButton,
                                selectedHouseType === 'PR' && styles.selectedButton,
                            ]}
                            onPress={() => handleHouseTypeSelection('PR')}
                        >
                            <View style={styles.iconButtonContent}>
                                <IconButton
                                    icon="home"
                                    size={30}
                                    color={selectedHouseType === 'PR' ? "white" : "White"}
                                />
                            </View>
                            <Text style={styles.buttonText}>Ở riêng</Text>
                        </TouchableOpacity>
                    </View>
					{selectedHouseType == 'SH' && (
						<View>
							<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
								<Icon source="account" size={30} color="purple" />
								<Text style={{ color: "purple", marginRight: 5, fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 16 }}>Số người</Text>
							</View>
							<TextInput
								label="Number of people"
								value={quanity}
								onChangeText={setQuanity}
								style={[MyStyle.input, MyStyle.margin]}
							/>
						</View>
					)}

                    <Button
                        mode="contained"
                        onPress={() => console.log("Pressed")}
                        style={[MyStyle.button, MyStyle.margin]}
                    >
                        Post
                    </Button>
                </ScrollView>
            </View>
        </Provider>

    );
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        color: "purple",
        marginRight: 5,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontSize: 16,
    },
    sliderContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center', // Center the slider horizontally
    },
    slider: {
        width: '100%',
        height: 40,
    },
    thumbStyle: {
        height: 20,
        width: 20,
        backgroundColor: 'purple',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sliderLabel: {
        color: 'purple',
        marginRight: 5,
        fontFamily: 'Roboto',
        fontWeight: 'bold',
        fontSize: 16,
    },
    currentValue: {
        textAlign: 'center',
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    iconButton: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    selectedButton: {
        backgroundColor: '#b39ddb',
    },
});



export default CreatePostRequest;
