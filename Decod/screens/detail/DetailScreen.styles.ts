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
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90%',
        width: Dimensions.get('window').width - 56,
        alignSelf: 'center',
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
        // paddingTop:50
    },
    

})

export default styles;