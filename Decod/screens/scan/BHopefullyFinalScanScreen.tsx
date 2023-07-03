import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Dimensions, Platform } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { Camera, CameraType } from 'expo-camera';
import { cameraWithTensors, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import styles from './ScanScreen.styles';
import { TouchableOpacity } from 'react-native';
import '@tensorflow/tfjs-react-native/dist/platform_react_native'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Header from '../../components/header/Header';
import { DEV } from './../../config';
import { captureRef, captureScreen } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import * as FaceDetector from 'expo-face-detector';
import { Video } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';
import DetailScreenFinal from '../detail/DetailScreen.component';
import AllScreen from '../all/AllScreen.component';
import AboutScreen from '../about/AboutScreen.component';
import BDetailScreenFinal from '../detail/BDetailScreenFinal.component';
import CScan from './CScan';
import DScan from './DScan';

const BFinalFinalScan = () => {
    const modelJson = require('./../../assets/model/model.json')
    const modelWeights = require('./../../assets/model/weights.bin')
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const TensorCamera = cameraWithTensors(Camera);

    const cameraRef = useRef<Camera>(null);
    const navigation = useNavigation();
    const isFocused = useIsFocused()
    const model = useSelector(state => state.model.model);
    const viewShotRef = useRef();
    const [sursa, setSursa] = useState('');
    const imageRef = useRef(null);
    const videoRef = useRef<Video>(null);

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


            if (results[0].label != 0 && results[0].label != 103 && results[0].score > 0.9) { navigation.navigate("Detail", { id: results[0].label }) }


        } catch (error) {
            console.log('Error predicting from tesor image', error);
        }
    };
    const handleFacesDetected = ({ faces }) => { face = 1; };
    const handleCameraStream = async (images: IterableIterator<tf.Tensor3D>, updatePreview, gl) => {
        const model = await tf.loadLayersModel(bundleResourceIO(modelJson,
            modelWeights));
        const loop = async () => {
            if (frame % computeRecognitionEveryNFrames === 0 && face === 1) {

                const nextImageTensor = images.next().value;
                if (nextImageTensor) {
                    console.log("cevaceva")
                    const resizedImage = tf.image.resizeBilinear(nextImageTensor, [224, 224]);
                    const normalized = tf.expandDims(tf.sub(tf.div(tf.cast(resizedImage, 'float32'), 127.5), 1), 0);
                    const prediction = startPrediction(model, normalized);
                    face = 0;
                    tf.dispose([normalized]);
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
        width: 1080
    }

    const [showScan, setShowScan] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [showAbout, setShowAbout] = useState(false);
    const [showAll, setShowAll] = useState(false);


    const scanScreenReturn = () => {
        return (
            <>
                <View ref={videoRef} style={styles.mainContainer}>
                    {
                        isFocused && (
                            <>

                                <View style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }} pointerEvents="none">
                                    <TensorCamera
                                        // Standard Camera props
                                        style={styles.camera}
                                        type={Camera.Constants.Type.back}
                                        // Tensor related props
                                        // cameraTextureHeight={textureDims.height}
                                        // cameraTextureWidth={textureDims.width}
                                        resizeHeight={224}
                                        resizeWidth={224}
                                        resizeDepth={3}
                                        onReady={handleCameraStream}
                                        autorender={true}>

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
                <BDetailScreenFinal id={5} />
            </>
        )
    }

    let screenContent: JSX.Element;


    //   } else if (showDetails) {
    //     console.log('details')
    //     screenContent = <BDetailScreenFinal id={5} />;
    //   } else if (showAll) {
    //     console.log('all')
    //     screenContent = <AllScreen />;
    //   } else if (showAbout) {
    //     console.log('about')
    //     screenContent = <AboutScreen />;
    //   } else {
    //     screenContent = <Text>Ceva nu o mers</Text>;
    //   }

    return (
        <>
            <CScan />
            {
                showDetails
                    ? <DScan />
                    : null
            }
        </>
    )


};

export default BFinalFinalScan;