
import React, { useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllScreen from './screens/all/AllScreen.component';
import AboutScreen from './screens/about/AboutScreen.component';
import * as Font from 'expo-font';
import { StatusBar } from 'react-native';
import DetailScreenFinal from './screens/detail/DetailScreen.component';
import FinalFinalScan from './screens/scan/AHopefullyFinalScanScreen.component';
import { Camera } from 'expo-camera';
import * as ScreenOrientation from 'expo-screen-orientation';
import SplashScreen from './screens/splash/SplashScreen.component';
import DetailScreen from './screens/detail/DetailScreen.component';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { LayersModel } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';

const Stack = createNativeStackNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = '#FFFFFF';

StatusBar.setHidden(true);

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [waitingForPermission, setWaitingForPermission] = useState(false);
  const [startVideo, setStartVideo] = useState(false);


  useEffect(() => {
    changeScreenOrientation()
    // Optionally, you can unlock the orientation when the component unmounts
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  useEffect(() => {
    console.log('asking')
    askForPermissions()
  }, [])
  const askForPermissions = async () => {
    const permissions = await Camera.requestCameraPermissionsAsync()
    console.log(permissions)
    setHasCameraPermission(permissions.status === 'granted')
    setWaitingForPermission(permissions.status === 'undetermined')
    if (!waitingForPermission) {
      setStartVideo(true)
    }
    setTimeout(() => {
      if (waitingForPermission) {

      } else {
        setShowSplash(false)
      }
    }, 13000)
  };

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'californian-regular': require('./assets/fonts/CALIFR.ttf'),
        'californian-bold': require('./assets/fonts/CALIFB.ttf'),
        'californian-italic': require('./assets/fonts/CALIFI.ttf')
      });
      setFontLoaded(true);

    }
    loadFont()
    getModel()

  }, [])

  const modelJson = require('./assets/model/model.json')
  const modelWeights = require('./assets/model/weights.bin')
  const [loadedModel, setLoadedModel] = useState<LayersModel>();

  const getModel = async () => {
    const model = await tf.loadLayersModel(bundleResourceIO(modelJson,
      modelWeights));
    console.log('model loaded')
    setLoadedModel(model)
  }

  const permissionStackScreen = (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scan">
        {(props) => <FinalFinalScan {...props} model={loadedModel} />}
      </Stack.Screen>
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="All" component={AllScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  )

  const noPermissionStackScreen = (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="All" component={AllScreen} />
      <Stack.Screen name="Detail" component={DetailScreenFinal} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  )

  if (showSplash) {
    return (
      <NavigationContainer theme={navTheme}>
        <SplashScreen start={startVideo} />
      </NavigationContainer>
    )
  }
  else {
    return (
      <NavigationContainer theme={navTheme}>
        {
          hasCameraPermission
            ? permissionStackScreen
            : noPermissionStackScreen
        }
      </NavigationContainer>
    )
  }
}

export default App;