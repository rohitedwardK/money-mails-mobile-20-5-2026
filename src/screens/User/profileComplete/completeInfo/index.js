import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, BackHandler } from "react-native";
import { ProgressBar } from "react-native-paper";
import AntDesign from 'react-native-vector-icons/AntDesign';
import ManImg from '../../../../assets/images/man.png';
import HackerImg from '../../../../assets/images/hacker.png';
import profileImg from '../../../../assets/images/profile-2.png';
import completeProfImg from '../../../../assets/images/completeProfImg.jpg'
import { UserContext } from "../../../../context/UserContext";
import axios from "axios";
import { baseUrl } from "../../../../connections";
import { useFocusEffect } from "@react-navigation/native";

const completeInfo = ({ navigation }) => {
    const { userDetails } = useContext(UserContext);

    // BackHandler
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                navigation.navigate('profileDrawer');
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );

            return () => backHandler.remove();
        }, [navigation])
    );

    function calculateCompletion(obj) {
        const fieldsToCheck = [
            "address1", "address2", "apartment_number", "city", "country", "county", "dob",
            "email", "ethnicity", "firstName", "gender", "id_number", "id_proof",
            "id_type", "languages", "lastName", "mobile", "pincode",
            "profile_pic", "religion", "ssn", "state"
        ];

        const totalKeys = fieldsToCheck.length;
        const filledKeys = fieldsToCheck.filter(key => {
            const value = obj[key];
            return value !== null && value !== undefined && value !== "" &&
                (!Array.isArray(value) || value.length > 0); // Checking empty arrays
        }).length;

        return (filledKeys / totalKeys) * 100;
    }
    const [userData, setuserData] = useState({});
    const getProfileData = () => {
        if (!userDetails?.uuid) return; // Prevent API call if uuid is undefined

        axios.get(`${baseUrl}/user/consumer/get/profile/${userDetails?.uuid}`, {
            headers: {
                'x-auth-token': userDetails?.token
            }
        })
            .then((res) => {
                setuserData(res?.data?.data); // Ensure `userDetails` is updated properly
            })
            .catch((err) => {
            });
    };

    useEffect(() => {
        getProfileData()
    }, [])


    return (
        <ScrollView>
            <View style={styles.container}>
                <ProgressBar
                    progress={calculateCompletion(userData).toFixed(0) / 100}
                    color={'#45b39d'}
                    style={styles.progressBar}
                />

                <View style={styles.progressBarText}>
                    <Text style={{ fontSize: 10, color: '#222' }}>Please Provide Your personal details to complete your profile</Text>
                    <Text>{calculateCompletion(userData).toFixed(0)}%</Text>
                </View>

            </View>

            <TouchableOpacity
                style={{ width: '100%' }}
                onPress={() => {
                    navigation.navigate('ProfileSetting')
                }}
            >
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Complete Profile</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.container}>
                {/* <Text style={styles.textHead}>Why complete your profile?</Text>
                        <View style={styles.learnMoreContainer }>
                            
                            <View style={styles.row}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={styles.imgBox}>
                                        <Image source={HackerImg}  style={styles.img}/>
                                    </View>
                                    <View style={styles.imgText}>
                                        <Text>Get Exclusive...</Text>
                                    </View>
                                </View>
                                <View style={{justifyContent:'center' , alignItems:'flex-end'}}>
                                    <TouchableOpacity>
                                        <View style={styles.learnMoreButton}>
                                            <Text>Learn More</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            

                            <View style={styles.row}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={styles.imgBox}>
                                        <Image source={profileImg}  style={styles.img}/>
                                    </View>
                                    <View style={styles.imgText}>
                                        <Text>Receive...</Text>
                                    </View>
                                </View>
                                <View style={{justifyContent:'center' , alignItems:'flex-end'}}>
                                    <TouchableOpacity>
                                        <View style={styles.learnMoreButton}>
                                            <Text>Learn More</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                           

                            <View style={styles.row}>
                                <View style={{flexDirection:'row'}}>
                                    <View style={styles.imgBox}>
                                        <Image source={ManImg}  style={styles.img}/>
                                    </View>
                                    <View style={styles.imgText}>
                                        <Text>Enjoy a...</Text>
                                    </View>
                                </View>
                                <View style={{justifyContent:'center' , alignItems:'flex-end'}}>
                                    <TouchableOpacity>
                                        <View style={styles.learnMoreButton}>
                                            <Text>Learn More</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View> */}

                <View style={{ alignItems: 'center', margin: 15 }}>
                    <Image source={completeProfImg} style={{ width: 200, height: 200 }} />
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.textHead}>Complete your profile to</Text>
                    <Text style={styles.textHead}>get personalized deals</Text>
                    <Text style={styles.textHead}>tailored to your</Text>
                    <Text style={styles.textHead}>preferences!</Text>
                </View>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ color: '#222' }}>By completing your profile, you unlock a</Text>
                    <Text style={{ color: '#222' }}>world of personalized offers and </Text>
                    <Text style={{ color: '#222' }}>recommendations. This helps us...</Text>
                </View>
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        marginBottom: 0
    },
    imgText: { justifyContent: 'center', marginLeft: 10 },
    imgBox: {
        borderWidth: 0.5,
        borderRadius: 100,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        height: 30,
        width: 30
    },
    textHead: {
        color: '#222',
        fontSize: 16,
        fontWeight: '700'
    },
    progressBar: {
        width: 370,
        height: 10,
        marginVertical: 10
    },
    progressBarText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    button: {
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#45b39d',
        margin: 10, marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        marginRight: 10
    },
    learnMoreContainer: {
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 15
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between'
    },
    learnMoreButton: {
        backgroundColor: '#abb2b9',
        padding: 5,
        borderRadius: 15
    }
})

export default completeInfo;

