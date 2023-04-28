import React from "react";
import { Image, View, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from "./Header.style";

const Header = ({ hasMenu, hasBack, hasIcon }) => {
    const menu = hasMenu;
    const back = hasBack;
    const icon = hasIcon;
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {
                !menu && !back && icon
                    ? <View style={styles.singleContainer}>
                        <TouchableOpacity onPress={() => { navigation.navigate('About') }}>
                            <Image
                                source={require('../../assets/icons/icon.png')}
                                style={{ height: 38, width: 40 }}
                            />
                        </TouchableOpacity>
                    </View>
                    : !menu && back && icon
                        ? <View style={styles.container}>
                            <TouchableOpacity onPress={() => { navigation.goBack() }}>
                                <Image
                                    source={require('../../assets/icons/back_arrow.png')}
                                    style={{ height: 38, width: 19 }}

                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { navigation.navigate('About') }}>
                                <Image
                                    source={require('../../assets/icons/icon.png')}
                                    style={{ height: 38, width: 40 }}
                                />
                            </TouchableOpacity>
                        </View>
                        : menu && back && !icon
                            ? <View style={styles.container}>
                                
                                <View>
                                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                                        <Image
                                            source={require('../../assets/icons/back_arrow.png')}
                                            style={{ height: 38, width: 19 }}

                                        />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => { navigation.navigate('All') }}>
                                        <Image
                                            source={require('../../assets/icons/menu.png')}
                                            style={{ height: 45, width: 40 }}

                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null
            }

        </View>
    )
}

export default Header;