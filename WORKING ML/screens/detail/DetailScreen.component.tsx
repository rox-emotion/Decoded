import React from "react";
import { View, Text, SafeAreaView, Platform, Animated, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from "react";
import Svg, { G, Circle, Rect } from 'react-native-svg';
import { Audio } from 'expo-av';
import { useIsFocused } from "@react-navigation/native";

import Header from "../../components/header/Header";
import styles from "./DetailScreen.styles";
import data from './data.json'
import images from "./images";
import { Dimensions } from 'react-native';
import RNFadedScrollView from 'expo-faded-scrollview';

const DetailScreenClean = ({ route, navigation }) => {

    const id = route.params.id
    const allData = data
    const [sound, setSound] = useState();
    const [percetange, setPercentage] = useState(0)
    const [passed, setPassed] = useState(0)
    const [isPaused, setIsPaused] = useState(false);
    const [isScrolled, setIsScrolled] = useState(true)
    const text = allData[id].transcript
    const isFocused = useIsFocused()

    const win = Dimensions.get('window');
    const ratio = win.width / 1944;

    useEffect(() => {
        if (Platform.OS === 'ios') {
            enableAudio();
        }

        if (isFocused === true) {
            console.log('play')
            playSound();
        } else if (isFocused === false) {
            console.log('stop')
            pauseSound();
        }

        return () => {
            pauseSound()
        }
    }, [isFocused]);

    useEffect(() => {
        // ...
        const unsubscribe = navigation.addListener('blur', () => {
          console.log('blur');
          pauseSound();
        });
        return unsubscribe;
      }, []);

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
            // console.log(`Played ${percentage}% of the audio`);
            setPercentage(percentage)
        }
    }

    const playSound = async () => {
        if (sound) {
            await sound.playAsync();
        }
        else {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(require('./../../assets/audio/001.ios.m4a'), { shouldPlay: true });
            setSound(sound)
            console.log('Playing Sound');
            await sound.playAsync();
        }

    }

    const pauseSound = async () => {
        if (sound) {
            console.log('Pausing Sound');
            await sound.pauseAsync();
        }
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
            <Header hasBack={true} hasIcon={true} hasMenu={false} />
            {
                isScrolled
                    ? (
                        <View style={styles.container}>
                            <Image source={images[id]}
                                style={{ width: win.width - 56, height: 2598 * ratio - 100, marginBottom: 16 }} />
                            <View style={{ justifyContent: 'space-evenly' }}>

                                <Text style={[styles.name, { color: allData[id].color }]}>Alyssarhaye Graciano</Text>
                                <Text style={[styles.title, { color: allData[id].color }]}>Artist and Writer</Text>
                                <Text style={[styles.title, { color: allData[id].color, marginBottom: 20 }]}>02_1994</Text>
                                <View style={[styles.player, { marginBottom: 24 }]}>
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
                            <Text style={[styles.name, { color: allData[id].color }]}>Alyssarhaye Graciano</Text>
                            <Text style={[styles.title, { color: allData[id].color }]}>Artist and Writer</Text>
                            <Text style={[styles.title, { color: allData[id].color }]}>02_1994</Text>
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
                            <RNFadedScrollView allowStartFade={true} fadeSize={40} allowEndFade={false}
                                fadeColors={['rgba(216, 216, 216, 0.1)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.99)']}
                            >

                                <Text style={styles.smallText}>
                                    {text}
                                </Text>

                                <TouchableOpacity
                                    onPress={scrollUp}
                                >
                                    <Image source={require('./../../assets/icons/up_arrow.png')} style={{ height: 50, width: 50, alignSelf: 'center' }} />
                                </TouchableOpacity>

                            </RNFadedScrollView>
                        </View>



                    )
            }

        </SafeAreaView>
    )



}

export default DetailScreenClean;