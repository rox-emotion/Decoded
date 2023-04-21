import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { SafeAreaView, Text, TouchableOpacity, Image } from 'react-native';
import styles
    from "./HomeScreen.styles";

//WILL BE DELETED
const HomeScreen = () => {
    const navigation = useNavigation()
    const images = [require('./../../assets/icons/splash/2.1.png'), require('./../../assets/icons/splash/2.2.png'), require('./../../assets/icons/splash/2.3.png')]
    const [image, setImage] = useState(0);
    const counter = useRef(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            if (counter.current == 2) {
                setDone(true)
                clearInterval(timer)
            }
            counter.current += 1

            setImage(image => image + 1)
        }, 1500)

        return (() => {
            clearInterval(timer)
        })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            {
                done
                    ? <>
                        <Image source={images[2]}
                            style={{ width: 116, height: 194 }}
                        />
                        <TouchableOpacity onPress={() => { navigation.navigate("Scan") }}>
                            <Text style={styles.text}>Scan Portrait</Text>
                        </TouchableOpacity>
                    </>
                    : <><Image
                        source={images[image]}
                        style={{ alignSelf: 'center', width: image == 0 ? 58 : image == 1 ? 116 : 116, height: image == 0 ? 116 : image == 1 ? 59 : 194 }}
                    />
                        <TouchableOpacity onPress={() => { navigation.navigate("Scan") }}>
                            <Text style={styles.textWhite}>Scan Portrait</Text>
                        </TouchableOpacity>
                    </>

            }
        </SafeAreaView>
    )
}

export default HomeScreen;