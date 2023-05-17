import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import styles from './ScanScreen.styles';
import { TouchableOpacity } from 'react-native';
import '@tensorflow/tfjs-react-native/dist/platform_react_native'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Header from '../../components/header/Header';
import { DEV } from './../../config';
import { captureRef } from 'react-native-view-shot';

const FinalFinalScan = () => {

    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const cameraRef = useRef<Camera>(null);
    const isFocused = useIsFocused()
    const model = useSelector(state => state.model.model);
    let countBad = 0;
    let mehPredictions: number[] = [];
    let goodPredictions: number[] = [];
    const [shouldProcess, setShouldProcess] = useState(true);

    const navigation = useNavigation();

   


    useEffect(() => {
        askForPermissions()
    }, [])
    useEffect(() => {
        if (isFocused) {
            const timer = setTimeout(() => {
                main()
            }, 3000)

            return () => {
                setShouldProcess(true); // Reset shouldProcess when component is unfocused
                clearTimeout(timer); // Clear the timer when the component is unfocused
            }

        }
    }, [isFocused]);

    const askForPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync()
        setHasCameraPermission(status === 'granted');
        console.log('CAMERA PERMISSION GRANTED');
    };

    const resizeImage = async (photoUri: string) => {
        const resizedImage = await ImageManipulator.manipulateAsync(
            photoUri,
            [{ resize: { width: 256, height: 256 } }],
            { format: ImageManipulator.SaveFormat.JPEG }
        );
        return resizedImage;
    };

    const transformImageToTensor = async (uri) => {
        const resizedImage = await resizeImage(uri);
        if (resizedImage.uri) {
            const imageString = await FileSystem.readAsStringAsync(resizedImage.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const imageBytes = new Uint8Array(Buffer.from(imageString, 'base64'));
            const imageTensor = decodeJpeg(imageBytes);
            const normalizedImageTensor = imageTensor.div(255.0);
            const reshapedImageTensor = tf.reshape(normalizedImageTensor, [1, 256, 256, 3])
            return reshapedImageTensor
        }
        else {
            console.error('PIC BROKEN')
        }
    }

    const main = async () => {

        while (isFocused) {
            if (!shouldProcess) {
                break; // Stop the loop if shouldProcess is false
            }
            let photo = { uri: './' };
            if (cameraRef.current) {

                try {
                    console.log('Start picture taking');
                    const uri = await captureRef(cameraRef, {
                        format: 'jpg',
                        quality: 0.8,
                    });
                    processImage(uri);
                } catch (error) {
                    console.error(error);
                }

            }

            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    const processImage = async (uri) => {
        const processedImg = await transformImageToTensor(uri);
        const prediction = await model.predict(processedImg);
        const predictedClassIndex = prediction.argMax(-1).dataSync()[0];
        const confidenceLevel = parseFloat((prediction.dataSync()[predictedClassIndex] * 100).toFixed(2));
        console.log(predictedClassIndex + "   " + confidenceLevel)

        //HELLO ROX DIN VIITOR THIS IS ROX DIN TRECUT
        //deci ce nu mergea aici e ca o data ce navighezi mai incolo  spre details, cand vii inapoi aporoape imediat navigeaza iar inspre details
        //ce m-am gandit ca ar putea sa fie sunt acele async-uri care se cheama si care nu se opresc
        //am incercat sa le opresc folosindu-ma de should process, dar e clar ca nu merge asa ca va trebui sa figure it out
        // sau s-ar putea sa fie ceva cache dubios im not sure
        //asa ca vor the time being, am eliminat branch-ul cu >15 pentru .apk-ul asta si vom vedea mai incolo ce se intampla


        // if (confidenceLevel >= 15) {  //BEST CASE SCENARIO - IMAGE IS RECOGNIZED ON FIRST TRY
        //     setShouldProcess(false); // Set shouldProcess to false to stop further processing
        //     navigation.navigate('Detail', { id: predictedClassIndex });

        // }
        if (confidenceLevel <= 3) { //WORST CASE SCENARIO - NO IMAGE IS RECOGNIZED. TRIES WITH 50 IMAGES (LIKE HALF A MINUTE) AND THEN TELLS THEM TO FUCK OFF
            countBad++;
            console.log(countBad)
            if (countBad == 50) {
                console.log("PLEASE TAKE A NORMAL PHOTO")
                countBad = 0
            }
        }
        else if (confidenceLevel > 3 && confidenceLevel < 7) { //MEH CASE - IMAGE IS RECOGNIZED SOMETIMES. TRIES WITH 10 OF THEM AND AT LEAST 7 NEED TO BE THE SAME
            mehPredictions.push(predictedClassIndex)
            console.log("avem " + mehPredictions.length + " poze")
            if (mehPredictions.length == 10) {
                handleMehPredictions(mehPredictions)
            }
        }
        else if (confidenceLevel >= 7) { //AVERAGE CASE - IMAGE IS SEMI-RECOGNIZED. TRIES WITH 5 IMAGES, OUT OF WHICH 4 MUST BE THE SAME
            goodPredictions.push(predictedClassIndex)
            console.log("avem " + goodPredictions.length + " poze")
            if (goodPredictions.length == 5) {
                handleGoodPredictions(goodPredictions)
            }
        }
    }

    const handleGoodPredictions = (predictions) => {

        goodPredictions = [];
        const counts = {};

        for (let i = 0; i < predictions.length; i++) {
            const prediction = predictions[i];
            counts[prediction] = counts[prediction] ? counts[prediction] + 1 : 1;
        }

        let maxCount = 0;
        let predictedClassIndex;

        for (const prediction in counts) {
            if (counts[prediction] > maxCount) {
                maxCount = counts[prediction];
                predictedClassIndex = prediction;
            }
        }

        let correctlyFound = false;
        if (predictedClassIndex !== undefined && counts[predictedClassIndex] >= 3) {
            console.log('The predicted class index is:', predictedClassIndex);
            correctlyFound = true;
            navigation.navigate('Detail', { id: predictedClassIndex });
        }


        if (!correctlyFound) {
            console.log('The predicted class was not found enough');
            main();
        }

    }

    const handleMehPredictions = (predictions) => {

        mehPredictions = [];
        const counts = {};

        for (let i = 0; i < predictions.length; i++) {
            const prediction = predictions[i];
            counts[prediction] = counts[prediction] ? counts[prediction] + 1 : 1;
        }

        let maxCount = 0;
        let predictedClassIndex;

        for (const prediction in counts) {
            if (counts[prediction] > maxCount) {
                maxCount = counts[prediction];
                predictedClassIndex = prediction;
            }
        }

        let correctlyFound = false;
        if (predictedClassIndex !== undefined && counts[predictedClassIndex] >= 7) {
            console.log('The predicted class index is:', predictedClassIndex);
            correctlyFound = true;
            navigation.navigate('Detail', { id: predictedClassIndex });
        }


        if (!correctlyFound) {
            console.log('The predicted class was not found enough');
            main();
        }

    }

    if (DEV) {
        return (
            <View style={styles.mainContainer}>
                <Header hasMenu={false} hasBack={false} hasIcon={true} />
                <TouchableOpacity style={{ zIndex: 1 }} onPress={() => { navigation.navigate('Debug') }}>
                    <Text style={{ fontSize: 28, color: 'red' }}>Debug</Text>
                </TouchableOpacity>
                {
                    isFocused && (
                        <Camera
                            style={styles.cameraDev}
                            type={CameraType.back} ref={cameraRef}
                        >
                            <Image
                                source={require('./../../assets/icons/target_icon.png')}
                                style={{ height: 157, width: 95, marginTop: Dimensions.get('window').height * 0.23, alignSelf: 'center' }}

                            />
                        </Camera>
                    )

                }

            </View>
        );
    }
    else {
        return (
            <View style={styles.mainContainer}>
                {
                    isFocused && (
                        <Camera
                            style={styles.camera}
                            type={CameraType.back} ref={cameraRef}
                        >
                            <View style={{ paddingTop: 28 }}>
                                <Header hasMenu={false} hasBack={false} hasIcon={true} />
                            </View>

                            <Image
                                source={require('./../../assets/icons/target_icon.png')}
                                style={{ height: 157, width: 95, marginTop: Dimensions.get('window').height * 0.05, alignSelf: 'center' }}

                            />
                        </Camera>
                    )

                }
            </View>
        )
    }


};

export default FinalFinalScan;
