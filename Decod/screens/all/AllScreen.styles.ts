import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width - 54,
        alignSelf: 'center',
        height: '100%',
        paddingBottom:40,
        marginTop:9
    },
    mainContainer:
    {
        flex: 1,
        backgroundColor: '#fff',
        marginTop:50
    }
})

export default styles;