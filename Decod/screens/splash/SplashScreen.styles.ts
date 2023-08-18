import { Dimensions, StyleSheet } from 'react-native'


const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width * 1080 / 608,
        border: 'none',
    },
    video: {
        flex: 1,
        border: 'none'
    },

    mainContainer: {
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        border: 'none',
        backgroundColor: '#26170D',
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default styles;