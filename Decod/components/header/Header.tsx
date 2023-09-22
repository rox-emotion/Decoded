import React from "react";
import { Image, View, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import styles from "./Header.style";
const popAction = StackActions.pop(1);
const Header = ({ hasMenu, hasBack, hasIcon }) => {
    const menu = hasMenu;
    const back = hasBack;
    const icon = hasIcon;
    const navigation = useNavigation();
    const route = useRoute();

    return (
        <View style={styles.container}>
            {
                !menu && !back && icon
                    ? <View style={styles.singleContainer}>
                        <TouchableOpacity onPress={() => { navigation.push('About') }}>
                            <Image
                                source={require('../../assets/icons/icon.png')}
                                style={{ height: 38, width: 40 }}
                            />
                        </TouchableOpacity>
                    </View>
                    : !menu && back && icon
                        ? <View style={styles.container}>
                            <TouchableOpacity style={{ height: 45,  width: 80, marginLeft:-25, paddingLeft:25 }} onPress={() => { if (route.name === "About") { navigation.navigate('Scan') } else { navigation.dispatch(popAction) } }}>
                                <Image
                                    source={require('../../assets/icons/back_arrow.png')}
                                    style={{ height: 38, width: 19 }}

                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { navigation.push('About') }}>
                                <Image
                                    source={require('../../assets/icons/icon.png')}
                                    style={{ height: 38, width: 40 }}
                                />
                            </TouchableOpacity>
                        </View>
                        : menu && back && !icon
                            ? <View style={styles.container}>

                                <View>
                                    <TouchableOpacity style={{ height: 45, width: 80, marginLeft:-25, paddingLeft:25 }} onPress={() => { if (route.name === "About") { navigation.dispatch(popAction) } else { navigation.goBack() } }}>
                                        <Image
                                            source={require('../../assets/icons/back_arrow.png')}
                                            style={{ height: 38, width: 19 }}

                                        />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={() => { navigation.push('All') }}>
                                        <Image
                                            source={require('../../assets/icons/menu.png')}
                                            style={{ height: 38, width: 34 }}

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