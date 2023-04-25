import { Platform, StatusBar, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        margin: 28,
        flexDirection: 'column',
        height: '90%',
    },
    pictureRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainContainer:
    {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

    }
})

export default styles;