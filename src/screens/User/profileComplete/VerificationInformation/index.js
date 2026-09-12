import React, { useState, useEffect, useContext } from 'react';
import {
    ScrollView,
    Text, View,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    BackHandler,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Enctypo from 'react-native-vector-icons/Entypo';
import { Dropdown } from 'react-native-element-dropdown';
import { IDENTITYTYPES } from '../../../../constants';
import { launchImageLibrary } from 'react-native-image-picker';
import { UserContext } from '../../../../context/UserContext';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import SecureScreen from '../../../../components/atoms/SecureScreen';
import { fetchUserProfile, uploadUserFile } from '../../../../api/moneyMails';
import { apiPut } from '../../../../api/client';

const VerificationInformation = ({ navigation }) => {
    const { userDetails } = useContext(UserContext);
    const [idProof, setIdProof] = useState('');
    const [profilePic, setProfilePic] = useState('');

    const [zelle_id, onChangeZelleId] = useState('');
    const [ssn, onChangeSSN] = useState(userDetails?.ssn);
    const [id_type, setIdType] = useState('');
    const [id_number, setIdNumber] = useState('');

    const [isFocus, setIsFocus] = useState(false);
    const [isFocusRace, setIsFocusRce] = useState(false);

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

    const getProfileData = async () => {
        if (!userDetails?.uuid) {
            return;
        }

        try {
            const response = await fetchUserProfile(userDetails.uuid, userDetails.token);
            const profile = response?.data || response;
            setIdProof(profile?.id_proof || '');
            setProfilePic(profile?.profile_pic || '');
            onChangeZelleId(profile?.zelle_id || '');
            onChangeSSN(profile?.ssn || '');
            setIdType(profile?.id_type || '');
            setIdNumber(profile?.id_number || '');
        } catch (_error) {
            Toast.show('Unable to load verification details.');
        }
    };

    useEffect(() => {
        getProfileData();
    }, []);

    const uploadImage = async (imageUri, type, name, field) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: imageUri,
                type: type,
                name: name,
            });

            const response = await uploadUserFile(formData);
            const filename =
                response?.data?.image?.filename ||
                response?.image?.filename ||
                response?.filename ||
                '';

            if (filename) {
                if (field === 'profile') {
                    setProfilePic(filename);
                }
                if (field === 'idProof') {
                    setIdProof(filename);
                }
            }
        } catch (error) {
            if (__DEV__) {
                console.error('Upload failed:', error);
            }
            Toast.show('Upload failed. Please try again.');
        }
    };

    const handleChoosePhoto = async (id) => {
        const options = {
            title: 'Choose an Image',
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            quality: 0.9,
            videoQuality: 'low',
            noData: true,
            fileSize: 1,
        };

        const result = await launchImageLibrary(options);
        const asset = result?.assets?.[0];
        if (!asset?.uri) {
            return;
        }

        if (id === 'id_proof_file_name') {
            uploadImage(asset.uri, asset.type, asset.fileName, 'idProof');
        } else {
            uploadImage(asset.uri, asset.type, asset.fileName, 'profile');
        }
    };

    const validateFields = () => {
        if (!id_type) {return 'ID Type is required.';}
        if (!id_number.trim()) {return 'Identity Number is required.';}
        if (!idProof) {return 'ID Proof is required.';}
        return null;
    };

    const handleNext = async () => {
        const error = validateFields();
        if (error) {
            Toast.show(error);
            return;
        }

        const payload = {
            zelle_id,
            profile_pic: profilePic,
            id_type,
            id_proof_file_name: idProof,
            ssn,
            id_number,
        };

        try {
            await apiPut(
                `/user/profile/verification/details/${userDetails?.uuid}`,
                payload,
            );
            Toast.show('Success!');
            navigation.navigate('User');
        } catch (_error) {
            Toast.show('Something went wrong');
        }
    };

    return (
        <SecureScreen>
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
                    secureTextEntry
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
                        navigation.navigate('AddressDetails');
                    }}
                >
                    <View style={{ flexDirection: 'row', padding: 10, borderWidth: 0.5, margin: 10, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', marginRight: 10 }}>Back</Text>

                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SecureScreen>
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
        color: '#222',
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
    placeholderStyle: {
        fontSize: 16,
        color: 'black',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'black',
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
        borderRadius: 8,
    },
    text: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


export default VerificationInformation;
