import React, { useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Privacy = () => {
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
            <Text style={styles.title}>PRIVACY POLICY</Text>

            <Text style={styles.paragraph}>
                This Privacy Policy describes how your personal information is
                collected, used, and shared when you visit or make a purchase from
                https://money-mails.com (the “Site”).
            </Text>
            <Text style={styles.paragraph}>
                Protecting your private information is our priority. This Statement of
                Privacy applies to https://money-mails.com and governs data collection
                and usage. We have developed this policy in order for you to
                understand how we collect, use, communicate and make use of personal
                information. The following outlines our privacy policy.
            </Text>

            <Text style={styles.heading}>INTRODUCTION</Text>
            <Text style={styles.paragraph}>
                This Policy sets out the conditions under which we may process any
                information that we collect from you, or that you provide to us. It
                covers information that could identify you (“personal information”)
                and information that could not. In the context of the law and this
                notice, “process” means collect, store, transfer, use or otherwise act
                on information.
            </Text>

            <Text style={styles.heading}>COLLECTION OF YOUR PERSONAL INFORMATION</Text>
            <Text style={styles.paragraph}>
                money-mails Inc may collect personally identifiable information when
                you purchase any product on https://money-mails.com which might be
                subject to delivery to your designated address provided. We collect
                information such as your: Name, Address, E-mail Address, and Phone
                Number. https://money-mails.com may also collect anonymous demographic
                information, which is not unique to you.
            </Text>

            <Text style={styles.heading}>WHAT INFORMATION WE COLLECT AND WHY?</Text>
            <Text style={styles.paragraph}>
                We may collect information about you directly from you, as well as
                automatically through your use of our Site or Services.
            </Text>
            <Text style={styles.paragraph}>
                Information We Collect Directly from You: Certain
                areas and features of our Site and Services require product purchase.
                For the purpose of the purchase, you will provide your name, email
                address, delivery address, payment details, and IP address.
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

export default Privacy;
