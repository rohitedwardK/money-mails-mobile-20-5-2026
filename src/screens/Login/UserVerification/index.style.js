import { StyleSheet } from 'react-native';
import getColors from '../../../utils/colors';

export const styles = ({ screenHeight, isIos }) => {
  const { themeColors: colors } = getColors();

  return StyleSheet.create({
    pageContainer: {
      display: 'flex',
      backgroundColor: colors.bgPrimary,
      height: '100%',
      paddingHorizontal: 25,
      paddingTop: screenHeight * (isIos ? 0.07 : 0.05),
      position: 'relative',
      width: '100%',
    },
    otpFieldsWrapper: {
      display: "flex",
      gap: 12,
    },
    otpField: {
      width: 30,
      height: 30,
      border: 0,
      outline: `1px solid #ccc`,
      borderRadius: 5,
      textAlign: "center",
      fontSize: 20,
      "&:focus": {
        // outline: `2px solid ${themeColors?.accent}`,
      },
      "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        "-moz-appearance": "none",
        appearance: "none",
        margin: 0,
      },
    },
    codeFieldRoot: { marginTop: 20 },
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderWidth: 2,
      borderColor: '#00000030',
      textAlign: 'center',
      borderRadius: 8,
      color: '#222'
    },
    focusCell: {
      borderColor: '#000',
    },
    backButton: {
      width: 70,
      marginLeft: -15,
    },
    header: {
      marginTop: 70,
      marginBottom: 35,
    },
    pageTitle: {
      color: colors.fontPrimary,
      fontSize: 24,
      textAlign:'center',
      fontWeight: '600',
    },
    subTitle: {
      fontSize: 20,
      textAlign:'center',
      color: '#707070',
      marginTop: 8,
    },
    termcondition: {
      fontSize: 12,
      textAlign:'center',
      color: '#707070',
      marginTop: 28,
    },
    termconditionLink :{ 
      fontSize: 12,
      textAlign:'center',
      color: 'rgb(0, 173, 239)',
      marginTop: 28,
    },
    sendBtn: {
      height: 48,
      marginTop: 40,
    },
    sendBtnText: {
      fontSize: 13,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      width:340,
      height:700,
      margin: 0,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 5,
      alignItems: 'center',
      shadowOpacity: 0,
      elevation: 0,
    },
    modalContents:{
      borord: 1,
      borderColor:'black',
      borderRadius:20,
      padding:5
    },
    heading:{
        color:'black',
        fontSize: 18,
        fontWeight:'bold',
        textAlign:'center'
    },
    subHeading:{
      color:'black',
      fontSize: 16,
    },
    button: {
      borderRadius: 15,
      padding: 10,
      // elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      marginTop:10,
      width:200,
      backgroundColor: '#008080',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      color:'black',
      textAlign: 'justify',
    },
  });
};
