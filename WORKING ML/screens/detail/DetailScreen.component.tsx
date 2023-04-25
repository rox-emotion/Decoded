import React from "react";
import { View, Text, SafeAreaView, Platform, Animated, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from "react";
import Svg, { G, Circle, Rect } from 'react-native-svg';
import { Audio } from 'expo-av';
import FadedScrollView from 'rn-faded-scrollview';
import { useIsFocused } from "@react-navigation/native";

import Header from "../../components/header/Header";
import styles from "./DetailScreen.styles";
import data from './data.json'
import images from "./images";
import { ScrollView } from "react-native-gesture-handler";
import * as Font from 'expo-font';
import { useCustomFonts } from './../fonts';

const DetailScreenClean = ({ route }) => {

    const isFocused = useIsFocused();
    const id = route.params.id
    const allData = data
    const [sound, setSound] = useState();
    const [percetange, setPercentage] = useState(0)
    const [passed, setPassed] = useState(0)
    const [isPaused, setIsPaused] = useState(false);
    const [isScrolled, setIsScrolled] = useState(true)
    const text = allData[id].transcript
    const [fontsLoaded] = useCustomFonts();

    useEffect(() => {
        if (Platform.OS === 'ios') {
            enableAudio();
        }

        if (isFocused) {
            playSound();
        }
        else {
            sound.stopAsync();
        }

        // Return a cleanup function to stop the sound when the component unmounts
        return () => {
            console.log('Stopping Sound');
            if (sound !== undefined) {
                sound.stopAsync();
            }
        };
    }, [isFocused]);

    useEffect(() => {
        const timer = setInterval(() => {
            calculatePosition()
        }, 1000)

        return (() => {
            clearInterval(timer)
        })

    }, [sound])

    const toggleSound = async () => {
        if (sound) {
            const status = await sound.getStatusAsync();
            if (status.isPlaying === true) {
                await sound.pauseAsync()
                setIsPaused(true)
            }
            else {
                await sound.playAsync()
                setIsPaused(false)
            }
        }
    }

    const calculatePosition = async () => {
        const status = await sound.getStatusAsync();
        if (status.isPlaying) {
            const progress = status.positionMillis / status.durationMillis;
            const percentage = Math.floor(progress * 100);
            console.log(`Played ${percentage}% of the audio`);
            setPercentage(percentage)
        }
    }

    const playSound = async () => {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('./../../assets/audio/001.ios.m4a'), { shouldPlay: true });
        setSound(sound)
        console.log('Playing Sound');
        await sound.playAsync();
    }

    const enableAudio = async () => {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            // shouldDuckAndroid: false,
        })
    }

    const scrollDown = () => {
        setIsScrolled(false)
    }

    const scrollUp = () => {
        setIsScrolled(true)
    }

    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    const radius = 55;
    const strokeWidth = 20;
    const duration = 500;
    const color = allData[id].color;
    const inactiveColor = '#EBE9E4'
    const delay = 0;
    const max = 100;
    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;
    const circleRef = React.useRef();
    const strokeDashoffset = circleCircumference - (circleCircumference * percetange) / 100;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header hasMenu={false} hasBackButton={true} />
            {
                isScrolled
                    ? (
                        <View style={styles.container}>
                            <Image source={images[id]}
                                style={{ height: 400, width: 300, marginBottom: 23 }} />
                            <View style={{ justifyContent: 'space-evenly' }}>

                                <Text style={[styles.name, { color: allData[id].color }]}>Full Name</Text>
                                <Text style={[styles.title, { color: allData[id].color }]}>Artist and Writer</Text>
                                <Text style={[styles.title, { color: allData[id].color }]}>02_1994</Text>
                                <View style={styles.player}>
                                    <TouchableOpacity
                                        onPress={toggleSound}
                                    >
                                        <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                                            <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
                                                <Circle cy='50%' cx='50%' stroke={inactiveColor} strokeWidth={strokeWidth} r={radius} fill='transparent' />
                                                {
                                                    isPaused
                                                        ? <Image source={require('./../../assets/icons/pause.png')} style={{ width: 25, height: 30, alignSelf: 'center', marginTop: '35%' }} />

                                                        : null
                                                }
                                                <AnimatedCircle ref={circleRef} cy='50%' cx='50%' stroke={color} strokeWidth={strokeWidth} r={radius} fill='transparent' strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} />

                                            </G>
                                        </Svg>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={scrollDown}>
                                    <Image source={require('./../../assets/icons/down_arrow.png')} style={{ height: 50, width: 50, alignSelf: 'center' }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                    : (

                        <View style={styles.containerScroll}>
                            <Text style={styles.title}>Full Name</Text>
                            <Text style={styles.title}>Artist and Writer</Text>
                            <Text style={styles.title}>02_1994</Text>
                            <View style={[styles.player, { marginBottom: 14 }]}>
                                <TouchableOpacity
                                    onPress={toggleSound}
                                >
                                    <Svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
                                        <G rotation='-90' origin={`${halfCircle}, ${halfCircle}`}>
                                            <Circle cy='50%' cx='50%' stroke={inactiveColor} strokeWidth={strokeWidth} r={radius} fill='transparent' />
                                            {
                                                isPaused
                                                    ? <Image source={require('./../../assets/icons/pause.png')} style={{ width: 25, height: 30, alignSelf: 'center', marginTop: '35%' }} />

                                                    : null
                                            }
                                            <AnimatedCircle ref={circleRef} cy='50%' cx='50%' stroke={color} strokeWidth={strokeWidth} r={radius} fill='transparent' strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} />

                                        </G>
                                    </Svg>
                                </TouchableOpacity>
                            </View>
                            {/* <ScrollView fadeSize={40} fadeColors={['#ffffff', '#ffffff00']} */}
                            <ScrollView
                                style={{ height: '80%' }}>
                                <Text style={styles.smallText}>
                                    {text}
                                </Text>

                                <TouchableOpacity
                                    onPress={scrollUp}
                                >
                                    <Image source={require('./../../assets/icons/up_arrow.png')} style={{ height: 50, width: 50, alignSelf: 'center' }} />
                                </TouchableOpacity>

                            </ScrollView>
                        </View>



                    )
            }

        </SafeAreaView>
    )



}

export default DetailScreenClean;