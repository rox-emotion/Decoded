import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, StatusBar, Platform } from 'react-native';
import Header from "../../components/header/Header";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import sounds from "../detail/sounds";
import { poem } from './poem'
import { TEXT_COLOR } from "../../utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const PoetryScreen = () => {
    if(Platform.OS == 'android'){
        StatusBar.setBackgroundColor('white');
    }

    const isFocused = useIsFocused()
    const soundRef = useRef();
    const poemParts = poem.split('\n')
    const insets = useSafeAreaInsets();
    const bottomNavBarHeight = insets.bottom;


    const playSound = async () => {
        try {
            

            const sound = new Audio.Sound();
            try {
                await sound.loadAsync({  uri : sounds[101]}, { shouldPlay: true });
                await sound.setPositionAsync(0);
                await sound.playAsync();
                soundRef.current = sound;
               
            } catch (error) {
                console.error(error)
            }


        } catch (e) {
            console.log('playSound ' + e)
        }
    };


    const stopSound = async () => {
        try {
            if (soundRef.current) {
                await soundRef.current.stopAsync();
            }
        }
        catch (e) {
            console.log("stopSound " + e)
        }
    }


    useEffect(() => {
        enableAudio();

        if (isFocused === true) {
            playSound();
        } else if (isFocused === false) {
            stopSound();
        }


        return () => {
            stopSound()
        }
    }, [isFocused]);

    const enableAudio = async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
                playThroughEarpieceAndroid: false


            })
        } catch (e) {
            console.log("enableAudio " + e)
        }
    }
    return (
        <View style={[styles.mainPage, { paddingBottom: bottomNavBarHeight + 50 }]}>
            <Header hasMenu={true} hasBack={true} hasIcon={false} />
            <ScrollView style={styles.scrollViewContainer}
             showsVerticalScrollIndicator={false}
             showsHorizontalScrollIndicator={false}
            >
                <Text style={[styles.boldText, {marginBottom:8}]}>Source Code</Text>

                {poemParts.map((paragraph: string, index: number) => (
                    <Text style={styles.simpleText} key={index}>{paragraph}</Text>
                ))}

                <Text style={styles.boldText}>Tyson Amir </Text>
            </ScrollView>


        </View >
    )
}

const styles = StyleSheet.create({
    mainPage: {
        marginTop: 50,
        paddingHorizontal: 20,
    },
    scrollViewContainer: {
        marginTop:32,
        
    },
    simpleText: {
        fontSize: 16,
        fontFamily: 'californian-regular',
        color: TEXT_COLOR,
        marginBottom: 6
    },
    boldText: {
        fontSize: 18,
        fontFamily: 'californian-bold',
        color: TEXT_COLOR,
    },
})

export default PoetryScreen;