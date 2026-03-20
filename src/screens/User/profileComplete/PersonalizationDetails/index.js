import React, { useState, useEffect, useContext } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { ProgressBar, RadioButton, TextInput, Snackbar } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import moment from "moment";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { RACES, COUNTRYS, IDENTITYTYPES, LANGUAGES } from "../../../../constants";
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from "axios";
import { baseUrl } from '../../../../connections';
import { UserContext } from "../../../../context/UserContext";
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from "@react-navigation/native";


const PersonalizationDetails = ({ navigation }) => {
    const { userDetails } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isFocus, setIsFocus] = useState(false);
    const [isFocusRace, setIsFocusRce] = useState(false);
    const [isFocusReligion, setIsFocusReligion] = useState(false);
    const [isFocusLanguage, setIsFocusLanguage] = useState(false);

    const [lang, setLang] = useState([]);
    const [langOption, setLangOption] = useState([]);
    const [gender, setGender] = useState('male');
    const [race, setRace] = useState('');
    const [raceOption, setRaceOption] = useState('')
    const [religion, setReligion] = useState('');
    const [religionOption, setReligionOption] = useState({});

    const [userData, setuserData] = useState({});


    // BackHandler
    useFocusEffect(
        React.useCallback(() => {
            const backAction = () => {
                navigation.navigate('ProfileSetting');
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

    const getProfileData = () => {
        if (!userDetails?.uuid) return; // Prevent API call if uuid is undefined

        axios.get(`${baseUrl}/user/consumer/get/profile/${userDetails?.uuid}`, {
            headers: {
                'x-auth-token': userDetails?.token
            }
        })
            .then((res) => {
                setuserData(res?.data?.data); // Ensure `userDetails` is updated properly
                setRaceOption({ label: res?.data?.data?.ethnicity, value: res?.data?.data?.ethnicity });
                setRace(res?.data?.data?.ethnicity);
                setReligionOption({ value: res?.data?.data.religion, label: res?.data?.data.religion });
                setReligion(res?.data?.data.religion);

                setDate(new Date(res?.data?.data?.dob));
                setLangOption(res?.data?.data?.languages);
                setLang(res?.data?.data?.languages)
            })
            .catch((err) => {
            });
    };

    useEffect(() => {
        getProfileData();
    }, []); // Depend on uuid to prevent unnecessary calls

    const [religionList, setReligionList] = useState([]);

    console.log(moment(date).toISOString(), "res?.data?.data?.dob")


    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`${baseUrl}/religion/list`);

                if (Array.isArray(result.data.data)) {
                    const formattedData = result.data.data.map(item => ({
                        value: item.religion,
                        label: item.religion,
                    }));
                    setReligionList(formattedData);
                } else {
                    throw new Error('Unexpected response format');
                }
            } catch (err) {
                Snackbar.show({
                    text: 'Failed to load religion list. Please try again.',
                    duration: Snackbar.LENGTH_SHORT,
                });
            }
        };

        fetchData();
    }, [])


    const validateFields = () => {
        // if (!date) return 'D.O.B is required.';
        // if (!gender) return 'Gender is required.';
        // if (!race) return 'Race / Ethnicity is required.';
        // if (!religion) return 'Religion is required.';
        // if (lang.length<=0) return 'Language is required.';
        return null;
    };
    const isEmptyObject = (obj) =>
        obj && typeof obj === "object" && !Array.isArray(obj) && Object.keys(obj).length === 0;


    const handleNext = async () => {
        const error = validateFields();
        if (error) {
            // alert(error)
            Toast.show(error);
            return false;
        }

        let payload = {
            'dob': isEmptyObject(date) ? moment(date, "DD-MM-YYYY").toISOString() : date,
            'gender': gender,
            'ethnicity': race,
            'languages': lang,
            'religion': religion
        }
        console.log(isEmptyObject(date), userDetails?.uuid, "payload")
        let headers = { 'x-auth-token': userDetails?.token }
        axios.put(`${baseUrl}/user/profile/personal/details/${userDetails?.uuid}`, payload, {
            headers: headers
        }).then((response) => {
            Toast.show("Success!")
            navigation.navigate('AddressDetails');
        }).catch((error) => {
            alert("Something went wrong")
        })

        // 
    };

    const returnArrayLang = (data) => {
        const arrayReturn = []
        data?.map((item) => {
            arrayReturn?.push('item');
        })
        return arrayReturn;
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <ProgressBar
                    progress={calculateCompletion(userData).toFixed(0) / 100}
                    color={'#45b39d'}
                    style={{ width: 350, height: 10, marginVertical: 10, marginTop: 30 }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                    <Text style={{ fontSize: 10, color: '#222' }}>Please Provide Your personal details to complete your profile</Text>
                    <Text style={{ color: '#222' }}>{calculateCompletion(userData).toFixed(0)}%</Text>
                </View>

            </View>
            <View style={{ padding: 20 }}>

                <Text style={{ color: '#222' }}>Providing your personal details helps us to tailor your experience.
                    This information is optional but recommended for more personilzed experience.
                    Please fill out the fields below to proceed.
                </Text>
            </View>

            <View style={{ padding: 20 }}>
                <TextInput
                    mode="outlined"
                    label="D.O.B"
                    textColor="#222"
                    value={moment(date).format("DD-MM-YYYY")}
                    placeholder="DD-MM-YYYY"
                    right={<TextInput.Icon icon="calendar-month" onPress={() => setOpen(true)} />}
                    onKeyPress={() => { setOpen(true) }}
                />
                <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={date}
                    maximumDate={new Date()}
                    onConfirm={(datte) => {
                        setOpen(false)
                        // handleFormChange('dob',moment(date).format("YYYY-MM-DD"))
                        // setDate(moment(datte).format("YYYY-MM-DD"))
                        setDate(datte)
                    }}
                    onCancel={() => {
                        // handleFormChange('dob','')
                        setOpen(false)
                    }}
                />
            </View>

            {/* Gender */}
            <Text style={{
                marginLeft: 20,
                fontSize: 16,
                fontWeight: '600',
                color: '#222'
            }}>Gender</Text>
            {Platform.OS === 'ios' && <RadioButton.Group onValueChange={newValue => { setGender(newValue) }} value={gender}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20, marginLeft: 40, marginRight: 40 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{
                            width: 20,
                            height: 20,
                            borderColor: 'black',
                            borderWidth: 1,
                            borderRadius: 50,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                backgroundColor: (gender == 'male') ? '#4C987E' : 'white',
                                padding: 2,
                                height: 15,
                                width: 15,
                                borderRadius: 50,
                            }}>
                                <RadioButton value="male" />
                            </View>

                        </View>
                        <Text style={{ marginLeft: 20, fontSize: 16, color: '#222' }}>Male</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{
                            width: 20,
                            height: 20,
                            borderColor: 'black',
                            borderWidth: 1,
                            borderRadius: 50,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <View style={{
                                backgroundColor: (gender == 'female') ? '#4C987E' : 'white',
                                padding: 2,
                                height: 15,
                                width: 15,
                                borderRadius: 50,
                            }}>
                                <RadioButton value="female" />
                            </View>

                        </View>
                        <Text style={{ marginLeft: 20, fontSize: 16, color: '#222' }}>Female</Text>
                    </View>
                </View>
            </RadioButton.Group>}
            {Platform.OS === 'android' && <RadioButton.Group onValueChange={newValue => { setGender(newValue) }} value={gender}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <RadioButton value="male" />
                        <Text style={{ marginTop: 8, marginLeft: 20, fontSize: 16, color: '#222' }}>Male</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <RadioButton value="female" />
                        <Text style={{ marginTop: 8, marginLeft: 20, fontSize: 16, color: '#222' }}>Female</Text>
                    </View>
                </View>
            </RadioButton.Group>}

            {/* End Gender */}
            <Text style={{
                marginLeft: 20,
                fontSize: 16,
                fontWeight: '600',
                color: '#222'
            }}>Race / Ethincity</Text>

            <View style={{ margin: 20 }}>
                {/* Race/Ethincity */}
                <Dropdown
                    mode="modal"
                    style={[styles.dropdown, isFocusRace && { borderColor: 'black' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    itemTextStyle={{ color: 'black' }}
                    iconStyle={styles.iconStyle}
                    data={RACES}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocusRace ? 'Race / Ethincity ' : '...'}
                    searchPlaceholder="Search..."
                    value={raceOption}
                    onFocus={() => setIsFocusRce(true)}
                    onBlur={() => setIsFocusRce(false)}
                    onChange={item => {
                        setRace(item.value);
                        setRaceOption(item);
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
                <View style={{ marginTop: 10 }}>
                    <Text style={{
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#222'
                    }}>Religion</Text>

                    <Dropdown
                        mode="modal"
                        value={religionOption} // Ensure this is an object with `label` & `value`
                        style={[styles.dropdown, isFocusReligion && { borderColor: 'black' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemTextStyle={{ color: 'black' }}
                        iconStyle={styles.iconStyle}
                        data={religionList} // Make sure this is an array of objects with label & value
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocusReligion ? 'Religion ' : '...'}
                        searchPlaceholder="Search..."
                        onFocus={() => setIsFocusReligion(true)}
                        onBlur={() => setIsFocusReligion(false)}
                        onChange={item => {
                            setReligion(item.value);
                            setReligionOption(item); // Store the full object, not just value
                            setIsFocusReligion(false);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={styles.icon}
                                color={isFocusReligion ? 'black' : 'black'}
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
                        color: '#222'
                    }}>Languages</Text>
                    <MultiSelect
                        dropdownPosition={'top'}
                        style={[styles.dropdown, isFocusLanguage && { borderColor: 'black' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemTextStyle={{ color: 'black' }}
                        iconStyle={styles.iconStyle}
                        data={LANGUAGES} // Ensure this matches { label, value }
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocusLanguage ? 'Language' : '...'}
                        searchPlaceholder="Search..."
                        value={langOption || userData?.languages} // Ensure it's an array of objects
                        defaultValue={['Telugu']}
                        onChange={items => {
                            setLang(items);
                            setLangOption(items); // Store the full selected array
                            setIsFocusLanguage(false);
                        }}
                        renderLeftIcon={() => (
                            <AntDesign
                                style={styles.icon}
                                color={isFocusLanguage ? 'black' : 'black'}
                                name="Safety"
                                size={20}
                            />
                        )}
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
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
})


export default PersonalizationDetails;