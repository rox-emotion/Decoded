import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width - 56,
        alignSelf: 'center',
        height: '90%',
        marginTop:24

    },
    image: {
        height: 99,
        width: 74,
    },
    mainContainer:
    {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

    }
})

export default styles;