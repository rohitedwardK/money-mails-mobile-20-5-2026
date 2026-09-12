import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import Button from '../../../../components/atoms/Button';
import TextField from '../../../../components/atoms/TextField';
import {COUNTRY} from '../../../../constants';
import {UserContext} from '../../../../context/UserContext';
import {
  completeAuthenticatedProfile,
  completeVerifiedEmailProfile,
  createCity,
  createCounty,
  fetchCitiesByCounty,
  fetchCountiesByState,
  fetchStatesByCountry,
  uploadUserFile,
} from '../../../../api/moneyMails';
import {
  fetchPlaceAutocomplete,
  fetchPlaceDetails,
} from '../../../../api/awsPlaces';
import {
  extractAuthData,
  fetchAuthenticatedUserProfile,
  getPostAuthRoute,
  persistUserSession,
} from '../../../../utils/authSession';

const DEFAULT_COUNTRY_UUID = COUNTRY?.[0]?.id || 'CO-42A82D09';
const DEFAULT_COUNTRY_NAME = COUNTRY?.[0]?.title || 'United States';

const normalizeName = value =>
  String(value || '')
    .toLowerCase()
    .replace(/\b(county|parish|borough|municipality|census area)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();

const normalizeCountyForCreate = value => {
  const clean = String(value || '').trim();
  if (!clean) {return '';}
  return /\b(county|parish|borough|municipality|census area)\b/i.test(clean)
    ? clean
    : `${clean} County`;
};

const resolveList = payload => payload?.data || payload || [];

const getProfileImageValue = response =>
  response?.data?.image?.filename ||
  response?.data?.filename ||
  response?.image?.filename ||
  response?.filename ||
  '';

const CompleteInfo = ({navigation, route}) => {
  const {userDetails, setUserDetails, setPostAuthScreen, setPendingGuestRoute} =
    useContext(UserContext);
  const params = route?.params || {};
  const emailVerificationToken = params?.emailVerificationToken || '';
  const isVerifiedEmailFlow = Boolean(emailVerificationToken);
  const storedAddress = userDetails?.address || {};

  const [formData, setFormData] = useState({
    firstName: userDetails?.firstName || '',
    lastName: userDetails?.lastName || '',
    email:
      params?.prefillEmail ||
      userDetails?.primaryEmail ||
      userDetails?.email ||
      '',
    phone: userDetails?.phone || {code: '1', value: ''},
    country: storedAddress?.country || DEFAULT_COUNTRY_UUID,
    state: storedAddress?.state || '',
    county: storedAddress?.county || '',
    city: storedAddress?.city || '',
    pincode: storedAddress?.zip || '',
    street: storedAddress?.location || '',
  });
  const [states, setStates] = useState([]);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [pickedAddress, setPickedAddress] = useState(null);
  const [profileImageUri, setProfileImageUri] = useState(
    userDetails?.avatar || userDetails?.profile_pic || '',
  );
  const [profileImageFileName, setProfileImageFileName] = useState(
    userDetails?.profile_pic || '',
  );
  const [loading, setLoading] = useState(false);
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);

  const selectedStateName = useMemo(() => {
    const selected = states.find(state => state.uuid === formData.state);
    return selected?.name || '';
  }, [formData.state, states]);

  const showError = message => {
    Snackbar.show({
      text: message || 'Request could not be completed.',
      duration: Snackbar.LENGTH_LONG,
    });
  };

  const updateField = (field, value) => {
    setFormData(current => ({
      ...current,
      [field]: value,
      ...(field === 'state'
        ? {county: '', city: '', pincode: '', street: ''}
        : {}),
    }));
  };

  const navigateAfterAuth = sessionData => {
    setPendingGuestRoute(null);
    const target = getPostAuthRoute(sessionData);
    if (target.stack === 'UserScreens') {
      setPostAuthScreen(target.screen || 'Home');
      return;
    }
    navigation.navigate(target.screen || 'SignIn');
  };

  useEffect(() => {
    let mounted = true;
    fetchStatesByCountry(DEFAULT_COUNTRY_UUID)
      .then(payload => {
        if (mounted) {setStates(resolveList(payload));}
      })
      .catch(() => showError('State list could not be loaded.'));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (addressQuery.trim().length < 3) {
      setAddressResults([]);
      return undefined;
    }

    const timeout = setTimeout(() => {
      setSearchingAddress(true);
      fetchPlaceAutocomplete(addressQuery.trim(), 'USA')
        .then(setAddressResults)
        .catch(error => showError(error?.message))
        .finally(() => setSearchingAddress(false));
    }, 350);

    return () => clearTimeout(timeout);
  }, [addressQuery]);

  const chooseProfilePhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });
    const asset = result?.assets?.[0];
    if (!asset?.uri) {return;}

    setProfileImageUri(asset.uri);
    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append('file', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `profile-${Date.now()}.jpg`,
      });
      const response = await uploadUserFile(data);
      const fileName = getProfileImageValue(response);
      if (fileName) {setProfileImageFileName(fileName);}
    } catch (error) {
      showError(error?.message || 'Profile photo upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const resolveState = address => {
    const stateName = String(address?.stateName || '').trim();
    const stateCode = String(address?.state || '').trim();
    return states.find(state => {
      const name = String(state?.name || '').trim();
      const code = String(state?.code || state?.state_code || '').trim();
      return (
        name.toLowerCase() === stateName.toLowerCase() ||
        code.toLowerCase() === stateCode.toLowerCase()
      );
    });
  };

  const findOrCreateCounty = async (stateUuid, countyName) => {
    const counties = resolveList(await fetchCountiesByState(stateUuid));
    const match = counties.find(
      county => normalizeName(county?.name) === normalizeName(countyName),
    );
    if (match?.uuid) {return match;}

    const created = await createCounty(
      stateUuid,
      normalizeCountyForCreate(countyName),
    );
    return created?.data || created;
  };

  const findOrCreateCity = async (countyUuid, cityName) => {
    const cities = resolveList(await fetchCitiesByCounty(countyUuid));
    const match = cities.find(
      city => normalizeName(city?.name) === normalizeName(cityName),
    );
    if (match?.uuid) {return match;}

    const created = await createCity(countyUuid, String(cityName || '').trim());
    return created?.data || created;
  };

  const handleAddressSelect = async item => {
    setResolvingAddress(true);
    try {
      const placeId = item?.PlaceId || item?.Place?.PlaceId || item?.Id;
      const details = await fetchPlaceDetails(placeId);
      const state = resolveState(details);
      const countyName = String(details?.county || '').trim();
      const cityName = String(details?.city || '').trim();
      const zip = String(details?.zip || '').match(/\d{5}/)?.[0] || '';
      const street =
        details?.street || details?.displayLine1 || details?.address1 || '';

      if (!state?.uuid) {throw new Error('Selected address state is unavailable.');}
      if (!countyName) {throw new Error('Pick an address with a county.');}
      if (!cityName) {throw new Error('Pick an address with a city.');}
      if (!zip) {throw new Error('Pick an address with a valid ZIP code.');}

      const county = await findOrCreateCounty(state.uuid, countyName);
      const city = await findOrCreateCity(county.uuid, cityName);
      if (!county?.uuid || !city?.uuid) {
        throw new Error('Selected address could not be resolved.');
      }

      setPickedAddress(details);
      setFormData(current => ({
        ...current,
        country: DEFAULT_COUNTRY_UUID,
        state: state.uuid,
        county: county.uuid,
        city: city.uuid,
        pincode: zip,
        street,
        position:
          details?.lat != null && details?.lng != null
            ? {type: 'Point', coordinates: [details.lng, details.lat]}
            : undefined,
      }));
      setAddressModalOpen(false);
      setAddressQuery('');
      setAddressResults([]);
    } catch (error) {
      showError(error?.message);
    } finally {
      setResolvingAddress(false);
    }
  };

  const validate = () => {
    const email = String(formData.email || '').trim();
    const phoneValue = String(formData.phone?.value || '').trim();
    if (!String(formData.firstName || '').trim()) {return 'Enter first name.';}
    if (!String(formData.lastName || '').trim()) {return 'Enter last name.';}
    if (!email) {return 'Enter your email address.';}
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return 'Enter a valid email address.';
    }
    if (phoneValue && !/^\d{10}$/.test(phoneValue)) {
      return 'Enter a valid 10 digit phone number.';
    }
    if (isVerifiedEmailFlow && !emailVerificationToken) {
      return 'Email verification expired. Please verify your email again.';
    }
    if (!formData.country) {return 'Select your country.';}
    if (!formData.state) {return 'Select your state.';}
    if (!formData.street || !formData.county || !formData.city) {
      return 'Pick an address to continue.';
    }
    if (!/^\d{5}$/.test(String(formData.pincode || ''))) {
      return 'Pick an address with a valid 5 digit ZIP code.';
    }
    if (uploadingImage) {return 'Please wait for the profile photo upload.';}
    if (resolvingAddress) {return 'Please wait for address resolution.';}
    return '';
  };

  const submitProfile = async () => {
    const validationError = validate();
    if (validationError) {
      showError(validationError);
      return;
    }

    const phoneValue = formData.phone?.value
      ? `${String(formData.phone?.code || '1').replace('+', '')}${String(
          formData.phone?.value || '',
        ).trim()}`
      : '';
    const payload = {
      firstName: String(formData.firstName || '').trim(),
      lastName: String(formData.lastName || '').trim(),
      email: String(formData.email || '').trim(),
      country: formData.country,
      state: formData.state,
      county: formData.county,
      city: formData.city,
      pincode: formData.pincode,
      profile_pic: profileImageFileName,
      ...(phoneValue ? {mobile: phoneValue} : {}),
      ...(formData.position ? {position: formData.position} : {}),
    };

    setLoading(true);
    try {
      const response = isVerifiedEmailFlow
        ? await completeVerifiedEmailProfile({
            ...payload,
            email_verification_token: emailVerificationToken,
          })
        : await completeAuthenticatedProfile(userDetails?.uuid, {
            ...payload,
            uuid: userDetails?.uuid,
          });

      const authData = extractAuthData(response);
      const profile = authData?.token
        ? await fetchAuthenticatedUserProfile(authData)
        : response?.data || response;
      const userData = await persistUserSession(profile, setUserDetails);
      navigateAfterAuth(userData);
    } catch (error) {
      showError(error?.message || 'Profile could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.page}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}>
      <Text style={styles.title}>Complete Profile</Text>
      <Text style={styles.subtitle}>
        Provide the required details to activate personalized Money Mails deals.
      </Text>

      <TouchableOpacity style={styles.photoBlock} onPress={chooseProfilePhoto}>
        {profileImageUri ? (
          <Image source={{uri: profileImageUri}} style={styles.photo} />
        ) : (
          <Text style={styles.photoPlus}>+</Text>
        )}
        <Text style={styles.photoText}>
          {uploadingImage
            ? 'Uploading...'
            : profileImageUri
              ? 'Change Photo'
              : 'Upload Photo'}
        </Text>
      </TouchableOpacity>

      <TextField
        value={formData.firstName}
        label="First Name"
        onChange={value => updateField('firstName', value)}
        returnKeyType="next"
      />
      <TextField
        value={formData.lastName}
        label="Last Name"
        onChange={value => updateField('lastName', value)}
        returnKeyType="next"
      />
      <TextField
        value={formData.email}
        label="Primary Email"
        onChange={value => updateField('email', value)}
        returnKeyType="next"
      />
      <TextField
        value={formData.phone?.value || ''}
        label="Phone Number"
        onChange={value => updateField('phone', value)}
        returnKeyType="next"
        type="phone"
      />

      <Text style={styles.sectionTitle}>Address Details</Text>
      <TextInput
        editable={false}
        style={styles.readOnlyField}
        value={DEFAULT_COUNTRY_NAME}
      />
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setStateModalOpen(true)}>
        <Text style={selectedStateName ? styles.selectorText : styles.placeholder}>
          {selectedStateName || 'Select State'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!formData.state}
        style={[styles.addressPicker, !formData.state && styles.disabledPicker]}
        onPress={() => setAddressModalOpen(true)}>
        <Text style={styles.addressPickerTitle}>Search Current Address</Text>
        <Text style={styles.addressPickerText}>
          Current ZIP cannot be changed after selection. Contact MoneyMails
          Support for changes.
        </Text>
      </TouchableOpacity>

      {formData.street ? (
        <>
          <TextInput editable={false} style={styles.readOnlyField} value={formData.street} />
          <TextInput
            editable={false}
            style={styles.readOnlyField}
            value={pickedAddress?.city || 'Selected city'}
          />
          <TextInput editable={false} style={styles.readOnlyField} value={formData.pincode} />
        </>
      ) : null}

      <Button
        btnText={loading ? 'Saving...' : 'Complete Profile'}
        disabled={loading}
        size="large"
        variant="primary"
        overridingStyles={styles.submitButton}
        onPress={submitProfile}
      />

      <Modal visible={stateModalOpen} animationType="slide">
        <View style={styles.modalPage}>
          <Text style={styles.modalTitle}>Select State</Text>
          <FlatList
            data={states}
            keyExtractor={item => item.uuid}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  updateField('state', item.uuid);
                  setStateModalOpen(false);
                }}>
                <Text style={styles.optionText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <Button
            btnText="Close"
            variant="secondary"
            overridingStyles={styles.modalButton}
            onPress={() => setStateModalOpen(false)}
          />
        </View>
      </Modal>

      <Modal visible={addressModalOpen} animationType="slide">
        <View style={styles.modalPage}>
          <Text style={styles.modalTitle}>Search Address</Text>
          <TextInput
            autoFocus
            placeholder="Search an address..."
            placeholderTextColor="#98A2B3"
            style={styles.searchInput}
            value={addressQuery}
            onChangeText={setAddressQuery}
          />
          {searchingAddress || resolvingAddress ? (
            <ActivityIndicator color="#168F79" style={styles.loader} />
          ) : null}
          <FlatList
            data={addressResults}
            keyExtractor={(item, index) =>
              String(item?.PlaceId || item?.Place?.PlaceId || index)
            }
            keyboardShouldPersistTaps="handled"
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleAddressSelect(item)}>
                <Text style={styles.optionText}>
                  {item?.Title || item?.Text || item?.Address?.Label}
                </Text>
              </TouchableOpacity>
            )}
          />
          <Button
            btnText="Close"
            variant="secondary"
            overridingStyles={styles.modalButton}
            onPress={() => setAddressModalOpen(false)}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  title: {
    color: '#17212B',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
  },
  subtitle: {
    color: '#5E6C7A',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
    marginTop: 8,
  },
  photoBlock: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#D0D5DD',
    borderRadius: 16,
    borderWidth: 1,
    height: 142,
    justifyContent: 'center',
    marginBottom: 12,
    width: 142,
  },
  photo: {
    borderRadius: 12,
    height: 96,
    width: 96,
  },
  photoPlus: {
    color: '#168F79',
    fontSize: 42,
    fontWeight: '600',
  },
  photoText: {
    color: '#168F79',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  sectionTitle: {
    color: '#17212B',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 24,
  },
  readOnlyField: {
    backgroundColor: '#F2F4F7',
    borderColor: '#D0D5DD',
    borderRadius: 8,
    borderWidth: 1,
    color: '#17212B',
    fontSize: 15,
    marginBottom: 12,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  selector: {
    borderColor: '#D0D5DD',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  selectorText: {
    color: '#17212B',
    fontSize: 15,
  },
  placeholder: {
    color: '#98A2B3',
    fontSize: 15,
  },
  addressPicker: {
    alignItems: 'center',
    backgroundColor: '#F7FAFF',
    borderColor: '#168F79',
    borderRadius: 14,
    borderStyle: 'dashed',
    borderWidth: 1.5,
    marginBottom: 12,
    padding: 16,
  },
  disabledPicker: {
    backgroundColor: '#F8F9FB',
    borderColor: '#D0D5DD',
  },
  addressPickerTitle: {
    color: '#168F79',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  addressPickerText: {
    color: '#667085',
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 22,
    width: '100%',
  },
  modalPage: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    padding: 20,
    paddingTop: 56,
  },
  modalTitle: {
    color: '#17212B',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  searchInput: {
    borderColor: '#D0D5DD',
    borderRadius: 8,
    borderWidth: 1,
    color: '#17212B',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  loader: {
    marginTop: 12,
  },
  option: {
    borderBottomColor: '#EAECF0',
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  optionText: {
    color: '#17212B',
    fontSize: 15,
  },
  modalButton: {
    marginTop: 16,
  },
});

export default CompleteInfo;
