
import React, { useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllScreen from './screens/all/AllScreen.component';
import AboutScreen from './screens/about/AboutScreen.component';
import * as Font from 'expo-font';
import { StatusBar, View } from 'react-native';
import DetailScreenFinal from './screens/detail/DetailScreen.component';
import { Camera } from 'expo-camera';
import SplashScreen from './screens/splash/SplashScreen.component';
import DetailScreen from './screens/detail/DetailScreen.component';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { LayersModel } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import IOSScanScreen from './screens/scan/iosScanScreen.component';
import AndroidScanScreen from './screens/scan/AndroidScanScreen.component';
import { Platform } from 'react-native';
import PoetryScreen from './screens/poetry/PoetryScreen';
import { enableScreens, enableFreeze } from 'react-native-screens';
enableScreens();
enableFreeze();

const Stack = createNativeStackNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = '#FFFFFF';

const WaitingScreen = () => {
  return <View style={{ flex: 1, backgroundColor: '#26170D' }} />;
}

const App = () => {

  const [fontLoaded, setFontLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [waitingForPermission, setWaitingForPermission] = useState(true);
  const [startVideo, setStartVideo] = useState(false);
  const device = Platform.OS == 'ios'

  useEffect(() => {
    askForPermissions()
  }, [])

  const askForPermissions = async () => {
    const permissions = await Camera.requestCameraPermissionsAsync()
    setWaitingForPermission(false)
    setHasCameraPermission(permissions.status === 'granted')
    setStartVideo(true)
    setTimeout(() => {
      setShowSplash(false)
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
    await tf.ready();
    tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))
      .then((model) => {
        console.log('model loaded');
        setLoadedModel(model);
      })
      .catch((error) => {
        console.error('Error loading the model:', error);
      });
  }

  const iosPermissionStackScreen = (
    <Stack.Navigator freezeOnBlur={true} detachPreviousScreen={false} detachInactiveScreens={false} screenOptions={{ freezeOnBlur: true, headerShown: false, navigationBarColor: 'transparent', detachPreviousScreen: false, detachInactiveScreens: false }}
    >
      <Stack.Screen name="Scan">
        {(props) => <IOSScanScreen {...props} model={loadedModel} />}
      </Stack.Screen>
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="All" component={AllScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Poetry" component={PoetryScreen} />

    </Stack.Navigator>
  )

  const androidpermissionStackScreen = (
    <Stack.Navigator screenOptions={{ freezeOnBlur: true, headerShown: false, navigationBarColor: 'transparent' }}>
      <Stack.Screen name="Scan" options={{ navigationBarColor: 'transparent' }}>
        {(props) => <AndroidScanScreen {...props} model={loadedModel} />}
      </Stack.Screen>
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="All" component={AllScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Poetry" component={PoetryScreen} />
    </Stack.Navigator>
  )

  const noPermissionStackScreen = (
    <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: 'transparent' }}>
      <Stack.Screen name="All" component={AllScreen} />
      <Stack.Screen name="Detail" component={DetailScreenFinal} />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  )

  if (waitingForPermission) {
    return (
      <NavigationContainer theme={navTheme} >
        <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: '#26170D' }}>
          <Stack.Screen name="Waiting" component={WaitingScreen} />
        </Stack.Navigator >
      </NavigationContainer>
    )
  }
  else
    if (showSplash && startVideo) {
      return (
        <NavigationContainer theme={navTheme} >
          <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: '#26170D' }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
          </Stack.Navigator >
        </NavigationContainer>
      )
    }
    else {
      return (
        <NavigationContainer theme={navTheme}>
          {
            hasCameraPermission
              ? device
                ? iosPermissionStackScreen
                : androidpermissionStackScreen
              : noPermissionStackScreen
          }
        </NavigationContainer>
      )
    }
}

export default App;