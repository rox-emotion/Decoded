import React, { useRef } from "react";
import { View, Text, Platform, Animated, Image, TouchableOpacity, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import { useEffect, useState } from "react";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Header from "../../components/header/Header";
import data from './data.json'
import images from "./images";
import { Dimensions } from 'react-native';
import RNFadedScrollView from 'expo-faded-scrollview';
import sounds from "./sounds";
import { CircularDraggableProgressBar } from "./circular/Circular";
import styles from "./DetailScreen.styles";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DetailScreen = ({ route, navigation }) => {
    if (Platform.OS == 'android') {
        StatusBar.setBackgroundColor('white');
    }


    const id = route.params.id - 1
    const allData = data
    const [percetange, setPercentage] = useState(0)
    const [isPaused, setIsPaused] = useState(false);
    const text = allData[id].transcript.split('\n')
    const isFocused = useIsFocused()
    const win = Dimensions.get('window');
    const ratio = (win.width - 56) / 1944;
    const nav = useNavigation()
    const soundRef = useRef();
    const profession = allData[id].title.split('\n')

    const insets = useSafeAreaInsets();
    const bottomNavBarHeight = insets.bottom;

    const [textHeight, setTextHeight] = useState(0)
    const [available, setAvailable] = useState(0)

    let elements = 38 + 12 + textHeight + 24 + 115 + 19

    let picHeight = available - elements

    let textContainerHeight = available - (38 + 12 + textHeight + 115 + 32)


    //ANIMATIONS
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const [isScrolled, setIsScrolled] = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const containerRef = useRef(null);
    const mainRef = useRef(null);

    const handleMainLayout = () => {
        if (mainRef.current) {
            mainRef.current.measure((x, y, width, height) => {
                setAvailable(height)
            });
        }
    }
    const handleLayout = () => {
        if (containerRef.current) {
            containerRef.current.measure((x, y, width, height) => {
                setTextHeight(height)
            });
        }
    };

    useEffect(() => {
        if (percetange >= 99.9) {
            moveTo(0, false)
            setPercentage(0)
        }
    }, [percetange]);



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

    useEffect(() => {
        const unsubscribe = nav.addListener('beforeRemove', () => {
            pauseSound();
        });

        return unsubscribe;
    }, [nav]);

    useEffect(() => {

        const timer = setInterval(() => {
            calculatePosition()
        }, 50)

        return (() => {
            clearInterval(timer)
        })

    }, [soundRef])


    const toggleSound = async () => {
        if (soundRef.current) {
            try {
                const status = await soundRef.current.getStatusAsync();
                if (status.isPlaying === true) {
                    await soundRef.current.pauseAsync()
                    setIsPaused(true)
                }
                else {
                    await soundRef.current.playAsync()
                    setIsPaused(false)
                }
            } catch (e) {
                console.log('toggleSound' + e)
            }
        }
    }

    const calculatePosition = async () => {
        if (soundRef.current) {
            try {
                const status = await soundRef.current.getStatusAsync();
                if (status.isPlaying) {
                    const progress = status.positionMillis / status.durationMillis;
                    const percentage = progress * 100 + 1;
                    setPercentage(percentage);
                }
            } catch (e) {
                console.log('calculatePosition ' + e)
            }
        }
    };

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(sounds[id], { shouldPlay: true });
            soundRef.current = sound;
            await sound.playAsync();
        } catch (e) {
            console.log('playSound ' + e)
        }
    };


    const pauseSound = async () => {
        try {
            if (soundRef.current) {
                await soundRef.current.pauseAsync();
            }
        } catch (e) {
            console.log('pauseSound ' + e)
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

    const moveTo = async (per, start) => {
        try {
            const status = await soundRef.current.getStatusAsync();
            const desiredPositionMillis = per / 100 * status.durationMillis;
            soundRef.current.setPositionAsync(desiredPositionMillis)
            try {
                if (start) {
                    if (!status.isPlaying) {
                        soundRef.current.playAsync()
                        setIsPaused(false)
                    }
                } else {
                    if (status.isPlaying) {
                        soundRef.current.pauseAsync()
                        setIsPaused(true)
                    }
                }
            } catch (e) {
                console.log('moving error ' + e)
            }
        }
        catch (e) {
            console.error("Moving Seek Error" + e)
        }
    };


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
        <View ref={mainRef} onLayout={handleMainLayout} style={[styles.pageContainer, { marginBottom: bottomNavBarHeight }]}>
            <View style={styles.container}>
                <Header hasBack={true} hasIcon={true} hasMenu={false} />
                <View style={{ height: picHeight, overflow: 'hidden', marginTop: 12 }}>
                    <Animated.Image
                        source={images[id]}
                        style={{
                            width: 'auto',
                            height: picHeight,
                            aspectRatio: 3 / 4,
                            opacity: scrollAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                                extrapolate: 'clamp',
                            }),
                            transform: [
                                {
                                    translateY: scrollAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, - ((win.width - 56) * 4 / 3)],
                                        extrapolate: 'clamp',
                                    }),
                                },
                                {
                                    translateY: -16
                                },
                            ],
                        }}
                    />
                </View>
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: scrollAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -picHeight],
                                    extrapolate: 'clamp',
                                })
                            },
                        ],
                        width: Dimensions.get("window").width,

                    }}
                >
                    <View ref={containerRef}
                        onLayout={handleLayout}
                    >
                        <Text style={[styles.name, { color: allData[id].color, marginTop: 16 }]}>{allData[id].name}</Text>
                        {profession.map((paragraph, index) => (
                            <Text style={[styles.title, { color: allData[id].color }]} key={index}>{paragraph}</Text>
                        ))}
                        {
                            allData[id].DOB != 'NaN'
                                ? <Text style={[styles.title, { color: allData[id].color, marginBottom: 32 }]}>{allData[id].DOB}</Text>
                                : <View style={{ height: 36 }}></View>
                        }
                    </View>
                    <View>
                        <CircularDraggableProgressBar value={percetange} callBack={(val) => { moveTo(val, true) }} pauseCallBack={() => { toggleSound(); setIsPaused(!isPaused) }} isPaused={isPaused} percentage={percetange} color={allData[id].color} />
                    </View>
                    {
                        isScrolled
                            ? null
                            : <TouchableOpacity onPress={() => { scrollDown() }}>
                                <Image source={require('./../../assets/icons/down_arrow.png')} style={{
                                    height: 19, width: 38, alignSelf: 'center',
                                    marginTop: 32
                                }} />
                            </TouchableOpacity>
                    }

                    {
                        isScrolled
                            ? <View style={{ height: textContainerHeight, marginHorizontal: 28, marginTop: 40 }}>

                                <RNFadedScrollView allowStartFade={true} allowEndFade={true} fadeSize={40}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    fadeColors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.99)']}>

                                    {text.map((paragraph, index) => (
                                        <Text style={[styles.smallText]} key={index}>{paragraph}</Text>
                                    ))}

                                    {allData[id].spanishTranscript 
                                    ? <Text style={[styles.smallText, {fontFamily:'californian-italic'}]}>{allData[id].spanishTranscript}</Text>
                                    : null
                                    }
                                </RNFadedScrollView>
                                <TouchableOpacity onPress={scrollUp}>
                                    <Image source={require('./../../assets/icons/up_arrow.png')} style={{ height: 19, width: 38, alignSelf: 'center', marginTop: 18 }} />
                                </TouchableOpacity>
                            </View>

                            : null
                    }
                </Animated.View>
            </View>
        </View>


    )
}

export default DetailScreen;
