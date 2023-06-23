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
    const viewShotRef = useRef();

    useEffect(() => {
        askForPermissions()
    }, [])

    useEffect(() => {
        if (isFocused) {
            const timer = setTimeout(() => {
                main()
            }, 1000)
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

    const processImage = async (uri) => {
        const resized = await resizeImage(uri)
        const imageString = await FileSystem.readAsStringAsync(resized.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        var formdata = new FormData();
        formdata.append("image", imageString);

        await fetch('https://decoded.eu-4.evennode.com/upload', {
            method: 'POST',
            body: formdata
        })
            .then(response => response.text())
            .then(result => {
                console.log(result)
                const nou = JSON.parse(result);
                if (nou.ID == 0 || nou.ID == 103) {
                    main()
                } else 
                if(nou.score >= 0.85)
                {
                    navigation.navigate("Detail", { id: nou.ID })
                }else {
                    main()
                }
            })
            .catch(error => console.log('error', error));
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
        return(
            <>
            </>
        )
    };
};

export default FinalFinalScan;
