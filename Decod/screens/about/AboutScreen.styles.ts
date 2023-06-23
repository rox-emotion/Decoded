import { Platform, StatusBar, StyleSheet } from 'react-native';
import { SECONDARY_COLOR_BLUE, SECONDARY_COLOR_GOLD, TEXT_COLOR } from '../../utils';

const styles = StyleSheet.create({
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
    paragraphText:{
        fontSize: 18,
        fontFamily: 'californian-regular',
        color: TEXT_COLOR,
        marginBottom:10
    },
    linkText: {
        fontSize: 18,
        fontFamily: 'californian-bold',
        color: TEXT_COLOR,
        marginTop: -20
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
        fontSize: 16,
        fontFamily: "californian-regular",
        color: SECONDARY_COLOR_GOLD
    },
    mainContainer:
    {
        flex: 1,
        marginBottom:25,
        marginTop:38,
        marginHorizontal:28
    }
})

export default styles;