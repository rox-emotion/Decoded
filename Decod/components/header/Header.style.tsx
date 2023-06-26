import { Dimensions, StyleSheet } from "react-native"
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('screen').width - 56,
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop:19,
        // backgroundColor:'green'
    },
    singleContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width - 56,
        justifyContent: 'flex-end',
        marginTop:19,
    }
})

export default styles;