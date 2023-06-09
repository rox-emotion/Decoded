import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, ViewStyle } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as Permissions from 'expo-permissions';
import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import styles from './ScanScreen.styles';
import { TouchableOpacity } from 'react-native';
import '@tensorflow/tfjs-react-native/dist/platform_react_native'
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

const ScanScreen = () => {

  const prepareModel = async () => {
    console.error('ceau calule')
    const modelJson = require('./../../assets/model_normalized/model.json');
    const modelWeights = require('./../../assets/model_normalized/weights.bin')
    const model = await tf.loadLayersModel(
      bundleResourceIO(modelJson, modelWeights)
    ).catch((e) => {
      console.log("[LOADING ERROR] info:", e)
    })
    setModel(model)
    return model;
  }

  const [isTfReady, setIsTfReady] = useState(false);
  const [result, setResult] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [model, setModel] = useState<any>();
  const cameraRef = useRef<Camera>(null);
  const [imageURI, setImageURI] = useState('./');
  const [shouldTakePhoto, setShouldTakePhoto] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(true);
  const [picsTaken, setPicsTaken] = useState(0);
  const navigation = useNavigation()

  useEffect(() => {
    askForPermissions()
    loadTF()
    takePicture()
  }, [])

  const loadTF = async () => {
    await tf.ready();
    setIsTfReady(true)
    console.error("tf loaded")
  }

  const askForPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY_WRITE_ONLY, Permissions.MEDIA_LIBRARY);
    setHasCameraPermission(status === 'granted');
    console.error('CAMERA PERMISSION GRANTED')
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
          // emptyMatrix[j][k] = array[i][j][k].map((value) => value / 255);
          emptyMatrix[j][k] = array[i][j][k]
          // console.log(typeof array[i][j][k])

          // console.log( array[i][j][k])
          // console.log( array[i][j][k]/255)
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

      return reshapedImageTensor
    }
    else {
      console.error('PIC BROKEN')
    }
  }



  const takePicture = async () => {
    const model = await prepareModel()
    console.error('READY FOR PICTURES')
    // const asset = Asset.fromModule(require('./../../assets/images/101.jpg'));
    // await asset.downloadAsync();

    // const resizedImage = await resizeImage(asset.localUri);

    if (model !== undefined) {
      while (!isCameraReady) {
        console.log('preparing...')
      }
      if (isCameraReady) {
        console.error('ready to go')
      }
      let photo = { uri: './' }
      if (cameraRef.current) {
        try {
          console.error("start picture taking")
          photo = await cameraRef.current.takePictureAsync({
            skipProcessing: true
          })
          console.log(photo)
          console.error("gata poza")
          setImageURI(photo.uri)
          console.log(photo.uri)
          try {

            const asset = await MediaLibrary.createAssetAsync(photo.uri);
            console.log('Saved asset:', asset);
          } catch (error) {
            console.log('An error occurred while saving the asset:', error);
          }
        }
        catch (error) {
          console.error(error)
        }

      }


      const processedImg = await transformImageToTensor(photo)
      console.error('gata procesarea')
      const predictionMe = await model.predict(processedImg)
      console.error('gata prezicerea')
      console.log("The prediction is: " + predictionMe)
      let predictedClassIndex = predictionMe.argMax(-1).dataSync()[0];
      // const finalImage = predictedClassIndex > 99 ? predictedClassIndex : predictedClassIndex > 9 ? '0' + predictedClassIndex : '00' + predictedClassIndex
      // console.error(finalImage)

      console.log(predictedClassIndex)
      navigation.navigate("Detail", { id: predictedClassIndex })

    }
  }

 
  return (
    <View style={styles.mainContainer}>
      {/* <Header hasMenu={false} hasBackButton={false} /> */}
      <TouchableOpacity style={{ zIndex: 1 }} onPress={() => { navigation.navigate('Debug') }}>
        <Text style={{ fontSize: 28, color: 'red' }}>Debug</Text>
      </TouchableOpacity>
      <Camera
        style={styles.camera}
        type={CameraType.back} ref={cameraRef}
      >
      </Camera>
    </View>
  );


};

export default ScanScreen;
