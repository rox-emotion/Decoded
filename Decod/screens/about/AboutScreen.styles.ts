import { StyleSheet } from 'react-native';
import { SECONDARY_COLOR_BLUE, SECONDARY_COLOR_GOLD, TEXT_COLOR } from '../../utils';

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        alignSelf: 'center',
        fontFamily: 'californian-bold',
        color: TEXT_COLOR
    },
    subtitle: {
        fontSize: 28,
        alignSelf: 'center',
        fontFamily: 'californian-regular',
        color: SECONDARY_COLOR_GOLD
    },
    name: {
        fontSize: 28,
        alignSelf: 'center',
        fontFamily: 'californian-italic',
        color: TEXT_COLOR
    },
    paragraphText:{
        fontSize: 18,
        fontFamily: 'californian-regular',
        color: TEXT_COLOR,
        marginBottom:15
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
        marginHorizontal:28,
        marginTop:52
    }
})

export default styles;