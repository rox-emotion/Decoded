
import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home/HomeScreen.component';
import SplashScreen from './screens/splash/SplashScreen.component';
import AllScreen from './screens/all/AllScreen.component';
import AboutScreen from './screens/about/AboutScreen.component';
import ScanScreen from './screens/scan/ScanScreen.component';
import DetailScreen from './screens/detail/DetailScreen.component';
import DebugScreen from './screens/debug/DebugScreen.component';
import CorrectScanScreen from './screens/scan/NewScanScreen.component';
const Stack = createNativeStackNavigator();

const navTheme = DefaultTheme;
navTheme.colors.background = '#FFFFFF';

const App = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={CorrectScanScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="All" component={AllScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Debug" component={DebugScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;