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

    // const place = Image.resolveAssetSource(require('./../../assets/images/00.jpg'));

    
    useEffect(() => {
        askForPermissions()
    }, [])

    useEffect(() => {
        if (isFocused) {
            const timer = setTimeout(() => {
                main()
            }, 3000)
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
        try {
            const asset = await MediaLibrary.createAssetAsync(resizedImage.uri);
            console.log('Saved asset:', asset);
        } catch (error) {
            console.log('An error occurred while saving the asset:', error);
        }
        return resizedImage;
    };

    // const transformImageToTensor = async (uri) => {
    //     const resizedImage = await resizeImage(uri);
    //     if (resizedImage.uri) {
    //         const imageString = await FileSystem.readAsStringAsync(resizedImage.uri, {
    //             encoding: FileSystem.EncodingType.Base64,
    //         });
    //         const imageBytes = new Uint8Array(Buffer.from(imageString, 'base64'));
    //         const imageTensor = decodeJpeg(imageBytes);
    //         // const normalizedImageTensor = imageTensor.div(255.0);
    //         const reshapedImageTensor = tf.reshape(imageTensor, [1, 224, 224, 3])
    //         return reshapedImageTensor
    //     }
    //     else {
    //         console.error('PIC BROKEN')
    //     }
    // }

    const processImage = async (uri) => {
        // const processedImg = await transformImageToTensor(uri);
        // const prediction = await model.predict(processedImg);
        // const predictedClassIndex = prediction.argMax(-1).dataSync()[0];
        // const confidenceLevel = parseFloat((prediction.dataSync()[predictedClassIndex] * 100).toFixed(2));
        // // const confidenceLevel = prediction.dataSync()[predictedClassIndex]
        // console.log("prediction:  " + predictedClassIndex + "   " + confidenceLevel)
        const resized = resizeImage(uri)

          
        console.log('done')

        // const formData = new FormData();
        // formData.append('image', {
        //   uri: resized.uri,
        //   type: 'image/jpeg',
        //   name: 'image.jpg',
        // });

        // await fetch('https://dummy-link.com/upload', {
        // method: 'POST',
        // body: formData,
        // })
        // .then((response) => {
        //     if (response.ok) {
        //       console.log('Image sent successfully');
        //     } else {
        //       console.log('Something went wrong with the server');
        //     }
        //   })
        //   .catch((error) => {
        //     console.log('Error:', error);
        //   });

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

    // const CameraComponent = ({ cameraRef }) => {
    //     return (
    //       <Camera style={styles.camera} type={CameraType.back} ref={cameraRef} />
    //     );
    //   };
      
    //   const OtherUIComponent = () => {
    //     return (
    //       <View>
    //         <Image
    //           source={require('./../../assets/icons/target_icon.png')}
    //           style={{ height: 157, width: 95, marginTop: Dimensions.get('window').height * 0.05, alignSelf: 'center' }}
    //         />
    //       </View>
    //     );
    //   };

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
