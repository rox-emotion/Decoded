import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    height: 700,
    width: Dimensions.get('window').width,
  },
  button: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  mainContainer:{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
});


export default styles;