import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Text} from 'react-native';
import {converToWordCase} from '../../../utils';
import {buttonStyles} from './index.style';

const Button = props => {
  const {
    variant,
    type,
    btnText = '',
    linkpreText,
    endIcon,
    startIcon,
    justifyIconSpace,
    overridingStyles,
    fontStrong,
    size,
    btnTextOverrideStyles,
    ...rest
  } = props;

  const styles = buttonStyles({
    justifyIconSpace,
    fontStrong,
    size,
  });

  const buttonVariantStyles = styles[variant];

  const linkVariantStyles = styles[`link${converToWordCase(variant)}`];

  const preTextVariantStyles =
    styles[`linkPretext${converToWordCase(variant)}`];

  const buttonTextVariantStyles = styles[`text${converToWordCase(variant)}`];

  switch (type) {
    case 'link':
      if (linkpreText) {
        return (
          <TouchableOpacity
            style={{
              ...styles.default,
              ...(variant === 'secondary' ? buttonVariantStyles : {}),
              ...overridingStyles,
            }}
            {...rest}>
            <Text
              style={[
                preTextVariantStyles,
                btnTextOverrideStyles,
              ]}>{`${linkpreText} `}</Text>
            <Text style={linkVariantStyles}>{btnText}</Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity style={styles.default} {...rest}>
          {startIcon}
          <Text style={linkVariantStyles}>{btnText}</Text>
          {endIcon}
        </TouchableOpacity>
      );
    case 'text':
      return (
        <TouchableOpacity
          style={{...styles.default, ...overridingStyles}}
          {...rest}>
          {startIcon}
          {btnText && (
            <Text style={[buttonTextVariantStyles, btnTextOverrideStyles]}>
              {btnText}
            </Text>
          )}
          {endIcon}
        </TouchableOpacity>
      );
    default:
      return (
        <TouchableOpacity
          style={{
            ...styles.default,
            ...buttonVariantStyles,
            ...overridingStyles,
          }}
          {...rest}>
          {startIcon}
          {btnText && (
            <Text style={[buttonTextVariantStyles, btnTextOverrideStyles]}>
              {btnText}
            </Text>
          )}
          {endIcon}
        </TouchableOpacity>
      );
  }
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']),
  type: PropTypes.oneOf(['default', 'link', 'text']),
  btnText: PropTypes.string.isRequired,
  linkpreText: PropTypes.string,
  endIcon: PropTypes.node,
  startIcon: PropTypes.node,
  justifyIconSpace: PropTypes.oneOf(['center', 'space-between']),
  overridingStyles: PropTypes.object,
  fontStrong: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

Button.defaultProps = {
  variant: 'primary',
  type: 'default',
  overridingStyles: {},
  size: 'medium',
};

export default Button;
