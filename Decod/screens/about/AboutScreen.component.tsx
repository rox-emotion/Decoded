import React from "react";
import { SafeAreaView, Text, View, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "../../components/header/Header";
import styles from "./AboutScreen.styles";
import { aboutDecoded, aboutHA, aboutMarcus } from "./texts";
import { Linking } from 'react-native';


const AboutScreen = () => {
    const humanAtlasLink =  'https://www.ahumanatlas.com/'
    const sutherlandLink = 'https://studio-sutherland.co.uk/'
    const tenacityWorksLink = 'https://www.tenacityworks.com/'

    const paragraphsDecoded = aboutDecoded.split('\n');
    const paragraphsHA = aboutHA.split('\n');
    const paragraphsMarcus = aboutMarcus.split('\n');

    const handleLinkPress = async (url) => {

        const supported = await Linking.canOpenURL(url);
      
        if (supported) {
          await Linking.openURL(url);
        } else {
          console.log("Don't know how to open URL: " + url);
        }
      };
      

    return (
        // <SafeAreaView style={styles.mainContainer}>
        //     <Header hasBack={true} hasIcon={false} hasMenu={true} />
        //     <View style={styles.container}>
        //         <ScrollView style={styles.scrollContainer}>
        //             <Image source={require('./../../assets/icons/decoded_logo.png')}
        //                 style={{ height: 232, width: 158, alignSelf: 'center', marginBottom: 38 }}/>

        //             <Text style={styles.title}>De.Coded</Text>
        //             <Text style={styles.subtitle}>A Human Atlas of</Text>
        //             <Text style={styles.subtitle}>Silicon Valley</Text>
        //             <Text style={[styles.name, { marginBottom: 25 }]}>Marcus Lyon</Text>

        //             {paragraphsDecoded.map((paragraph, index) => (
        //             <Text style={[styles.smallText, {marginBottom: 14}]} key={index}>{paragraph}</Text>
        //             ))}

        //             <TouchableOpacity style={{ marginTop: 13, marginBottom: 40 }}>
        //                 <Text style={styles.linkText}>Buy the Book → </Text>
        //             </TouchableOpacity>

        //             <Text style={[styles.subtitle, { alignSelf: 'center', fontSize: 24, marginBottom: 21 }]}>Human Atlas Overview</Text>

        //             {paragraphsHA.map((paragraph, index) => (
        //             <Text style={[styles.smallText]} key={index}>{paragraph}</Text>
        //             ))}
        //             <TouchableOpacity style={{ marginBottom: 49 }} onPress={() => {handleLinkPress(humanAtlasLink)}}>
        //                 <Text style={styles.linkText}>Visit the Human Atlas Website → </Text>
        //             </TouchableOpacity>

        //             <Image source={require('./../../assets/icons/marcus.png')} style={{ width: 334, height: 446, alignSelf: 'center' }} />
        //             <Text style={[styles.authorName, {marginTop:35}]}>Marcus Lyon</Text>
        //             <Text style={styles.authorSubtitle}>Human Atlas Founder</Text>
        //             <Text style={[styles.authorSubtitle, {marginBottom:24}]}>08_1965</Text>

        //             {paragraphsMarcus.map((paragraph, index) => (
        //             <Text style={[styles.smallText, {marginBottom: 14}]} key={index}>{paragraph}</Text>
        //             ))}
        //             <Text style={styles.credits}>Version 0.01B-120223</Text>
        //             <View style={{flexDirection:'row'}}>
        //                 <TouchableOpacity onPress={() => {handleLinkPress(sutherlandLink)}}>
        //                 <Text style={styles.credits}>Studio Sutherl&</Text>
        //                 </TouchableOpacity>
                        
        //                 <Text style={styles.credits}> and </Text>
                        
        //                 <TouchableOpacity onPress={() => {handleLinkPress(tenacityWorksLink)}}>
        //                 <Text style={styles.credits}>Tenacity Works</Text>
        //                 </TouchableOpacity>
                   
        //             </View>
        //         </ScrollView>
        //     </View>
        // </SafeAreaView>
        <View style={styles.mainContainer}>
            <Header hasBack={true} hasIcon={false} hasMenu={true} />
            <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            >
                <Image source={require('./../../assets/icons/decoded_logo.png')} style={{ height: 232, width: 158, alignSelf: 'center', marginBottom: 38 }}/>
                <Text style={styles.title}>De.Coded</Text>
                <Text style={styles.subtitle}>A Human Atlas of</Text>
                <Text style={styles.subtitle}>Silicon Valley</Text>
                <Text style={[styles.name, {marginBottom:25}]}>Marcus Lyon</Text>

                {paragraphsDecoded.map((paragraph, index) => (
                <Text style={[styles.paragraphText]} key={index}>{paragraph}</Text>
                ))}

                <TouchableOpacity>
                    <Text style={styles.linkText}>Buy the Book → </Text>
                </TouchableOpacity>

                <Text style={[styles.subtitle, { alignSelf: 'center', fontSize: 24, marginTop:40, marginBottom:21 }]}>Human Atlas Overview</Text>

                {paragraphsHA.map((paragraph, index) => (
                    <Text style={[styles.paragraphText]} key={index}>{paragraph}</Text>
                ))}

                <TouchableOpacity style={{ marginBottom: 49 }} onPress={() => {handleLinkPress(humanAtlasLink)}}>
                    <Text style={styles.linkText}>Visit the Human Atlas Website → </Text>
                </TouchableOpacity>

                <Image source={require('./../../assets/icons/marcus.png')} style={{ width: '100%', height: 446, alignSelf: 'center', marginTop:6}} />
                <Text style={[styles.authorName, {marginTop:35}]}>Marcus Lyon</Text>
                <Text style={styles.authorSubtitle}>Human Atlas Founder</Text>
                <Text style={[styles.authorSubtitle, {marginBottom:24}]}>08_1965</Text>

                {paragraphsMarcus.map((paragraph, index) => (
                    <Text style={[styles.paragraphText]} key={index}>{paragraph}</Text>
                ))}

                <Text style={styles.credits}>Version 0.01B-120223</Text>
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => {handleLinkPress(sutherlandLink)}}>
                        <Text style={styles.credits}>Studio Sutherl&</Text>
                    </TouchableOpacity>
                    <Text style={styles.credits}> and </Text>
                    <TouchableOpacity onPress={() => {handleLinkPress(tenacityWorksLink)}}>
                        <Text style={styles.credits}>Tenacity Works</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
             
        </View>
    )
}

export default AboutScreen;