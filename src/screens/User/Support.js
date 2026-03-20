import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import EntypoIcon from 'react-native-vector-icons/Entypo';

const Support = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('User', { screen: 'Home' });
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Support</Text>

            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <EntypoIcon name="mail" size={24} color="#13A997" />
                    <Text style={styles.cardTitle}>Get in touch</Text>
                </View>
                <Text style={styles.boldText}>Email</Text>
                <Text style={styles.text}>supports@moneymails.com</Text>
                <Text style={styles.text}>1 (453) 234 5611</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <EntypoIcon name="network" size={24} color="#13A997" />
                    <Text style={styles.cardTitle}>Social Media</Text>
                </View>
                <View style={styles.socialIconsRow}>
                    <EntypoIcon name="facebook-with-circle" size={36} color="#4267B2" style={styles.iconSpaced} />
                    <EntypoIcon name="instagram-with-circle" size={36} color="#C13584" style={styles.iconSpaced} />
                    <EntypoIcon name="twitter-with-circle" size={36} color="#1DA1F2" style={styles.iconSpaced} />
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <EntypoIcon name="location-pin" size={24} color="#13A997" />
                    <Text style={styles.cardTitle}>Where we are</Text>
                </View>
                <Text style={styles.boldText}>Address</Text>
                <Text style={styles.text}>Money mail offices, Middesborough Road</Text>
                <Text style={styles.text}>Middesborough, TS6 6004</Text>
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        marginTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#13A997',
        marginLeft: 10,
    },
    boldText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
        color: '#666',
        marginBottom: 4,
    },
    socialIconsRow: {
        flexDirection: 'row',
        marginTop: 10,
    },
    iconSpaced: {
        marginRight: 20,
    }
});

export default Support;
