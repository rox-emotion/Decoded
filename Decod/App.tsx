
import React, { useEffect, useState } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllScreen from './screens/all/AllScreen.component';
import AboutScreen from './screens/about/AboutScreen.component';
import DebugScreen from './screens/debug/DebugScreen.component';
import NewSplashScreen from './screens/splash/NewSplashScreen.component';
import { Provider } from 'react-redux';
import store from './store/store'
import * as Font from 'expo-font';
import DetailScreenClean from './screens/detail/DetailScreen.component';
import SnapScanScreen from './screens/scan/SnapScanScreen.component';
import { StatusBar } from 'react-native';
import DetailScreenFinal from './screens/detail/AADetailScreenFinal.component';

import FinalFinalScan from './screens/scan/AHopefullyFinalScanScreen.component';

const Stack = createNativeStackNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = '#FFFFFF';

StatusBar.setHidden(true);

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'californian-regular': require('./assets/fonts/CALIFR.ttf'),
        'californian-bold': require('./assets/fonts/CALIFB.ttf'),
        'californian-italic': require('./assets/fonts/CALIFI.ttf')
      });
      setFontLoaded(true);

    }
    setTimeout(() => {
      loadFont()
      setShowSplash(false)
    }, 10000)
  
  }, [])

  if (showSplash) {
    return (
      <Provider store={store}>
        <NavigationContainer theme={navTheme}>
          <NewSplashScreen />
        </NavigationContainer>
      </Provider>
    )
  }
  else {
    return (
      <Provider store={store}>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Scan" component={FinalFinalScan} />
            <Stack.Screen name="Debug" component={DebugScreen} />
            <Stack.Screen name="Detail" component={DetailScreenFinal} />
            <Stack.Screen name="All" component={AllScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}



export default App;