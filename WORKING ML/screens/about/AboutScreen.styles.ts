import { Platform, StatusBar, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        margin: 28,
    },
    scrollContainer: {
        height: '90%'
    },
    title: {
        fontSize: 22,
        alignSelf: 'center',
    },
    smallText: {
        fontSize: 16
    },
    mainContainer:
    {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

    }
})

export default styles;