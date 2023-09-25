import { Dimensions, Platform, StyleSheet } from 'react-native'
import { StatusBar } from 'react-native';
import { TEXT_COLOR } from '../../utils';

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'californian-regular',
        fontWeight: "400",
        marginTop:0,
        paddingTop:0
    },
    name:
    {
        marginTop:6,
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'californian-bold',
        marginHorizontal:20
        
    },
    smallText: {
        fontSize: 18,
        fontFamily: 'californian-regular',
        color: TEXT_COLOR,
        marginBottom:15
    },
    pageContainer: {
        flex:1,
        marginTop:50
    },
    container: {
        flex: 1,
        marginHorizontal: 28,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    

})

export default styles;