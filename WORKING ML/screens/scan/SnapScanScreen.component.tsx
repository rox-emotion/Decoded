import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ViewStyle, Dimensions } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as Permissions from 'expo-permissions';
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import styles from './ScanScreen.styles';
import { TouchableOpacity } from 'react-native';
import '@tensorflow/tfjs-react-native/dist/platform_react_native'
import { useIsFocused, useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { useSelector } from 'react-redux';
import Header from '../../components/header/Header';
import { DEV } from './../../config';
import { captureRef } from 'react-native-view-shot';

const SnapScanScreen = () => {

    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const cameraRef = useRef<Camera>(null);
    const [imageURI, setImageURI] = useState('./');
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const model = useSelector(state => state.model.model);
    let navigateToDetails = false;
    let countBad = 0;
    let toProcess = true;
    let toTakePic = true;
    let mehPredictions = [];
    let goodPredictions = [];
    useEffect(() => {
        askForPermissions()
    }, [])
    useEffect(() => {
        if (isFocused) {
            const timer = setTimeout(() => {
                main()
            }, 3000)
        }

    }, [isFocused]);

    const askForPermissions = async () => {
        console.log("ask for permissions")
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

    const preprocessTensor = (array) => {
        const emptyMatrix: number[][] = [];

        for (let i = 0; i < 256; i++) {
            emptyMatrix[i] = [];
            for (let j = 0; j < 256; j++) {
                emptyMatrix[i][j] = 0;
            }
        }
        console.log(typeof array[0][0][0])
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[i].length; j++) {
                for (let k = 0; k < array[i][j].length; k++) {
                    emptyMatrix[j][k] = array[i][j][k].map((value) => value / 255);
                }
            }
        }
        console.error(emptyMatrix[0][0])
        console.error(typeof emptyMatrix[0][0])
        const numRows = emptyMatrix.length;
        const numCols = emptyMatrix[0].length;

        // Create a new matrix with the swapped dimensions
        const newMatrixI: number[][] = new Array(numCols).fill(0).map(() => new Array(numRows).fill(0));

        // Loop through the original matrix and assign values to the new matrix with swapped rows and columns
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                newMatrixI[j][i] = emptyMatrix[i][j];
            }
        }
        newMatrixI.reverse(); // Reverse the order of the rows

        // console.log(newMatrixI[0][0]); // [99, 86, 151]
        // console.log(newMatrixI[0][255]); // [51, 59, 83]
        // console.log(newMatrixI[255][0]); // [42, 55, 75]
        // console.log(newMatrixI[255][255]); // [52, 70, 86]

        return newMatrixI
    }

    const reshapeTensor = (matrix: number[][]): tf.Tensor4D => {
        const numRows = matrix.length;
        const numCols = matrix[0].length;

        const reshapedArray: number[][][][] = new Array(1).fill(0).map(() =>
            new Array(numRows).fill(0).map(() =>
                new Array(numCols).fill(0).map(() =>
                    new Array(3).fill(0)
                )
            )
        );

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                for (let k = 0; k < 3; k++) {
                    reshapedArray[0][i][j][k] = matrix[i][j][k];
                }
            }
        }

        return tf.tensor4d(reshapedArray, [1, 256, 256, 3]);
    }


    const transformImageToTensor = async (uri) => {
        //TRY WITH ALREADY EXISTING PIC
        // const asset = Asset.fromModule(require('./../../ceau.jpg'));
        // await asset.downloadAsync();
        // const resizedImage = await resizeImage(asset.localUri)

        const resizedImage = await resizeImage(uri);
        if (resizedImage.uri) {
            const imageString = await FileSystem.readAsStringAsync(resizedImage.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const imageBytes = new Uint8Array(Buffer.from(imageString, 'base64'));
            const imageTensor = decodeJpeg(imageBytes);
            const normalizedImageTensor = imageTensor.div(255.0);
            const reshapedImageTensor = tf.reshape(normalizedImageTensor, [1, 256, 256, 3])
            // const array = reshapedImageTensor.arraySync();

            // console.log(array[0][0][0]); // [99, 86, 151]
            // console.log(array[0][0][255]); // [51, 59, 83]
            // console.log(array[0][255][0]); // [42, 55, 75]
            // console.log(array[0][255][255]); // [52, 70, 86]

            // const newData = preprocessTensor(array)

            // const tensor = reshapeTensor(newData);

            // console.log(toCheck[0][0][0]); // [99, 86, 151]
            // console.log(toCheck[0][0][255]); // [51, 59, 83]
            // console.log(toCheck[0][255][0]); // [42, 55, 75]
            // console.log(toCheck[0][255][255]); // [52, 70, 86]

            return reshapedImageTensor
        }
        else {
            console.error('PIC BROKEN')
        }
    }

    const main = async () => {
        //take snapshots continuously for 20 shots
        //process images
      
        for (let i = 0; i < 1000; i++) {
            let photo = { uri: './' };
            if (cameraRef.current) {
                if (toTakePic) {
                    try {
                        console.log('Start picture taking');
                        const uri = await captureRef(cameraRef, {
                            format: 'jpg',
                            quality: 0.8,
                        });
                        if (toProcess == true) {
                            processImage(uri);

                        }
                    } catch (error) {
                        console.error(error);
                    }
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

        if (confidenceLevel >= 15) {  //BEST CASE SCENARIO - IMAGE IS RECOGNIZED ON FIRST TRY
            navigateToDetails = true
            navigation.navigate('Detail', { id: predictedClassIndex });
        }
        else if (confidenceLevel <= 3) { //WORST CASE SCENARIO - NO IMAGE IS RECOGNIZED. TRIES WITH 50 IMAGES (LIKE HALF A MINUTE) AND THEN TELLS THEM TO FUCK OFF
            countBad++;
            console.log(countBad)
            if (countBad == 50) {
                console.log("PLEASE TAKE A NORMAL PHOTO")
                countBad = 0
                toProcess = false
                toTakePic = false
            }
        }
        else if(confidenceLevel > 3 && confidenceLevel < 7){ //MEH CASE - IMAGE IS RECOGNIZED SOMETIMES. TRIES WITH 15 OF THEM AND AT LEAST 10 NEED TO BE THE SAME
            mehPredictions.push(predictedClassIndex)
            console.log("avem " + mehPredictions.length + " poze")
            if(mehPredictions.length == 15){
                handleMehPredictions(mehPredictions)
            }
        }
        else if(confidenceLevel>=7 && confidenceLevel<15){ //AVERAGE CASE - IMAGE IS SEMI-RECOGNIZED. TRIES WITH 7 IMAGES, OUT OF WHICH 5 MUST BE THE SAME
            goodPredictions.push(predictedClassIndex)
            console.log("avem " + goodPredictions.length + " poze")
            if(goodPredictions.length == 7){
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
        if (predictedClassIndex !== undefined && counts[predictedClassIndex] >= 5) {
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
        if (predictedClassIndex !== undefined && counts[predictedClassIndex] >= 10) {
            console.log('The predicted class index is:', predictedClassIndex);
            correctlyFound = true;
            navigation.navigate('Detail', { id: predictedClassIndex });
        }


        if (!correctlyFound) {
            console.log('The predicted class was not found enough');
            main();
        }
    }
    const takePicture = async () => {
        let threshold = 10;

        console.log('READY FOR PICTURES');
        let completedCount = 0;

        if (model !== undefined) {
            const processedImages = [];
            const predictions = [];

            const processImage = async (uri) => {
                const processedImg = await transformImageToTensor(uri);
                const prediction = await model.predict(processedImg);
                const predictedClassIndex = prediction.argMax(-1).dataSync()[0];
                const confidenceLevel = parseFloat((prediction.dataSync()[predictedClassIndex] * 100).toFixed(2));
                console.log(predictedClassIndex + "   " + confidenceLevel)

                // if(confidenceLevel >= 15){
                //     navigation.navigate('Detail', { id: predictedClassIndex });
                // }
                // else if(confidenceLevel < 3){
                //     countBad +=1;
                //     if(countBad == 100){
                //         console.log("FA O POZA CA LUMEA PLM")
                //     }
                // }
                // else if(confidenceLevel >=7){
                //     threshold = 7;
                //     completedCount++;
                //     predictions.push(predictedClassIndex);

                // }
                // else if(confidenceLevel>=3 && confidenceLevel<7){
                //     threshold = 30;
                //     completedCount++;
                //     predictions.push(predictedClassIndex);
                // }

                // // if (confidenceLevel >= 5) {
                //     predictions.push(predictedClassIndex);
                // // }

                //if more than 20 -> navigate to Details
                //if less than 3 -> dont even add them to the thing. have a count that tries 100 times and after 100 times says "FA POZA CA LUMEA CPLM FACI"

                //if between 3 and 7 -> add them to the predictions list and continue to take more until at least 30 pics say the same

                //if more than 7 -> normal alg

                // if (completedCount === threshold) {
                //     console.log('am pozat ' + threshold)
                //     handlePredictions(predictions);
                // }
            };

            while (true) {
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
    };

    const handlePredictions = (predictions) => {
        if (predictions.length > 0) {
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
            if (predictedClassIndex !== undefined && counts[predictedClassIndex] >= 10) {
                console.log('The predicted class index is:', predictedClassIndex);
                correctlyFound = true;
                navigation.navigate('Detail', { id: predictedClassIndex });
            }


            if (!correctlyFound) {
                console.log('The predicted class was not found enough');
                takePicture();
            }
        } else {
            console.log('All pictures have a confidence level under 3.');
            takePicture();
        }
    };

    // const takePicture = async () => {
    //     try {
    //         const uri = await captureRef(cameraRef, {
    //             format: 'jpg',
    //             quality: 0.8,
    //         });
    //         console.log('Screenshot URI:', uri);
    //         try {
    //             const asset = await MediaLibrary.createAssetAsync(uri);
    //             console.log('Saved asset:', asset);
    //         } catch (error) {
    //             console.log('An error occurred while saving the asset:', error);
    //         }
    //     } catch (error) {
    //         console.error('Error capturing screenshot:', error);
    //     }
    // };

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

export default SnapScanScreen;
