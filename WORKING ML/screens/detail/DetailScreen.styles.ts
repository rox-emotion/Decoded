import { Platform, StyleSheet } from 'react-native'
import { StatusBar } from 'react-native';

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        textAlign: 'center',
    },
    name:
    {
        fontSize: 20,
        textAlign: 'center',
    },
    smallText: {
        fontSize: 16
    },
    container: {
        margin: 28,
        marginBottom: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',

    },
    modal: {
        padding: 16,
        height: 150,
        width: '80%',
        marginTop: '100%',
        marginLeft: '10%',
        borderColor: 'black',
        borderWidth: 2,
        borderStyle: 'solid',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    player: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    containerScroll: {
        margin: 16,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90%',
    },
    mainContainer:
    {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

    }

})

export default styles;