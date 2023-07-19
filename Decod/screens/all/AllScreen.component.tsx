import React, { useRef } from "react";
import { Image, View, TouchableOpacity, FlatList } from "react-native";
import Header from "../../components/header/Header";
import { useState } from "react";
import styles from "./AllScreen.styles";
import { useNavigation } from "@react-navigation/native";
import thumbs from "./thumbs";

const AllScreen = () => {
    const navigation = useNavigation()
    
    const navigateToDetail = (pic) => {
        if (!isNavigatingRef.current) {
          isNavigatingRef.current = true;
    
          console.log(pic);
          navigation.push("Detail", { id: pic });
    
          // Set a small timeout to reset the flag, preventing fast tapping
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 500); // Adjust the timeout duration as needed
        }
      };

    const [images, setImages] = useState(Array.from({ length: 101 }, (_, i) => `00${i + 1}`.slice(-3)));
    const isNavigatingRef = useRef(false);

    const renderItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => { navigateToDetail(index + 1) }}>
                    <Image style={{ height: 99, width: 74, marginBottom: 10 }} source={thumbs[index]} />
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={styles.mainContainer}>
            <Header hasBack={true} hasIcon={true} hasMenu={false} />
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                    numColumns={4}
                />
            </View>
        </View>
    )
}

export default AllScreen;