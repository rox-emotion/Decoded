import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraDev:{
    height: '100%',
    width: Dimensions.get('window').width,
  },
  camera: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').height * 3/4
  },
  button: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  mainContainer:{
    height: Dimensions.get('window').height,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  imageContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.23,
    alignSelf: 'center',
    height: 157, 
    width: 95,
  },
});


export default styles;