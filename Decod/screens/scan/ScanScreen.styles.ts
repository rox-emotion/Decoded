import { Dimensions, StatusBar, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraDev: {
    height: '100%',
    width: Dimensions.get('screen').width,
  },
  camera: {
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').height * 3 / 4
  },
  button: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  mainContainer: {
    height: Dimensions.get('screen').height,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 160,
    width: 95,
  },
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover', // This is redundant as we already specified resizeMode in the component prop, but it's good practice to keep it here as well
  },
});


export default styles;