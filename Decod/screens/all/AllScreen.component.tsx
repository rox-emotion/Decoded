import React from "react";
import { SafeAreaView, Image, View, TouchableOpacity, FlatList } from "react-native";
import Header from "../../components/header/Header";
import { useState } from "react";
import styles from "./AllScreen.styles";
import { useNavigation } from "@react-navigation/native";
import thumbs from "./thumbs";

const AllScreen = () => {
    const navigation = useNavigation()
    const navigateToDetail = (pic) => {
        console.log(pic)
        navigation.navigate("Detail", { id: pic })
    }

    const [images, setImages] = useState(Array.from({ length: 101 }, (_, i) => `00${i + 1}`.slice(-3)));

    const renderItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => { navigateToDetail(index+1) }}>
                    <Image style={{ height: 99, width: 74, marginBottom: 10 }} source={thumbs[index]} />
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header hasBack={true} hasIcon={true} hasMenu={false} />
            <View style={styles.container}>
                <FlatList
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    data={images}
                    renderItem={renderItem}
                    keyExtractor={item => item}
                    numColumns={4}
                />
            </View>
        </SafeAreaView>
    )
}

export default AllScreen;