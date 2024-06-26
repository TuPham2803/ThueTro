import React, { useEffect, useState, useContext, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import {
  IconButton,
  ActivityIndicator,
  SegmentedButtons,
} from "react-native-paper";
import MyStyle from "../../styles/MyStyle";
import Item from "../../Utils/Item";
import APIs, { endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/Contexts";
import { ColorAssets } from "../../assets/ColorAssets";

const ListPostAccommodation = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [review, setReview] = React.useState("APR");
  const user = useContext(MyUserContext);
  const loadPostAccomodations = async () => {
    try {
      let res = await APIs.get(
        `${endpoints["post_accommodations"]}?user_post=${user.id}`
      );
      setPosts(res.data.results);
    } catch (ex) {
      console.error(ex);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadPostAccomodations();
    }, [])
  );


  // React.useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <IconButton
  //         icon="plus"
  //         iconColor={ColorAssets.header.text}
  //         size={30}
  //         onPress={() => navigation.navigate("CreatePostAccommodation")}
  //       />
  //     ),
  //   });
  // }, [navigation]);

  return (
    <View style={[MyStyle.container]}>
      <SegmentedButtons
        style={[{ margin: 10 }]}
        value={review}
        onValueChange={setReview}
        buttons={[
          {
            value: "PD",
            icon: "clock-outline",
            label: "Xét duyệt",
            checkedColor: ColorAssets.input.text,
            style: [
              review === "PD" && {
                backgroundColor: ColorAssets.button.background,
              },
            ],
          },
          {
            value: "APR",
            label: "Đồng ý",
            icon: "check-circle-outline",
            checkedColor: ColorAssets.input.text,
            style: [
              review === "APR" && {
                backgroundColor: ColorAssets.button.background,
              },
            ],
          },
          {
            value: "FL",
            label: "Từ chối",
            icon: "close-circle-outline",
            checkedColor: ColorAssets.input.text,

            style: [
              review === "FL" && {
                backgroundColor: ColorAssets.button.background,
              },
            ],
          },
        ]}
      />
      <ScrollView>
        <View style={[MyStyle.container, MyStyle.margin]}>
          {posts === null ? (
            <ActivityIndicator />
          ) : (
            <>
              {posts.map(
                (p) =>
                  p.pending_status === review && (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() =>
                        navigation.navigate("UpdatePostAccommodation", {
                          post: p,
                        })
                      }
                    >
                      <Item instance={p} />
                    </TouchableOpacity>
                  )
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default ListPostAccommodation;
