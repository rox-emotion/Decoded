import { Dimensions, StyleSheet } from "react-native"
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width - 56,
        alignSelf: 'center',
        alignItems: 'center',
        // backgroundColor: 'yellow'
    },
    singleContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width - 56,
        justifyContent: 'flex-end',
        // backgroundColor:'red'
    }
})

export default styles;