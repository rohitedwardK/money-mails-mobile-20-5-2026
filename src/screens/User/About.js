import React, { useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const About = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('User', {
                screen: 'Home',
            });
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => {
            backHandler.remove();
        };
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Welcome to MoneyMails</Text>

            <Text style={styles.paragraph}>
                ...your one-stop shop for all things marketing! Our mission is to empower
                local entrepreneurs and businesses to reach new heights through
                effective marketing strategies and cutting-edge technology.
            </Text>
            <Text style={styles.paragraph}>
                Our platform provides a unique space for business owners to connect
                with their target audience, promote their products and services, and
                gain valuable insights from customer feedback. With our user-friendly
                interface and comprehensive database, you can easily reach and engage
                with your ideal customer.
            </Text>
            <Text style={styles.paragraph}>
                At MoneyMails, we believe in the power of data-driven marketing to
                drive real results. That's why we provide our users with the tools and
                resources they need to succeed in today's fast-paced marketplace.
                Whether you're looking to boost brand awareness, drive sales, or
                expand your customer base, we've got you covered.
            </Text>
            <Text style={styles.paragraph}>
                MoneyMails provides a platform for local entrepreneurs to showcase
                their deals, coupons, and business updates to the community. They can
                post their offers via email in two ways: Paid Mail and Informational
                Mail. With Paid Mail, they earn points (redeemable for cash) when
                users click on their emails. Informational Mail allows users to access
                coupons, deals, and vendor information with a single click.
            </Text>
            <Text style={styles.paragraph}>
                Our aim is to offer a one-stop platform for local deals on everyday
                essentials like grocery stores, haircuts, salons, and more.
                Additionally, we provide business owners with a robust database of
                users, enabling them to leverage our precise user list in every area,
                maximizing their reach and impact.
            </Text>
            <Text style={styles.paragraph}>
                Join our community today and discover the power of effective marketing
                for yourself!
            </Text>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: '#444',
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 22,
        color: '#666',
        marginBottom: 12,
    },
});

export default About;
