import React,{useContext} from 'react'; 
import {Text, View, StyleSheet,Image} from 'react-native';
import Button from '../../components/atoms/Button';
import {DeviceContext} from '../../context/DeviceContext'

const Instruction = ({navigation})=>{
    const {screenWidth} = useContext(DeviceContext);
    return (
        <View style={styles.container}>
            
            <Image
             style={styles.img}
             source={require('../../assets/images/instruc.png')} />
            <Text style={styles.heading}>Instructions</Text>
            <View style={styles.instructionContainer}>
                <Text style={styles.subHeading}>Follow these steps to verify and log in:</Text>
                <Text style={styles.normalText}>1. Expect to receive a verification code at your registered address shortly. Please be patient while waiting for the verification code to arrive.</Text>
                <Text style={styles.normalText}>2. Once you've received the verification code, proceed to log in using your credentials.</Text>
                <Text style={styles.normalText}>3. After successfully logging in, you will need to complete the verification process using the received code.</Text>
                <Text style={styles.normalText}>4. In case you do not receive the code, please reach out to the administrator for assistance.</Text>
            </View>
            <Button
            btnText="Back"
            size="large"
            onPress={()=>{
                navigation.navigate('SignIn')
            }}
            overridingStyles={{
                marginTop: 10,
                width: screenWidth - 70,
                marginBottom: 10,
                height: 50,
            }}
            btnTextOverrideStyles={styles.signUpBtnText}
          />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex:1,
        alignItems : 'center',
        justifyContent: 'center'
    },
    heading : {
        color : 'black',
        fontSize:24,
        fontWeight:'bold',
        marginTop:20
    },
    subHeading:{
        color:'black',
        fontSize:18,
        fontWeight:'bold',
        marginTop:10,
        marginBottom:10
    },
    instructionContainer :{
        margin:15
    },
    normalText :{
        color:'black',
        marginBottom:5
    },
    img : {
        width:100,
        height:100
    },
    
      signUpBtnText: {
        fontSize: 14,
      },
})

export default Instruction;

