import React, {useState, useRef, useEffect, useContext} from 'react';
import {Text, TextInput as RNTextInput, View, Pressable} from 'react-native';
import CountryPicker from 'rn-country-picker';
import {TextInput} from 'react-native-paper';
import getColors from '../../../utils/colors';


import {textFieldStyles} from './index.style';
import {DeviceContext} from '../../../context/DeviceContext';

const TextField = props => {
  const {
    label,
    type = 'text',
    value = '',
    style,
    onBlur,
    onFocus,
    onChange,
    isOutLined,
    ...restOfProps
  } = props;
  const {isAndroid} = useContext(DeviceContext);
  const [isFocused, setIsFocused] = useState(false);
  const [isPickerModelOpen, setIsPickerModelOpen] = useState(false);
  const [countryCode, setCountryCode] = useState('1');

  const {textInputColors} = getColors();

  const inputRef = useRef(null);

  const styles = textFieldStyles({
    isFocused,
    isFilled: value.length,
    isOutLined,
  });

  const commonProps = {
    style: [
      styles.textFieldContainer,
      isAndroid
        ? {
            top: 16,
          }
        : {},
    ],
    label: (
      // <View style={isOutLined ? styles.labelContainer : {}}>
      <Text style={styles.label}>{label}</Text>
      // </View>
    ),
    underlineColor: textInputColors.defaultBorder,
    activeUnderlineColor: textInputColors.focussedBorder,
    outlineColor: textInputColors.defaultBorder,
    activeOutlineColor: textInputColors.focussedBorder,
    mode: isOutLined ? 'outlined' : 'flat',
    value,
    onBlur: event => {
      setIsFocused(false);
      onBlur?.(event);
    },
    onFocus: event => {
      event.stopPropagation();
      setIsFocused(true);
      onFocus?.(event);
    },
    onChangeText: text => {
      onChange(
        type === 'phone' ? {
          code: countryCode,
          value: text,
        } : text);
    },
  };

  const handlePickerModalToggle = isOpen => {
    setIsPickerModelOpen(isOpen);
    if (!isOpen) {
      setTimeout(() => setIsFocused(true), 100);
    }
  };

  if (type === 'phone') {
    return (
      <TextInput
        autoComplete="tel"
        keyboardType="number-pad"
        maxLength={10}
        textContentType="telephoneNumber"
        render={props =>
          isFocused || value.length || isPickerModelOpen ? (
            <View style={styles.phoneField.container}>
              <CountryPicker
                disable={true}
                animationType={'slide'}
                language="en"
                searchBarStyle={styles.phoneField.pickerDrawerSearchField}
                dropDownImage=" "
                onPickerToggle={handlePickerModalToggle}
                searchBarContainerStyle={
                  styles.phoneField.pickerSearchBarContainer
                }
                countryNameTextStyle={styles.phoneField.countryNameInPickerList}
                countryFlagStyle={[styles.phoneField.flag]}
                dropDownIconStyle={{display : 'none'}}
                pickerTitle={'Country Picker'}
                hideCountryFlag={false}
                hideCountryCode={false}
                countryCode={countryCode}
                countryId={231}
                selectedValue={setCountryCode}
                pickerContainerStyle={{ width : 80, height : 50, marginLeft : 0, marginBottom : -15, marginRight : 0, borderColor : 'transparent'}}
                searchBarPlaceHolder="Search with code or country name"
              />
              <RNTextInput
                {...props}
                ref={inputRef}
                style={[
                  commonProps.style,
                  isOutLined && (isFocused || value.length)
                    ? {
                        paddingHorizontal: 0,
                        marginHorizontal: -8,
                      }
                    : {},
                ]}
                autoFocus
              />
            </View>
          ) : (
            <RNTextInput {...props} />
          )
        }
        {...restOfProps}
        {...commonProps}
      />
    );
  } else if (type === 'password') {
    return (
      <TextInput
        render={props => (
          <RNTextInput
            {...props}
            style={[
              styles.passwordDot,
              isAndroid
                ? {
                    bottom: -8,
                    left: -4,
                  }
                : {},
            ]}
            ref={inputRef}
          />
        )}
        {...restOfProps}
        {...commonProps}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
      />
    );
  }

  return <TextInput {...restOfProps} {...commonProps} ref={inputRef} />;
};

export default TextField;
