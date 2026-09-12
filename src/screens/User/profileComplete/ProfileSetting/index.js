import React, { useState, useContext, useEffect } from 'react';
import {
    ScrollView,
    Text, View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    BackHandler,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { UserContext } from '../../../../context/UserContext';
import axios from 'axios';
import { baseUrl } from '../../../../connections';
import { useFocusEffect } from '@react-navigation/native';


const ProfileSetting = ({ navigation }) => {

    const { userDetails } = useContext(UserContext);
    const [firstName, onChangeFirstName] = useState(userDetails.firstName);
    const [lastName, onChangeLastName] = useState(userDetails.lastName);
    const [phone, onChangePhone] = useState(userDetails.mobile);
    const [email, onChangeEmail] = useState(userDetails.email);

    const [userData, setuserData] = useState({});

        // BackHandler
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                navigation.navigate('CompleteInfo');
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction
            );

            return () => backHandler.remove();
        }, [navigation])
    );

    const getProfileData = () => {
        if (!userDetails?.uuid) {return;} // Prevent API call if uuid is undefined

        axios.get(`${baseUrl}/user/consumer/get/profile/${userDetails?.uuid}`, {
            headers: {
                'x-auth-token': userDetails?.token,
            },
        })
            .then((res) => {
                setuserData(res?.data?.data); // Ensure `userDetails` is updated properly
                onChangeFirstName(res?.data?.data?.firstName);
                onChangeLastName(res?.data?.data?.lastName);
                onChangePhone(res?.data?.data?.mobile);
                onChangeEmail(res?.data?.data?.email);

            })
            .catch((err) => {
                console.log(err, 'Error fetching profile data');
            });
    };

    useEffect(() => {
        getProfileData();
    }, []); // Depend on uuid to prevent unnecessary calls

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeFirstName}
                    value={firstName}
                    placeholder="Enter First Name"
                    editable={false}
                />

                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeLastName}
                    value={lastName}
                    placeholder="Enter First Name"
                    editable={false}
                />
                <Text style={styles.label}>Phone</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangePhone}
                    value={phone}
                    placeholder="Enter Phone Number"
                    editable={false}

                />

                <Text style={styles.label}>Primary Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeEmail}
                    value={email}
                    placeholder="Enter First Name"
                    editable={false}
                />


                <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={() => {
                        navigation.navigate('PersonalizationDetails');
                    }}
                >
                    <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#45b39d', margin: 10, marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 10 }}>Next</Text>
                        < AntDesign name="arrowright" size={20} color={'white'} />
                    </View>
                </TouchableOpacity>
            </View>




        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        marginTop: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: '400',
        marginLeft: 10,
        color : '#222',
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        margin: 12,
        borderWidth: 0.5,
        borderColor: '##515a5a',
        padding: 10,
        color: '#222',
    },
});


export default ProfileSetting;
