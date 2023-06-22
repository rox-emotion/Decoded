import React, { useEffect } from 'react';
import { View, TouchableOpacity, Text, Platform, Dimensions } from 'react-native';
import Header from '../../components/header/Header';
import styles from './ScanScreen.styles';
import { Camera, CameraType } from 'expo-camera';
import { useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs';
import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { useSelector } from 'react-redux';
import { Image } from 'react-native';

const CorrectScanScreen = ({ navigation }) => {
    const cameraRef = useRef<Camera>(null);
    const isFocused = useIsFocused();
    const model = useSelector(state => state.model.model);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>();
    const [imageURI, setImageURI] = useState('./');


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            main();
        });

        return unsubscribe;
    }, [navigation]);

    const askForPermissions = async () => {
        console.log("ask for permissions")
        const { status } = await Camera.requestCameraPermissionsAsync()
        setHasCameraPermission(status === 'granted');
        console.log('CAMERA PERMISSION GRANTED');
    }

    const main = async () => {
        console.log("main")
        console.log('n-am intrat')
        console.error(cameraRef.current)
        if (model && cameraRef.current) {
            console.log('am intrat')
            const photo = await takePicture()

            const processedImg = await transformImageToTensor(imageURI)
            const predictionMe = await model.predict(processedImg)
            console.error('gata prezicerea')
            console.log("The prediction is: " + predictionMe)
            let predictedClassIndex = predictionMe.argMax(-1).dataSync()[0];
            console.log("The predicted class is: " + predictedClassIndex)
            navigation.navigate("Detail", { id: predictedClassIndex })

        }
    }
    
    const takePicture = async () => {
        console.log("takePicture")
        let photo = { uri: './' }
        console.log(cameraRef.current)
        if (cameraRef.current) {
            try{
                photo = await cameraRef.current.takePictureAsync({
                    skipProcessing: true
                })
                setImageURI(photo.uri)
    
                //TO DELETE IN FINAL VERSION
                try {
                    const asset = await MediaLibrary.createAssetAsync(photo.uri);
                    console.log('Saved asset:', asset);
                } catch (error) {
                    console.log('An error occurred while saving the asset:', error);
                }
            } catch (error){
                console.log("PROBLEMA CU CAMERA CEVA: ", error)
            }
            
        }
        console.log("gata takePicture")
        return photo
    }

    const transformImageToTensor = async (uri) => {
        console.log("transformToTensor")
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
            const array = reshapedImageTensor.arraySync();

            // console.log(array[0][0][0]); // [99, 86, 151]
            // console.log(array[0][0][255]); // [51, 59, 83]
            // console.log(array[0][255][0]); // [42, 55, 75]
            // console.log(array[0][255][255]); // [52, 70, 86]

            const newData = preprocessTensor(array)

            const tensor = reshapeTensor(newData);

            const toCheck = tensor.arraySync()

            // console.log(toCheck[0][0][0]); // [99, 86, 151]
            // console.log(toCheck[0][0][255]); // [51, 59, 83]
            // console.log(toCheck[0][255][0]); // [42, 55, 75]
            // console.log(toCheck[0][255][255]); // [52, 70, 86]

            console.log("gata preprocessing")
            return reshapedImageTensor
        }
        else {
            console.error('PIC BROKEN')
        }
    }

    const resizeImage = async (uri) => {
        console.log("resizeImage")
        const resizedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 256, height: 256 } }],
            { format: ImageManipulator.SaveFormat.JPEG }
        );
        return resizedImage;
    }

    const preprocessTensor = (array: any) => {
        console.log("preprocessTensor")
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
                    //NORMALIZED
                    // emptyMatrix[j][k] = array[i][j][k].map((value) => value / 255);
                    //NOT NORMALIZED
                    emptyMatrix[j][k] = array[i][j][k]
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

    const reshapeTensor = (matrix: any) => {
        console.log("reshapeTensor")
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


    return (
        <View style={styles.mainContainer}>
            <Header hasMenu={false} hasBack={false} hasIcon={true} />
            <TouchableOpacity style={{ zIndex: 1 }} onPress={() => { navigation.navigate('Debug') }}>
                <Text style={{ fontSize: 28, color: 'red' }}>Debug</Text>
            </TouchableOpacity>
            {
                isFocused && (
                    <Camera
                        style={styles.camera}
                        type={CameraType.back}
                        ref={cameraRef}
                    >
                        <Image
                            source={require('./../../assets/icons/target_icon.png')}
                            style={{ height: 157, width: 95, marginTop: Dimensions.get('window').height * 0.23, alignSelf: 'center' }}

                        />
                    </Camera>
                )
            }

        </View>
    )
}

export default CorrectScanScreen;