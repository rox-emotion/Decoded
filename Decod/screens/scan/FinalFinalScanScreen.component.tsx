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
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

const FinalFinalScan = () => {

    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const cameraRef = useRef<Camera>(null);
    const navigation = useNavigation();
    const isFocused = useIsFocused()
    const model = useSelector(state => state.model.model);
    let countBad = 0;
    let mehPredictions: number[] = [];
    let goodPredictions: number[] = [];

    const [total1, setTotal1] = useState(0)
    const [total2, setTotal2] = useState(0)
    const [total3, setTotal3] = useState(0)
    const [total4, setTotal4] = useState(0)
    const [total5, setTotal5] = useState(0)
    const [total6, setTotal6] = useState(0)

    // const place = Image.resolveAssetSource(require('./../../assets/images/00.jpg'));


    // const [level1, setLevel1] = useState([])
    // const [level2, setLevel2] = useState([])
    // const [level3, setLevel3] = useState([])
    // const [level4, setLevel4] = useState([])
    // const [level5, setLevel5] = useState([])
    // const [level6, setLevel6] = useState([])

    const [reset, setReset] = useState(false)

    let level1 = []
    let level2 = []
    let level3 = []
    let level4 = []
    let level5 = []
    let level6 = []
    useEffect(() => {
        askForPermissions()
    }, [])
    useEffect(() => {
        if (isFocused) {
            const timer = setTimeout(() => {
                // setLevel1([])
                // setLevel2([])
                // setLevel3([])
                // setLevel4([])
                // setLevel5([])
                // setLevel6([])
              
                setTotal1(0)
                setTotal2(0)
                setTotal3(0)
                setTotal4(0)
                setTotal5(0)
                setTotal6(0)
                main()
            }, 3000)

            const resetTimer = setTimeout(() => {
                setReset(true)
            }, 30000);

            return (() => {
                clearTimeout(timer)
            })

        }
        else {
            console.log("do nothing")
        }


    }, [isFocused]);

    const askForPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync()
        const { status: mediaStatus } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        setHasCameraPermission(status === 'granted');
        console.log('CAMERA PERMISSION GRANTED');
    };

    const resizeImage = async (photoUri: string) => {
        const resizedImage = await ImageManipulator.manipulateAsync(
            photoUri,
            [{ resize: { width: 224, height: 224 } }],
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
            // const normalizedImageTensor = imageTensor.div(255.0);
            const reshapedImageTensor = tf.reshape(imageTensor, [1, 224, 224, 3])
            return reshapedImageTensor
        }
        else {
            console.error('PIC BROKEN')
        }
    }

    const processImage = async (uri) => {
        const processedImg = await transformImageToTensor(uri);
        const prediction = await model.predict(processedImg);
        const predictedClassIndex = prediction.argMax(-1).dataSync()[0];
        const confidenceLevel = parseFloat((prediction.dataSync()[predictedClassIndex] * 100).toFixed(2));
        // const confidenceLevel = prediction.dataSync()[predictedClassIndex]

        // console.log(confidenceLevel)

        console.log("prediction:  " + predictedClassIndex + "   " + confidenceLevel)

        // let index;
        // if (confidenceLevel >= 20) {
        //     index = level1.findIndex((item) => item.predictedClassIndex === predictedClassIndex);
        //     if (index !== -1) {
        //         level1[index].confidenceLevel += confidenceLevel;
        //         setTotal1(level1[index].confidenceLevel)
        //     } else {
        //         level1.push({ predictedClassIndex, confidenceLevel });
        //     }
        // }
        // else if (confidenceLevel >= 15 && confidenceLevel < 20) {
        //     index = level2.findIndex((item) => item.predictedClassIndex === predictedClassIndex);
        //     if (index !== -1) {
        //         level2[index].confidenceLevel += confidenceLevel;
        //         setTotal2(level2[index].confidenceLevel)
        //     } else {
        //         level2.push({ predictedClassIndex, confidenceLevel });
        //     }
        // }
        // else if (confidenceLevel >= 10 && confidenceLevel < 15) {
        //     index = level3.findIndex((item) => item.predictedClassIndex === predictedClassIndex);
        //     if (index !== -1) {
        //         level3[index].confidenceLevel += confidenceLevel;
        //         setTotal3(level3[index].confidenceLevel)
        //     } else {
        //         level3.push({ predictedClassIndex, confidenceLevel });
        //     }
        // }
        // else if (confidenceLevel >= 5 && confidenceLevel < 10) {
        //     index = level4.findIndex((item) => item.predictedClassIndex === predictedClassIndex);
        //     if (index !== -1) {
        //         level4[index].confidenceLevel += confidenceLevel;
        //         setTotal4(level4[index].confidenceLevel)
        //     } else {
        //         level4.push({ predictedClassIndex, confidenceLevel });
        //     }
        // }
        // else if (confidenceLevel >= 3 < confidenceLevel < 5) {
        //     index = level5.findIndex((item) => item.predictedClassIndex === predictedClassIndex);
        //     if (index !== -1) {
        //         level5[index].confidenceLevel += confidenceLevel;
        //         setTotal5(level5[index].confidenceLevel)
        //     } else {
        //         level5.push({ predictedClassIndex, confidenceLevel });
        //     }
        // }
        // else if (confidenceLevel < 3) {
        //     index = level6.findIndex((item) => item.predictedClassIndex === predictedClassIndex);
        //     if (index !== -1) {
        //         level6[level6index].confidenceLevel += confidenceLevel;
        //         setTotal6([index].confidenceLevel)
        //     } else {
        //         level6.push({ predictedClassIndex, confidenceLevel });
        //     }
        // }

        // if (level1[index]?.confidenceLevel >= 20 || level2[index]?.confidenceLevel >= 40 || level3[index]?.confidenceLevel >= 45 || level4[index]?.confidenceLevel >= 55 || level5[index]?.confidenceLevel >= 70 || level6[index]?.confidenceLevel >= 80) {
        //     navigation.navigate('Detail', { id: predictedClassIndex })
        // }
        // else {
        //     if(reset){
        //         level6 = []
        //         level5 = []
        //         level4 = []
        //         setReset(false)
        //     }
        //     main()
        // }


        main();

        // if (confidenceLevel >= 15) {  //BEST CASE SCENARIO - IMAGE IS RECOGNIZED ON FIRST TRY
        //     navigation.navigate('Detail', { id: predictedClassIndex });
        // }
        // else if (confidenceLevel <= 3) { //WORST CASE SCENARIO - NO IMAGE IS RECOGNIZED. TRIES WITH 50 IMAGES (LIKE HALF A MINUTE) AND THEN TELLS THEM TO FUCK OFF
        //     countBad++;
        //     console.log(countBad)
        //     if (countBad == 50) {
        //         console.log("PLEASE TAKE A NORMAL PHOTO")
        //         countBad = 0
        //     }
        //     main()
        // }
        // else if (confidenceLevel > 3 && confidenceLevel < 7) { //MEH CASE - IMAGE IS RECOGNIZED SOMETIMES. TRIES WITH 10 OF THEM AND AT LEAST 7 NEED TO BE THE SAME
        //     mehPredictions.push(predictedClassIndex)
        //     console.log("avem " + mehPredictions.length + " poze")
        //     if (mehPredictions.length == 10) {
        //         handlePredictions(mehPredictions, 7)
        //     }
        //     else {
        //         main()
        //     }
        // }
        // else if (confidenceLevel >= 7) { //AVERAGE CASE - IMAGE IS SEMI-RECOGNIZED. TRIES WITH 5 IMAGES, OUT OF WHICH 4 MUST BE THE SAME
        //     goodPredictions.push(predictedClassIndex)
        //     console.log("avem " + goodPredictions.length + " poze")
        //     if (goodPredictions.length == 7) {
        //         handlePredictions(goodPredictions, 5)
        //     }
        //     else {
        //         main()
        //     }
        // }?

        //HELLO ROX DIN VIITOR THIS IS ROX DIN TRECUT
        //deci ce nu mergea aici e ca o data ce navighezi mai incolo  spre details, cand vii inapoi aporoape imediat navigeaza iar inspre details
        //ce m-am gandit ca ar putea sa fie sunt acele async-uri care se cheama si care nu se opresc
        //am incercat sa le opresc folosindu-ma de should process, dar e clar ca nu merge asa ca va trebui sa figure it out
        // sau s-ar putea sa fie ceva cache dubios im not sure
        //asa ca vor the time being, am eliminat branch-ul cu >15 pentru .apk-ul asta si vom vedea mai incolo ce se intampla
    }


    const main = async () => {

        let photo = { uri: './' };
        if (cameraRef.current) {
            try {
                console.log('Start picture taking');
                const uri = await captureRef(cameraRef, {
                    format: 'jpg',
                    quality: 0.8,
                });
                // try {
                //     const asset = await MediaLibrary.createAssetAsync(uri);
                //     console.log('Saved asset:', asset);
                // } catch (error) {
                //     console.log('An error occurred while saving the asset:', error);
                // }
                // setShowImage(uri)
                processImage(uri);
            } catch (error) {
                console.error(error);
            }
        }
    }

    // const handlePredictions = (predictions: number[], threshold: number) => {

    //     goodPredictions = [];
    //     const counts = {};

    //     for (let i = 0; i < predictions.length; i++) {
    //         const prediction = predictions[i];
    //         counts[prediction] = counts[prediction] ? counts[prediction] + 1 : 1;
    //     }

    //     let maxCount = 0;
    //     let predictedClassIndex;

    //     for (const prediction in counts) {
    //         if (counts[prediction] > maxCount) {
    //             maxCount = counts[prediction];
    //             predictedClassIndex = prediction;
    //         }
    //     }

    //     let correctlyFound = false;
    //     if (predictedClassIndex !== undefined && counts[predictedClassIndex] >= threshold) {
    //         console.log('The predicted class index is:', predictedClassIndex);
    //         correctlyFound = true;
    //         navigation.navigate('Detail', { id: predictedClassIndex });
    //     }

    //     if (!correctlyFound) {
    //         console.log('The predicted class was not found enough');
    //         main();
    //     }

    // }

    const CameraComponent = ({ cameraRef }) => {
        return (
          <Camera style={styles.camera} type={CameraType.back} ref={cameraRef} />
        );
      };
      
      const OtherUIComponent = () => {
        return (
          <View>
            <Image
              source={require('./../../assets/icons/target_icon.png')}
              style={{ height: 157, width: 95, marginTop: Dimensions.get('window').height * 0.05, alignSelf: 'center' }}
            />
          </View>
        );
      };

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
                {/* <Text style={{ fontSize: 10, color: 'red', marginTop: 60 }}>LEVEL 1: {total1}</Text>
                <Text style={{ fontSize: 10, color: 'red' }}>LEVEL 2: {total2}</Text>
                <Text style={{ fontSize: 10, color: 'red' }}>LEVEL 3: {total3}</Text>
                <Text style={{ fontSize: 10, color: 'red' }}>LEVEL 4: {total4}</Text>
                <Text style={{ fontSize: 10, color: 'red' }}>LEVEL 5: {total5}</Text>
                <Text style={{ fontSize: 10, color: 'red' }}>LEVEL 6: {total6}</Text> */}

                {
                    isFocused && (
                        <Camera
                            style={styles.camera}
                            type={CameraType.back} ref={cameraRef}
                        >
                            <View style={{ paddingTop: 38 }}>
                                <Header hasMenu={false} hasBack={false} hasIcon={true} />
                            </View>


                            <Image
                                source={require('./../../assets/icons/target_icon.png')}
                                style={{ height: 157, width: 95, marginTop: Dimensions.get('window').height * 0.05, alignSelf: 'center' }}
                            />

                        </Camera>
                    )
                }
                <View>
      {/* {isFocused && <CameraComponent cameraRef={cameraRef} />}
      {isFocused && <OtherUIComponent />}
    <Image  source={{ uri: showImage }} style={{height:150, width:150}} />  */}

    </View>
            </View>
        )
    }


};

export default FinalFinalScan;
