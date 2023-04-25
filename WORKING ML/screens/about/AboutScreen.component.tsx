import React from "react";
import { SafeAreaView, Text, View, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "../../components/header/Header";
import styles from "./AboutScreen.styles";

const AboutScreen = () => {

    const onPressTouch = () => {

    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <Header hasMenu={true} hasBackButton={true} />
            <View style={styles.container}>
                <ScrollView style={styles.scrollContainer}>
                    <Image source={require('./../../assets/icons/decoded_logo.png')}
                        style={{ height: 232, width: 158, alignSelf: 'center', marginBottom: 19 }}
                    />
                    <Text style={styles.title}>De.Coded</Text>
                    <Text style={styles.title}>A Human Atlas</Text>
                    <Text style={styles.title}>of Silicon Valley</Text>
                    <Text style={[styles.title, { marginBottom: 12 }]}>Marcus Lyon</Text>


                    <Text style={styles.smallText}>
                        De.Coded is a research-based exploration of the human capital of Silicon Valley. The four-year project was built on the foundation of a year-long nomination process, where a diverse group of local leaders nominated individuals from their own communities who are making significant contributions to the region and represent the very best of service to society. The final 101 nominees frame many of the most important stories of this remarkable valley. However, they represent only a fraction of the Bay area’s exceptional residents.
                        The project maps these remarkable people though photographic portraits, oral histories and ancestral DNA mapping to create a deeper understanding of the peninsula and beyond. The Human Atlas project holds a mirror up to society and encourages audiences to question their own roles and responsibilities to their communities, cities, and fellow human beings.
                        The work is available as a book, a museum exhibition and in multiple digital formats.
                    </Text>
                    <TouchableOpacity style={{ marginTop: 13, marginBottom: 40 }}>
                        <Text>Buy the Book → </Text>
                    </TouchableOpacity>

                    <Text style={{ alignSelf: 'center', fontSize: 24, marginBottom: 21 }}>Human Atlas Overview</Text>


                    <Text style={styles.smallText}>
                        Marcus Lyon is a British artist, who creates immersive, multi-layered, research-based Human Atlases that explore groups of extraordinary individuals through photographic portraits, oral histories, and ancestral DNA mapping.
                        In the early 90’s he founded the Glassworks, a multidisciplinary gallery & production house for commissioned and original art. As a portrait artist he has photographed a diverse range of from Queen Elizabeth II to homeless street children and Prime Ministers to global social change agents. He has created extensive bodies of work around dance, disability sport, and development. The early 21st century saw his work move beyond traditional forms as he began to incorporate sound & science into his practice.
                        Outside the art world, Lyon is a determined social entrepreneur & an active public speaker. He has served on the boards of the climate change focused Future Stewards Foundation, the art institution Somerset House, is on the Ally Council of Black Leaders Detroit and is a TED speaker.
                    </Text>
                    <TouchableOpacity style={{ marginTop: 13, marginBottom: 40 }}>
                        <Text>Visit the Human Atlas Website → </Text>
                    </TouchableOpacity>

                    <Image source={require('./../../assets/icons/marcus.png')} style={{ width: 334, height: 446, alignSelf: 'center', marginBottom: 25 }} />
                    <Text style={[styles.title, { marginBottom: 14 }]}>Marcus Lyon</Text>
                    <Text style={{ alignSelf: 'center' }}>Human Atlas Founder</Text>
                    <Text style={{ alignSelf: 'center' }}>08_1965</Text>

                    <Text style={styles.smallText}>
                        De.Coded is a research-based exploration of the human capital of Silicon Valley. The four-year project was built on the foundation of a year-long nomination process, where a diverse group of local leaders nominated individuals from their own communities who are making significant contributions to the region and represent the very best of service to society. The final 101 nominees frame many of the most important stories of this remarkable valley. However, they represent only a fraction of the Bay area’s exceptional residents.
                        The project maps these remarkable people though photographic portraits, oral histories and ancestral DNA mapping to create a deeper understanding of the peninsula and beyond. The Human Atlas project holds a mirror up to society and encourages audiences to question their own roles and responsibilities to their communities, cities, and fellow human beings.
                        The work is available as a book, a museum exhibition and in multiple digital formats.
                    </Text>
                    {/* <TouchableOpacity onPress={onPressTouch}>
                        <Image source={require('./../../assets/icons/up_arrow.png')} style={{ height: 50, width: 50, alignSelf: 'center' }} />
                    </TouchableOpacity> */}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default AboutScreen;