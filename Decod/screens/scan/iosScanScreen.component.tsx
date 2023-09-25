import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Dimensions, Platform, StyleSheet } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { Camera, CameraType } from 'expo-camera';
import { cameraWithTensors, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import styles from './ScanScreen.styles';
import '@tensorflow/tfjs-react-native/dist/platform_react_native'
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/header/Header';
import { DEV } from './../../config';
//IOS
// import * as FaceDetector from 'expo-face-detector'

const IOSScanScreen = ({ model }) => {

    const TensorCamera = cameraWithTensors(Camera);
    const navigation = useNavigation();

    let frame = 0;
//  IOS
//  let face = 0;
    let face = 1;
    const computeRecognitionEveryNFrames = 5;
    const startPrediction = async (model, tensor, face) => {
        try {
            const output = await model.predict(tensor, { batchSize: 1 });
            let resultData = output.dataSync();
            const results = [];
            for (let i = 0; i < resultData.length; i++) {
                results.push({ score: resultData[i], label: i });
            }
            results.sort((curr, prev) => prev.score - curr.score);
            tf.dispose([output, resultData])


            if (results[0].label != 103 && results[0].score > 0.70) {
                console.log("", results[0].label, " : ", results[0].score);

            }


            if (results[0].label != 0 && results[0].label != 103 && results[0].label != 102 && face == 1 && results[0].score > 0.98) {


                console.log("GOGO: ", results[0].label, " : ", results[0].score); navigation.push("Detail", { id: results[0].label })
            }
            if (results[0].label == 102 && results[0].score > 0.98 ) { navigation.push('Poetry') }

        } catch (error) {
            console.log('Error predicting from tesor image', error);
        }
    };
    // IOS
    // const handleFacesDetected = ({ faces }) => { face = 1; };
    let focusedScreen = false;
    useFocusEffect(
        React.useCallback(() => {
            focusedScreen = true;
            return () => {
                focusedScreen = false;
            };
        }, [])
    );

    console.log("id fosued " + focusedScreen)

    const handleCameraStream = async (images: IterableIterator<tf.Tensor3D>) => {
        const loop = async () => {

            if (frame % computeRecognitionEveryNFrames === 0 && focusedScreen == true && face == 1) {
                const nextImageTensor = images.next().value;

                if (nextImageTensor) {
                    const resizedImage = tf.image.resizeBilinear(nextImageTensor, [224, 224]);
                    const normalized = tf.tidy(() => {
                        const op = tf.expandDims(tf.sub(tf.div(tf.cast(resizedImage, 'float32'), 127.5), 1), 0);
                        return op
                    })

                    startPrediction(model, normalized, face)
                        .then(() => {
                            //IOS
                            // face=0;
                            face = 1;
                            tf.dispose([images, nextImageTensor, normalized, resizedImage]);
                        })
                        .catch((error) => {
                            console.log('Error predicting from tensor image', error);
                            tf.dispose([images, nextImageTensor, normalized, resizedImage]);
                        });
                }
            }
            frame += 1;
            frame = frame % computeRecognitionEveryNFrames;
            requestAnimationFrame(loop);
        }
        loop();
    }


    const containerHeight = Dimensions.get("window").width * 1080 / 608
    const screenHeight = Dimensions.get("window").height
    const extraSpace = screenHeight < containerHeight ? (containerHeight - screenHeight) / 2 : 0
    return (
        <>
            <View style={styles.mainContainer}>
                {
                    <>
                        <View style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }} pointerEvents="none">
                            <TensorCamera
                                style={styles.camera}
                                type={Camera.Constants.Type.back}
                                // IOS
                                //  onFacesDetected={handleFacesDetected}
                                resizeHeight={224}
                                resizeWidth={224}
                                resizeDepth={3}
                                onReady={handleCameraStream}
                                autorender={false}>
                            </TensorCamera>
                        </View>
                        <View style={{ position: 'absolute', top: 52, zIndex:33 }}>
                            <Header hasMenu={false} hasBack={false} hasIcon={true} />
                        </View>
                        
                    <View style={newStyles.mainContainer}>
                        <View style={newStyles.container}>
                            <Image
                                source={require('./../../assets/icons/target.png')}
                                style={newStyles.image}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                    </>
                }
            </View>
        </>
    )
};
const newStyles = StyleSheet.create({
    mainContainer: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        alignSelf: 'center'
    },
    container: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width,
        overflow: 'hidden',
    },
    image: {
        flex: 1,
        width: '100%'
    },
});

export default IOSScanScreen;