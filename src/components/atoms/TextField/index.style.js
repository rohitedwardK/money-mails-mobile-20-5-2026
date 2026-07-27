import {StyleSheet} from 'react-native';
import getColors from '../../../utils/colors';

export const textFieldStyles = ({isFocused, isFilled, isOutLined}) => {
  const {themeColors: colors, textInputColors} = getColors();

  let labelColor =
    isFilled || isFocused
      ? textInputColors.focussedLabel
      : textInputColors.defaultLabel;

  return StyleSheet.create({
    textFieldContainer: {
      backgroundColor: isOutLined ? colors.surfacePrimary : 'transparent',
      left: 0,
      display: 'flex',
      paddingHorizontal: isOutLined && (isFocused || isFilled) ? 14 : 0,
      fontSize: 16,
      position: 'relative',
      color: textInputColors.value,
      width: '100%',
      borderRadius: isOutLined ? 14 : 0,
    },
    phoneField: {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        position: 'relative',
        bottom: isOutLined ? 16 : 8,
      },
      flag: {
        width: 20,
        height: 14,
        // marginRight: 15,
      },
      pickerDrawerSearchField: {
        borderWidth: 1,
        borderColor: textInputColors.password,
        paddingHorizontal: 16,
        paddingRight: 32,
        height: 32,
        fontSize: 14,
        borderRadius: 80,
      },
      pickerSearchBarContainer: {
        paddingRight: 16,
        position: 'relative',
      },
      countryNameInPickerList: {
        paddingLeft: 16,
      },
    },
    label: {
      color: labelColor,
      ...(isOutLined
        ? {
            backgroundColor:
              isFocused || isFilled ? colors.surfacePrimary : 'transparent',
            paddingVertical: isFocused || isFilled ? 6 : 0,
            paddingHorizontal: isFocused || isFilled ? 6 : 0,
          }
        : {}),
    },
    labelContainer: {
      backgroundColor: isFocused || isFilled ? colors.bgPrimary : 'transparent',
      paddingLeft: 16,
      paddingVertical: isFocused || isFilled ? 6 : 0,
      width: '100%',
    },
    passwordDot: {
      letterSpacing: 6,
      fontSize: 16,
      color: textInputColors.password,
      bottom: 8,
      position: 'absolute',
      left: 0,
      width: '100%',
    },
  });
};
