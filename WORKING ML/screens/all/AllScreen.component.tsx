import React from "react";
import { useRef } from 'react';
import { SafeAreaView, Text, Modal, ScrollView, Image, View, TouchableOpacity, FlatList } from "react-native";
import Header from "../../components/header/Header";
import { useState } from "react";
import styles from "./AllScreen.styles";
import { useNavigation } from "@react-navigation/native";

const AllScreen = () => {
    const scrollRef = useRef();
    const navigation = useNavigation()
    const navigateToDetail = (pic) => {
        console.log(pic)
        navigation.navigate("Detail", { id: pic })
    }

    const [images, setImages] = useState(Array.from({ length: 100 }, (_, i) => `00${i + 1}`.slice(-3)));

    const renderItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => { navigateToDetail(index) }}>
                    <Image style={{ height: 94, width: 74, margin: 6 }} source={images[index + 2]} />
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <SafeAreaView>
            <Header hasMenu={false} hasBackButton={true} />
            <View style={styles.container}>
                <FlatList
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