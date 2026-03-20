import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, BackHandler } from "react-native";
import { usePopUpAds } from "../../hooks/services/usePopupads";
import Carousel from "react-native-reanimated-carousel";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";

const width = Dimensions.get('window').width;

const PopupAds = () => {
    const { PopUpAddData } = usePopUpAds();
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
        <View style={styles.container}>
            <Text style={styles.header}>Special Offers for You</Text>

            {PopUpAddData && PopUpAddData.length > 0 ? (
                <Carousel
                    loop
                    width={width}
                    height={width / 1.2}
                    autoPlay={true}
                    data={PopUpAddData}
                    scrollAnimationDuration={1000}
                    onSnapToItem={(index) => { }}
                    renderItem={({ item, index }) => (
                        <View style={styles.carouselItem}>
                            <FastImage
                                style={styles.image}
                                source={{
                                    uri: item?.image,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View style={styles.captionContainer}>
                                <Text style={styles.captionText}>{`Slide ${index + 1} label`}</Text>
                                <Text style={styles.captionSubText}>{`Description for slide ${index + 1}`}</Text>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noAdsText}>No ads available at this moment. Please check back later.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    carouselItem: {
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        width: '90%',
        height: '80%',
        alignSelf: 'center',
        borderRadius: 15,
    },
    captionContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        position: 'absolute',
        bottom: '20%',
        width: '90%',
        alignSelf: 'center',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    captionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    captionSubText: {
        color: '#eee',
        fontSize: 14,
        textAlign: 'center',
    },
    noAdsText: {
        fontSize: 16,
        color: '#666',
        marginTop: 50,
        textAlign: 'center',
        paddingHorizontal: 20,
    }
});

export default PopupAds;
