import { Dimensions, StyleSheet } from 'react-native'

const ratio = 1920 / 1080

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").width * ratio,
        border:'none'
    },
    video: {
        flex: 1,
        border:'none'
        // marginTop: 0,
        // paddingTop: 0,
        // border: 'none'

    },

    mainContainer: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
        // backgroundColor: 'maroon',
        border:'none',
        backgroundColor: '#26170D',
        justifyContent: 'center',
        alignItems:'center'
    }
});


export default styles;