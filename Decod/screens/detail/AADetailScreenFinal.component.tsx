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
import { CircularDraggableProgressBar } from "./circular/Circular";

const DetailScreenFinal = ({ route, navigation }) => {

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
   
    const spaceBetween = Dimensions.get("window").height > 700 ? 32 : 16
    const picHeight = Dimensions.get("window").height > 700 ? Dimensions.get("window").height - 370 : Dimensions.get("window").height - 322

    console.log(Dimensions.get("window").height)
    useEffect(() => {
        if(percetange>=99){
            moveTo(0,false)
            setPercentage(0)
            
        }
    }, [percetange]);
    
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
                const percentage = progress * 100 + 1;
                setPercentage(percentage);
            }
        }
    };

    const playSound = async () => {
        if (soundRef.current) {
            await soundRef.current.playAsync();
        } else {
            // console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(sounds[id], { shouldPlay: true });
            soundRef.current = sound;
            // console.log('Playing Sound');
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

    const moveTo = async (per,start) => {
        try {
            const status = await soundRef.current.getStatusAsync();
            console.log(status.durationMillis)
            const desiredPositionMillis = per / 100 * status.durationMillis;
            console.log(desiredPositionMillis)
            soundRef.current.setPositionAsync(desiredPositionMillis)
            if(start){
                if(!status.isPlaying){
                    soundRef.current.playAsync()
                    setIsPaused(false)
                }
            }else {
                if(status.isPlaying){
                    soundRef.current.pauseAsync()
                    setIsPaused(true)
                }
            }
          
        }
        catch (e) {
            console.log(e)
        }

    }

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
        <View style={styles.pageContainer}>
            <View style={{marginTop:19}}>
                <Header hasBack={true} hasIcon={true} hasMenu={false} />
            </View>
            <View style={styles.container}>
                {/* MAIN IMAGE */}
                <Animated.Image
                    source={images[id]}
                    style={{
                        width: win.width - 56,
                        height: picHeight,
                        opacity: scrollAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0],
                            extrapolate: 'clamp',
                        }),
                        transform: [
                            {
                                translateY: scrollAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -picHeight],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                        marginBottom:12
                    }}
                />
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: scrollAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -picHeight - 12],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    }}
                >


                    <Text style={[styles.name, { color: allData[id].color }]}>{allData[id].name}</Text>
                    <Text style={[styles.title, { color: allData[id].color }]}>{allData[id].title}</Text>
                    {
                        allData[id].DOB != 'NaN'
                            ? <Text style={[styles.title, { color: allData[id].color, marginBottom: spaceBetween }]}>{allData[id].DOB}</Text>
                            : null
                    }
                    <View>
                        <CircularDraggableProgressBar value={percetange} callBack={(val) => { moveTo(val, true) }} pauseCallBack={() => { toggleSound(); setIsPaused(!isPaused)}} isPaused={isPaused} percentage={percetange} color={allData[id].color} />
                    </View>
                    {
                        isScrolled
                            ? null
                            : <TouchableOpacity onPress={() => { scrollDown() }}>
                                <Image source={require('./../../assets/icons/down_arrow.png')} style={{ height: 19, width: 38, alignSelf: 'center', marginTop:spaceBetween }} />
                            </TouchableOpacity>
                    }

                    {
                        isScrolled
                            ? <View style={{ height: Dimensions.get("window").height - 322, marginTop:spaceBetween}}>
                                <RNFadedScrollView allowStartFade={true} fadeSize={40} allowEndFade={false}

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

export default DetailScreenFinal;
