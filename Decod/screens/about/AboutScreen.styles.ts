import { Platform, StatusBar, StyleSheet } from 'react-native';
import { SECONDARY_COLOR_BLUE, SECONDARY_COLOR_GOLD, TEXT_COLOR } from '../../utils';

const styles = StyleSheet.create({
    container: {
        margin: 28,
        marginBottom: 0
    },
    scrollContainer: {
        height: '90%'
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
        fontFamily: 'californian-bold',
        color: TEXT_COLOR
    },
    subtitle: {
        fontSize: 30,
        alignSelf: 'center',
        fontFamily: 'californian-regular',
        color: SECONDARY_COLOR_GOLD
    },
    name: {
        fontSize: 30,
        alignSelf: 'center',
        fontFamily: 'californian-italic',
        color: TEXT_COLOR
    },
    smallText: {
        fontSize: 18,
        fontFamily: 'californian-regular',
        color: TEXT_COLOR
    },
    linkText: {
        fontSize: 18,
        fontFamily: 'californian-bold',
        color: TEXT_COLOR
    },
    authorName: {
        fontSize: 20,
        alignSelf: 'center',
        fontFamily: "californian-bold",
        color: SECONDARY_COLOR_BLUE
    },
    authorSubtitle: {
        fontSize: 20,
        alignSelf: 'center',
        fontFamily: "californian-regular",
        color: SECONDARY_COLOR_BLUE
    },
    credits: {
        fontSize: 20,
        fontFamily: "californian-regular",
        color: SECONDARY_COLOR_GOLD
    },
    mainContainer:
    {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

    }
})

export default styles;