import { Dimensions, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        marginTop:0,
        paddingTop:0,
        height: Dimensions.get('window').height

    },
    video: {
        flex: 1,
        marginTop:0,
        paddingTop:0,
        height: Dimensions.get('window').height

    },
});


export default styles;