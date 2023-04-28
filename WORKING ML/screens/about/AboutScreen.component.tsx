import React from "react";
import { SafeAreaView, Text, View, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "../../components/header/Header";
import styles from "./AboutScreen.styles";
import { aboutDecoded, aboutHA, aboutMarcus } from "./texts";

const AboutScreen = () => {
    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header hasBack={true} hasIcon={false} hasMenu={true} />
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <Image source={require('./../../assets/icons/decoded_logo.png')}
                        style={{ height: 232, width: 158, alignSelf: 'center', marginBottom: 38 }}/>

                    <Text style={styles.title}>De.Coded</Text>
                    <Text style={styles.subtitle}>A Human Atlas of</Text>
                    <Text style={styles.subtitle}>Silicon Valley</Text>
                    <Text style={[styles.name, { marginBottom: 25 }]}>Marcus Lyon</Text>

                    <Text style={[styles.smallText, {marginBottom: 14}]}>{aboutDecoded}</Text>

                    <TouchableOpacity style={{ marginTop: 13, marginBottom: 40 }}>
                        <Text style={styles.linkText}>Buy the Book → </Text>
                    </TouchableOpacity>

                    <Text style={[styles.subtitle, { alignSelf: 'center', fontSize: 24, marginBottom: 21 }]}>Human Atlas Overview</Text>

                    <Text style={[styles.smallText, {marginBottom:14}]}>{aboutHA}</Text>

                    <TouchableOpacity style={{ marginTop: 13, marginBottom: 40 }}>
                        <Text style={styles.linkText}>Visit the Human Atlas Website → </Text>
                    </TouchableOpacity>

                    <Image source={require('./../../assets/icons/marcus.png')} style={{ width: 334, height: 446, alignSelf: 'center' }} />
                    <Text style={[styles.authorName, {marginTop:35}]}>Marcus Lyon</Text>
                    <Text style={styles.authorSubtitle}>Human Atlas Founder</Text>
                    <Text style={styles.authorSubtitle}>08_1965</Text>

                    <Text style={[styles.smallText, {marginTop:25, marginBottom: 36}]}>{aboutMarcus}</Text>

                    <Text style={styles.credits}>Version 0.01B-120223</Text>
                    <Text style={styles.credits}>Studio Sutherl& and Tenacity Works</Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default AboutScreen;