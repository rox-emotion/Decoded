import { Dimensions, StyleSheet } from "react-native"
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width - 58,
        alignSelf: 'center',
        alignItems: 'center',
    },
    singleContainer: {
        flexDirection: 'row',
        width: Dimensions.get('window').width - 58,
        justifyContent: 'flex-end'
    }
})

export default styles;