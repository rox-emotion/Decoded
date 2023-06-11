import React, { useRef } from "react";
import { View, Text, SafeAreaView, Platform, Animated, Image, TouchableOpacity } from 'react-native';
import { useEffect, useState } from "react";
import Svg, { G, Circle, Rect } from 'react-native-svg';
import { Audio } from 'expo-av';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Header from "../../components/header/Header";
import styles from "./DetailScreen.styles";
import data from './data.json'
import images from "./images";
import { Dimensions } from 'react-native';
import RNFadedScrollView from 'expo-faded-scrollview';
import sounds from "./sounds";

const DetailScreenClean = ({ route, navigation }) => {

    const id = route.params.id
    const allData = data
    const [percetange, setPercentage] = useState(0)
    const [isPaused, setIsPaused] = useState(false);
    const text = allData[id].transcript.split('\n')
    const isFocused = useIsFocused()
    const win = Dimensions.get('window');
    const ratio = win.width / 1944;
    const nav = useNavigation()
    const soundRef = useRef();

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
        const unsubscribe = nav.addListener('beforeRemove', () => {
            console.log('backback')
            pauseSound();
        });

        return unsubscribe;
    }, [nav]);

    useEffect(() => {
        const timer = setInterval(() => {
            calculatePosition()
        }, 1000)

        return (() => {
            clearInterval(timer)
        })

    }, [soundRef])

    const toggleSound = async () => {
        if (soundRef.current) {
            const status = await soundRef.current.getStatusAsync();
            if (status.isPlaying === true) {
                await soundRef.current.pauseAsync()
                setIsPaused(true)
            }
            else {
                await soundRef.current.playAsync()
                setIsPaused(false)
            }
        }
    }

    const calculatePosition = async () => {
        if (soundRef.current) {
            const status = await soundRef.current.getStatusAsync();
            if (status.isPlaying) {
                const progress = status.positionMillis / status.durationMillis;
                const percentage = Math.floor(progress * 100);
                setPercentage(percentage);
            }
        }
    };

    const playSound = async () => {
        if (soundRef.current) {
            await soundRef.current.playAsync();
        } else {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(sounds[id], { shouldPlay: true });
            soundRef.current = sound;
            console.log('Playing Sound');
            await sound.playAsync();
        }
    };

    const pauseSound = async () => {
        if (soundRef.current) {
            console.log('Pausing Sound');
            await soundRef.current.pauseAsync();
        }
    };

    const enableAudio = async () => {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            // shouldDuckAndroid: false,
        })
    }


    const AnimatedCircle = Animated.createAnimatedComponent(Circle);
    const radius = 55;
    const strokeWidth = 20;
    const color = allData[id].color;
    const inactiveColor = '#EBE9E4'
    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;
    const circleRef = React.useRef();
    const strokeDashoffset = circleCircumference - (circleCircumference * percetange) / 100;


    //ANIMATIONS
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const [isScrolled, setIsScrolled] = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current;


    const scrollDown = () => {
        Animated.parallel([
            Animated.timing(scrollAnim, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: -2000 * ratio,
                duration: 900,
                useNativeDriver: true,
            })
        ]).start();
        const timer = setTimeout(() => {
            setIsScrolled(true)
        }, 900)
    }

    const scrollUp = () => {
        setIsScrolled(false)
        Animated.timing(scrollAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
        }).start()
    };

    return (
        <SafeAreaView style={styles.pageContainer}>
            <View style={styles.mainContainer}>
                <Header hasBack={true} hasIcon={true} hasMenu={false} />
                <View style={{ height: Dimensions.get("window").height - 400, overflow: 'hidden' }}>
                    <Animated.Image
                        source={images[id]}
                        style={{
                            width: win.width - 56,
                            height: 2598 * ratio - 100,
                            marginBottom: 16,
                            opacity: scrollAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                                extrapolate: 'clamp',
                            }),
                            transform: [
                                {
                                    translateY: scrollAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, -2598 * ratio],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                            marginTop: 24
                        }}
                    />
                </View>

                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: scrollAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -2598 * ratio + 100],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                        height: Dimensions.get('window').height - 80,
                        marginTop: 16,
                    }}
                >
                    <View style={{ justifyContent: 'space-evenly' }}>

                        <Text style={[styles.name, { color: allData[id].color }]}>{allData[id].name}</Text>
                        <Text style={[styles.title, { color: allData[id].color }]}>{allData[id].title}</Text>
                        {
                            allData[id].DOB != 'NaN'
                                ? <Text style={[styles.title, { color: allData[id].color, marginBottom: 20 }]}>{allData[id].DOB}</Text>

                                : null
                        }
                        {/* //PLAYER */}
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
                        {
                            isScrolled
                                ? null
                                : <TouchableOpacity onPress={() => { scrollDown() }}>
                                    <Image source={require('./../../assets/icons/down_arrow.png')} style={{ height: 50, width: 50, alignSelf: 'center' }} />
                                </TouchableOpacity>
                        }
                    </View>
                    {
                        isScrolled
                            ? <>
                                <RNFadedScrollView allowStartFade={true} fadeSize={40} allowEndFade={false}
                                    // style={{marginBottom:20}}
                                    fadeColors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.99)']}>

                                    {text.map((paragraph, index) => (
                                        <Text style={[styles.smallText, { marginBottom: 14 }]} key={index}>{paragraph}</Text>
                                    ))}
                                </RNFadedScrollView>
                                <TouchableOpacity
                                    onPress={scrollUp}

                                >
                                    <Image source={require('./../../assets/icons/up_arrow.png')} style={{ height: 50, width: 50, alignSelf: 'center' }} />
                                </TouchableOpacity>
                            </>

                            : null
                    }

                </Animated.View>
            </View>

        </SafeAreaView >
    )
}

export default DetailScreenClean;
