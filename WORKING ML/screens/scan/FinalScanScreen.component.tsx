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

const FinalScanScreen = () => {


  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const [imageURI, setImageURI] = useState('./');
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const model = useSelector(state => state.model.model);

  useEffect(() => {
    askForPermissions()
  }, [])
  useEffect(() => {
    if (isFocused) {
      const timer = setTimeout(() => {
        takePicture()
      }, 4000)
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


  const transformImageToTensor = async (photo) => {
    //TRY WITH ALREADY EXISTING PIC
    // const asset = Asset.fromModule(require('./../../ceau.jpg'));
    // await asset.downloadAsync();
    // const resizedImage = await resizeImage(asset.localUri)

    const resizedImage = await resizeImage(photo.uri);
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

  const takePicture = async () => {
    console.log('READY FOR PICTURES');
    if (model !== undefined) {
      const processedImages = [];
      const predictions = [];
      let completedCount = 0;

      const processImage = async (photo) => {
        const processedImg = await transformImageToTensor(photo);
        const prediction = await model.predict(processedImg);
        const predictedClassIndex = prediction.argMax(-1).dataSync()[0];
        const confidenceLevel = parseFloat((prediction.dataSync()[predictedClassIndex] * 100).toFixed(2));
        console.log(predictedClassIndex);
        console.log(confidenceLevel);
        if (confidenceLevel >= 5) {
          predictions.push(predictedClassIndex);
        }
        completedCount++;

        if (completedCount === 8) {
          console.log('am pozat 8')
          handlePredictions(predictions);
        }
      };

      for (let i = 0; i < 8; i++) {
        let photo = { uri: './' };

        if (cameraRef.current) {
          try {
            console.log('Start picture taking');
            photo = await cameraRef.current.takePictureAsync({
              skipProcessing: true,
            });
            // try {
            //   const asset = await MediaLibrary.createAssetAsync(photo.uri);
            //   console.log('Saved asset:', asset);
            // } catch (error) {
            //   console.log('An error occurred while saving the asset:', error);
            // }
            // console.log('Picture taken:', photo);
            processImage(photo); // Process the image asynchronously
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
      if (predictedClassIndex !== undefined && counts[predictedClassIndex] >= 5) {
        correctlyFound = true;
        console.log('The predicted class index is:', predictedClassIndex);
        navigation.navigate('Detail', { id: predictedClassIndex });
      }

      if (!correctlyFound) {
        console.log('The predicted class is not found at least 5 times.');
        takePicture();
      }
    } else {
      console.log('All pictures have a confidence level under 7.5.');
      takePicture();
    }
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

export default FinalScanScreen;
