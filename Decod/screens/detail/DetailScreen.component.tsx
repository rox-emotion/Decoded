import React, { useRef } from "react";
import { View, Text, Platform, Animated, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useEffect, useState } from "react";
import { Audio } from 'expo-av';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Header from "../../components/header/Header";
import data from './data.json'
import images from "./images";
import { Dimensions } from 'react-native';
import RNFadedScrollView from 'expo-faded-scrollview';
import sounds from "./sounds";
import { CircularDraggableProgressBar } from "./circular/Circular";
import { TEXT_COLOR } from '../../utils';
import styles from "./DetailScreen.styles";
import { AppState } from 'react-native';

const DetailScreen = ({ route, navigation }) => {

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

    const spaceBetween = Dimensions.get("window").height > 700 ? 32 : 24
    const picHeight = Dimensions.get("window").height > 700 ? Dimensions.get("window").height - 410 : Dimensions.get("window").height - 330
    const radius = Dimensions.get("window").height > 700 ? 50 : 40
    const textContainerHeight = Dimensions.get("window").height > 700 ? 336 : 270

    //ANIMATIONS
    const scrollAnim = useRef(new Animated.Value(0)).current;
    const [isScrolled, setIsScrolled] = useState(false)
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        if (percetange >= 99) {
            moveTo(0, false)
            setPercentage(0)

        }
    }, [percetange]);

    useEffect(() => {
        // console.log('ei')
        // setIsScrolled(false)
        if (Platform.OS === 'ios') {
            enableAudio();
        }

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
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                // shouldDuckAndroid: false,
            })
        } catch (e) {
            console.log("enableAudio " + e)
        }
    }

    const moveTo = async (per, start) => {
        try {
        //   console.log('in moveTo')
          const status = await soundRef.current.getStatusAsync();
          const desiredPositionMillis = per / 100 * status.durationMillis;
          soundRef.current.setPositionAsync(desiredPositionMillis)
          try {
            if (start) {
            //   console.log('tot in moveto')
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
            // console.log('inauntru')
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
        <View style={styles.pageContainer}>
            {isScrolled
                ? null
                : <Header hasBack={true} hasIcon={true} hasMenu={false} />}

            <View style={styles.container}>

                {/* MAIN IMAGE */}
                <View style={{ height: picHeight, overflow: 'hidden' }}>
                    <Animated.Image
                        source={images[id]}
                        style={{
                            width: 'auto',
                            // height: (win.width - 56) * 4 / 3,
                            // height:200,
                            height: Dimensions.get("window").height - picHeight + 30,
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
                            marginBottom: 12
                        }}
                    />
                </View>
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: scrollAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -picHeight - 24],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                        width: Dimensions.get("window").width,
                    }}
                >
                    {
                        isScrolled
                            ? <Header hasBack={true} hasIcon={true} hasMenu={false} />
                            : null

                    }

                    <Text style={[styles.name, { color: allData[id].color }]}>{allData[id].name}</Text>
                    {profession.map((paragraph, index) => (
                                        <Text style={[styles.title, { color: allData[id].color } ]} key={index}>{paragraph}</Text>
                                    ))}
                    {
                        allData[id].DOB != 'NaN'
                            ? <Text style={[styles.title, { color: allData[id].color, marginBottom: spaceBetween }]}>{allData[id].DOB}</Text>
                            : <View style={{ height: 36 }}></View>
                    }
                    <View>
                        <CircularDraggableProgressBar value={percetange} callBack={(val) => { moveTo(val, true) }} pauseCallBack={() => { toggleSound(); setIsPaused(!isPaused) }} isPaused={isPaused} percentage={percetange} color={allData[id].color} radius={radius} />
                    </View>
                    {
                        isScrolled
                            ? null
                            : <TouchableOpacity onPress={() => { scrollDown() }}>
                                <Image source={require('./../../assets/icons/down_arrow.png')} style={{ height: 19, width: 38, alignSelf: 'center', marginTop: spaceBetween }} />
                            </TouchableOpacity>
                    }

                    {
                        isScrolled
                            ? <View style={{ height: Dimensions.get("window").height - textContainerHeight, marginHorizontal: 28, marginTop: spaceBetween }}>
                                <RNFadedScrollView allowStartFade={true} fadeSize={40} allowEndFade={false}
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    fadeColors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.99)']}>

                                    {text.map((paragraph, index) => (
                                        <Text style={[styles.smallText]} key={index}>{paragraph}</Text>
                                    ))}
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
