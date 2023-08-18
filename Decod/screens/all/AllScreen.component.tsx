import React, { useRef } from "react";
import { Image, View, TouchableOpacity, FlatList, Text, StatusBar, Platform } from "react-native";
import Header from "../../components/header/Header";
import { useState } from "react";
import styles from "./AllScreen.styles";
import { useNavigation } from "@react-navigation/native";
import thumbs from "./thumbs";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AllScreen = () => {
    if(Platform.OS == 'android'){
        StatusBar.setBackgroundColor('white');
    }

    const navigation = useNavigation()

    const insets = useSafeAreaInsets();
    const bottomNavBarHeight = insets.bottom;
    
    const navigateToDetail = (pic) => {
        if (!isNavigatingRef.current) {
          isNavigatingRef.current = true;
    
          console.log(pic);
          navigation.push("Detail", { id: pic });
    
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 500);
        }
      };

    const [images, setImages] = useState(Array.from({ length: 101 }, (_, i) => `00${i + 1}`.slice(-3)));
    const isNavigatingRef = useRef(false);

    const renderItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => { navigateToDetail(index + 1) }}>
                    <Image style={{ height: 99, width: 74, marginBottom: 20 }} source={thumbs[index]} />
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={[styles.mainContainer, {marginBottom: bottomNavBarHeight }]}>
            <Header hasBack={true} hasIcon={true} hasMenu={false} />
            {/* <TouchableOpacity onPress={() => {navigation.navigate('Poetry')}}>
                <Text>POEM TO TEST</Text>
            </TouchableOpacity> */}
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