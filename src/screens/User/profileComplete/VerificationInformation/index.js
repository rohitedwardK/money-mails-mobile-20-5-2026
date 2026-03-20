import React, { useState, useEffect, useContext } from "react";
import {
    ScrollView,
    Text, View,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    BackHandler
} from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Enctypo from 'react-native-vector-icons/Entypo'
import { Dropdown } from "react-native-element-dropdown";
import { RACES, COUNTRYS, IDENTITYTYPES } from "../../../../constants";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { baseUrl } from "../../../../connections";
import { UserContext } from "../../../../context/UserContext";
import axios from "axios";
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from "@react-navigation/native";

const VerificationInformation = ({ navigation }) => {
    const { userDetails } = useContext(UserContext);
    const [idProof, setIdProof] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const [zelle_id, onChangeZelleId] = useState('');
    const [ssn, onChangeSSN] = useState(userDetails?.ssn);
    const [id_type, setIdType] = useState('');
    const [id_number, setIdNumber] = useState('')

    const [isFocus, setIsFocus] = useState(false);
    const [isFocusRace, setIsFocusRce] = useState(false);

    const [userData, setuserData] = useState({});


    //Backhandler
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                navigation.navigate('AddressDetails');
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
        if (!userDetails?.uuid) return; // Prevent API call if uuid is undefined

        axios.get(`${baseUrl}/user/consumer/get/profile/${userDetails?.uuid}`, {
            headers: {
                'x-auth-token': userDetails?.token
            }
        })
            .then((res) => {
                setuserData(res?.data?.data); // Ensure `userDetails` is updated properly
                setIdProof(res?.data?.data?.id_proof);
                setProfilePic(res?.data?.data?.profile_pic);
                onChangeZelleId(res?.data?.data?.zelle_id);
                onChangeSSN(res?.data?.data?.ssn);
                setIdType(res?.data?.data?.id_type)
                setIdNumber(res?.data?.data?.id_number)
            })
            .catch((err) => {
            });
    };

    useEffect(() => {
        getProfileData();
    }, []); // Depend on uuid to prevent unnecessary calls



    const uploadImage = async (imageUri, type, name, field) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: type, // adjust the file type based on your requirement
                name: name,
            });

            const response = await axios.post(`${baseUrl}/user/upload/file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success === true) {
                if (field === 'profile') {
                    setProfilePic(response.data.image.filename)
                }
                if (field === 'idProof') {
                    setIdProof(response.data.image.filename)
                }
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };
    const handleChoosePhoto = async (id) => {
        const options = {
            title: 'Choose an Image',
            mediaType: 'photo',
            // includeBase64: true,
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.9,
            videoQuality: 'low',
            noData: true,
            fileSize: 1
        };
        if (id === 'id_proof_file_name') {
            const result = await launchImageLibrary(options);
            uploadImage(result?.assets[0].uri, result?.assets[0].type, result?.assets[0].fileName, 'idProof')
            const base64 = `data:${result?.assets[0].type};base64`;
            // setIdProof(base64);
            // handleFormChange(id, result?.assets[0].base64);
        } else {
            const result = await launchImageLibrary(options);
            uploadImage(result?.assets[0].uri, result?.assets[0].type, result?.assets[0].fileName, 'profile')
            const base64 = `data:${result?.assets[0].type};base64`;
            // setProfilePic(base64);
            // handleFormChange(id, result?.assets[0].base64);
        }

    };

    const validateFields = () => {
        // if (!zelle_id) return 'Zelle Id is required.';
        // if (!ssn) return 'SSN is required.';
        // if (!id_type) return 'ID Type is required.';
        // if (!idProof) return 'ID Proof is required.';
        return null;
    };

    const handleNext = async () => {
        const error = validateFields();
        if (error) {
            // alert(error)
            Toast.show(error)
            return false;
        }

        let payload = {
            'zelle_id': zelle_id,
            'profile_pic': profilePic,
            'id_type': id_type,
            'id_proof_file_name': idProof,
            'ssn': ssn,
            'id_number': id_number
        }

        let headers = { 'x-auth-token': userDetails?.token }
        axios.put(`${baseUrl}/user/profile/verification/details/${userDetails?.uuid}`, payload, {
            headers: headers
        }).then((response) => {
            Toast.show("Success!")

            navigation.navigate('User')
        }).catch((error) => {
            Toast.show("Something went wrong")
        })

        // 
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={{ fontSize: 16, color: 'black' }}> Please provide necessary information to verify </Text>
                <Text style={{ fontSize: 16, color: 'black', marginLeft: 5, marginBottom: 20 }}>your identity.</Text>
                <Text style={styles.label}>Zelle ID</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeZelleId}
                    value={zelle_id}
                    placeholder="Enter Zelle ID"

                />

                <Text style={styles.label}>SSN Number</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeSSN}
                    value={ssn}
                    placeholder="Enter SSN Number (Optional)"
                />

                <Text style={styles.label}>Identity Type</Text>

                <View style={{ margin: 10 }}>
                    <Dropdown
                        style={[styles.dropdown, isFocusRace && { borderColor: 'black' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemTextStyle={{ color: 'black' }}
                        iconStyle={styles.iconStyle}
                        data={IDENTITYTYPES}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocusRace ? 'Identity Type ' : '...'}
                        searchPlaceholder="Search..."
                        value={id_type}
                        onFocus={() => setIsFocusRce(true)}
                        onBlur={() => setIsFocusRce(false)}
                        onChange={item => {
                            setIdType(item.value);
                            // handleFormChange('ethnicity',item.value)
                            setIsFocusRce(false);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={styles.icon}
                                color={isFocus ? 'black' : 'black'}
                                name="Safety"
                                size={20}
                            />
                        )}
                    />
                </View>
                {id_type && <View>
                    <Text style={styles.label}>Identity Number</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setIdNumber}
                        value={id_number}
                        placeholder="Enter Id Number"
                    />
                </View>
                }
                <Text style={styles.label}>File Upload</Text>
                <Text style={{ margin: 10, color: '#222' }} >Upload a clear photo or scanned copy of your ID Proof.</Text>
                <TouchableOpacity onPress={() => handleChoosePhoto('profile_pic')}>
                    <View style={styles.dottedBorder}>
                        <View>
                            {profilePic === '' && < AntDesign name="clouduploado" size={40} color={'black'} />}
                            {profilePic !== '' && <Image style={{ width: 100, height: 90, resizeMode: 'cover', marginTop: 0 }} source={{ uri: `${profilePic}` }} />}
                        </View>
                    </View>
                </TouchableOpacity>
                <Text style={{ margin: 10, color: '#222' }} >Upload a recent profile picture.</Text>
                <TouchableOpacity onPress={() => handleChoosePhoto('id_proof_file_name')}>
                    <View style={styles.dottedBorder}>
                        <View>
                            {idProof === '' && < Enctypo name="image" size={40} color={'black'} />}
                            {idProof !== '' && <Image style={{ width: 100, height: 90, resizeMode: 'cover', marginTop: 0 }} source={{ uri: `${idProof}` }} />}
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={handleNext}
                >
                    <View style={{ flexDirection: 'row', padding: 10, backgroundColor: '#45b39d', margin: 10, marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 10 }}>Continue</Text>

                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={() => {
                        navigation.navigate('AddressDetails')
                    }}
                >
                    <View style={{ flexDirection: 'row', padding: 10, borderWidth: 0.5, margin: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', marginRight: 10 }}>Back</Text>

                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        marginTop: 20
    },
    label: {
        fontSize: 18,
        fontWeight: '400',
        marginLeft: 10,
        color: '#222'
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        margin: 12,
        borderWidth: 0.5,
        borderColor: '##515a5a',
        padding: 10,
        color: '#222'
    },
    placeholderStyle: {
        fontSize: 16,
        color: 'black'
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'black'
    },
    inputSearchStyle: {
        color: 'black',
        height: 40,
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    dropdown: {
        height: 50,
        color: 'black',
        // width: screenWidth - 70,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },

    dottedBorder: {
        width: '95%',
        margin: 10,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'black',
        borderStyle: 'dotted',
        borderRadius: 8, // Optional for rounded corners
    },
    text: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
})


export default VerificationInformation;