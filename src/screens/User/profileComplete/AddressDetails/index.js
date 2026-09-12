import React, { useState, useEffect, useContext } from 'react';
import {
    ScrollView, Text, View, StyleSheet,
    TextInput, TouchableOpacity,
    BackHandler,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Dropdown } from 'react-native-element-dropdown';
import { RACES, COUNTRYS, IDENTITYTYPES } from '../../../../constants';
import { useStateData } from '../../../../hooks/services/useStateData';
import { useCountyData } from '../../../../hooks/services/useCountyData';
import { useCityData } from '../../../../hooks/services/useCityData';
import { UserContext } from '../../../../context/UserContext';
import axios from 'axios';
import { baseUrl } from '../../../../connections';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';

const AddressDetails = ({ navigation }) => {
    const { userDetails } = useContext(UserContext);
    const [address1, onChangeAddress1] = useState(userDetails.address?.location);
    const [address2, onChangeAddress2] = useState(userDetails.address?.addressLine1);
    const [houseno, onChangeHouseno] = useState(userDetails.address?.apartmentNo);
    const [country, setCountry] = useState(userDetails.address?.country);
    const [state, setState] = useState(userDetails.address?.state);
    const [county, setCounty] = useState(userDetails.address?.county);
    const [city, setCity] = useState(userDetails.address?.city);

    const [zipcode, onChangeZipcode] = useState(userDetails.address?.zip);
    const [isFocus, setIsFocus] = useState(false);
    const [isFocusCountry, setIsFocusCountry] = useState(false);
    const [isFocusState, setIsFocusState] = useState(false);
    const [isFocusCounty, setIsFocusCounty] = useState(false);
    const [isFocusCity, setIsFocusCity] = useState(false);

    const { stateData, setStateData } = useStateData();
    const { countyData, setCountyData } = useCountyData();
    const { cityData, setCityData } = useCityData();

    const [userData, setuserData] = useState({});

    // BackHandler
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                navigation.navigate('PersonalizationDetails');
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
                onChangeAddress1(res?.data?.data?.address1);
                onChangeAddress2(res?.data?.data?.address2);
                onChangeHouseno(res?.data?.data?.apartment_number);
                setCountry(res?.data?.data?.country);
                setState(res?.data?.data?.state);
                setCounty(res?.data?.data?.county);
                setCity(res?.data?.data?.city);
                onChangeZipcode(res?.data?.data?.pincode);

                setStateData(res?.data?.data?.country);
                setCountyData(res?.data?.data?.state);
                setCityData(res?.data?.data?.county);

            })
            .catch((err) => {
            });
    };

    useEffect(() => {
        getProfileData();
    }, []); // Depend on uuid to prevent unnecessary calls


    const validateFields = () => {
        // if (!address1) return 'Address1 is required.';
        // if (!country) return 'Country is required.';
        // if (!state) return 'State is required.';
        // if (!zipcode) return 'Zipcode is required.';
        return null;
    };

    const handleNext = async () => {

        const error = validateFields();
        if (error) {
            Toast.show(error);
            return false;
        }

        let payload = {
            'address1': address1,
            'address2': address2,
            'country': country,
            'state': state,
            'county': county,
            'city': city,
            'apartment_number': houseno,
            'pincode': zipcode,
        };

        let headers = { 'x-auth-token': userDetails?.token };
        axios.put(`${baseUrl}/user/profile/address/details/${userDetails?.uuid}`, payload, {
            headers: headers,
        }).then((response) => {
            Toast.show('Success!');
            navigation.navigate('VerificationInformation');
        }).catch((error) => {
            Toast.show('Something went wrong.');
        });

    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.label}>Address 1</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeAddress1}
                    value={address1}
                    placeholder="Enter Address 1"

                />

                <Text style={styles.label}>Address 2</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeAddress2}
                    value={address2}
                    placeholder="Enter Address 2"

                />
                <Text style={styles.label}>House No</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeHouseno}
                    value={houseno}
                    placeholder="Enter House Number"

                />


                <Text style={{
                    marginLeft: 10,
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#222',
                }}>Country</Text>

                <View style={{ margin: 10 }}>
                    {/* Race/Ethincity */}
                    <Dropdown
                        mode="modal"
                        style={[styles.dropdown, isFocusCountry && { borderColor: 'black' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemTextStyle={{ color: 'black' }}
                        iconStyle={styles.iconStyle}
                        data={COUNTRYS}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocusCountry ? 'Country ' : '...'}
                        searchPlaceholder="Search..."
                        value={country}
                        onFocus={() => setIsFocusCountry(true)}
                        onBlur={() => setIsFocusCountry(false)}
                        onChange={item => {
                            setCountry(item.value);
                            setStateData(item.value);
                            setIsFocusCountry(false);
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
                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            marginTop: 10,
                            marginBottom: 10,
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#222',
                        }}>State</Text>
                        <Dropdown
                            mode="modal"
                            style={[styles.dropdown, isFocusState && { borderColor: 'black' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={{ color: 'black' }}
                            iconStyle={styles.iconStyle}
                            data={stateData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocusState ? 'State ' : '...'}
                            searchPlaceholder="Search..."
                            value={state}
                            onFocus={() => setIsFocusState(true)}
                            onBlur={() => setIsFocusState(false)}
                            onChange={item => {
                                setState(item.value);
                                setCountyData(item.value);
                                setIsFocusState(false);
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

                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            marginTop: 10,
                            marginBottom: 10,
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#222',
                        }}>County</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocusCounty && { borderColor: 'black' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={{ color: 'black' }}
                            iconStyle={styles.iconStyle}
                            data={countyData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocusCounty ? 'County ' : '...'}
                            searchPlaceholder="Search..."
                            value={county}
                            onFocus={() => setIsFocusCounty(true)}
                            onBlur={() => setIsFocusCounty(false)}
                            onChange={item => {
                                setCounty(item.value);
                                setCityData(item.value);
                                setIsFocusCounty(false);
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

                        {/*  */}
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{
                            marginTop: 10,
                            marginBottom: 10,
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#222',
                        }}>City</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocusCity && { borderColor: 'black' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            itemTextStyle={{ color: 'black' }}
                            iconStyle={styles.iconStyle}
                            data={cityData}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocusCity ? 'City ' : '...'}
                            searchPlaceholder="Search..."
                            value={city}
                            onFocus={() => setIsFocusCity(true)}
                            onBlur={() => setIsFocusCity(false)}
                            onChange={item => {
                                setCity(item.value);
                                setIsFocusCity(false);
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

                        {/*  */}
                    </View>
                </View>

                <Text style={styles.label}>Zip Code</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeZipcode}
                    value={zipcode}
                    placeholder="Enter Zip Code"

                />

                <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={handleNext}
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
});


export default AddressDetails;
