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
    height: '100%',
    width: Dimensions.get('window').width,
  },
  button: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  mainContainer:{
    height: Dimensions.get('screen').height,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
});


export default styles;