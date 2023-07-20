import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Dimensions, Platform } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { Camera, CameraType } from 'expo-camera';
import { cameraWithTensors, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import styles from './ScanScreen.styles';
import { TouchableOpacity } from 'react-native';
import '@tensorflow/tfjs-react-native/dist/platform_react_native'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Header from '../../components/header/Header';
import { DEV } from './../../config';
import * as FaceDetector from 'expo-face-detector';
import { Video } from 'expo-av';

const IOSScanScreen = ({ model }) => {
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const TensorCamera = cameraWithTensors(Camera);
    const cameraRef = useRef<Camera>(null);
    const navigation = useNavigation();
    const isFocused = useIsFocused()
    const videoRef = useRef<Video>(null);

    useEffect(() => {
        askForPermissions()
    }, [])
    const askForPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync()
        setHasCameraPermission(status === 'granted');
    };

    let frame = 0;
    let face = 0;
    const computeRecognitionEveryNFrames = 10;
    const startPrediction = async (model, tensor) => {
        try {
            const output = await model.predict(tensor, { batchSize: 1 });
            let resultData = output.dataSync();
            const results = [];

            for (let i = 0; i < resultData.length; i++) {
                results.push({ score: resultData[i], label: i });
            }
            results.sort((curr, prev) => prev.score - curr.score);

            if (results[0].label != 0 && results[0].label != 103 && results[0].score > 0.98) { navigation.navigate("Detail", { id: results[0].label }) }
            tf.dispose([output, resultData])

        } catch (error) {
            console.log('Error predicting from tesor image', error);
        }
    };

    const handleFacesDetected = ({ faces }) => { face = 1; };
    const handleCameraStream = async (images: IterableIterator<tf.Tensor3D>) => {
        const loop = async () => {
            if (frame % computeRecognitionEveryNFrames === 0 && face === 1) {

                const nextImageTensor = images.next().value;
                if (nextImageTensor) {
                    const resizedImage = tf.image.resizeBilinear(nextImageTensor, [224, 224]);
                    const normalized = tf.expandDims(tf.sub(tf.div(tf.cast(resizedImage, 'float32'), 127.5), 1), 0);
                    // const prediction = startPrediction(model, normalized);
                    // face = 0;
                    // tf.dispose([normalized]);
                    startPrediction(model, normalized)
                        .then(() => {
                            face = 0;
                            tf.dispose([nextImageTensor, normalized, resizedImage]);
                        })
                        .catch((error) => {
                            console.log('Error predicting from tensor image', error);
                            tf.dispose([nextImageTensor, normalized, resizedImage]);
                        });
                }
            }
            frame += 1;
            frame = frame % computeRecognitionEveryNFrames;

            requestAnimationFrame(loop);
        }
        loop();
    }

    let textureDims;
    textureDims = {
        height: 1920,
        width: 1080,
    };
    return (
        <>
            <View ref={videoRef} style={styles.mainContainer}>
                {
                    isFocused && (
                        <>

                            <View style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }} pointerEvents="none">
                                <TensorCamera
                                    style={styles.camera}
                                    type={Camera.Constants.Type.back}
                                    onFacesDetected={handleFacesDetected}
                                    faceDetectorSettings={{
                                        mode: FaceDetector.FaceDetectorMode.fast,
                                        detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                                        runClassifications: FaceDetector.FaceDetectorClassifications.none,
                                        minDetectionInterval: 100,
                                        tracking: true,
                                    }}
                                    resizeHeight={224}
                                    resizeWidth={224}
                                    resizeDepth={3}
                                    onReady={handleCameraStream}
                                    autorender={false}>
                                </TensorCamera>

                            </View>

                            <View style={{ position: 'absolute', top: 0 }}>
                                <Header hasMenu={false} hasBack={false} hasIcon={true} />
                            </View>
                            <Image
                                source={require('./../../assets/icons/target_icon.png')}
                                style={styles.imageContainer}

                            />
                        </>

                    )
                }
            </View>
        </>
    )
};

export default IOSScanScreen;