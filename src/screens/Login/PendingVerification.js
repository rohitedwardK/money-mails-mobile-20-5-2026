import React,{useContext} from 'react'; 
import {Text, View, StyleSheet,Image} from 'react-native';
import Button from '../../components/atoms/Button';
import {DeviceContext} from '../../context/DeviceContext'

const PendingVerification = ({navigation})=>{
    const {screenWidth} = useContext(DeviceContext);
    return (
        <View style={styles.container}>
            
            <Image
             source={require('../../assets/images/brand.png')} />
            <Text style={styles.heading}>Pending Verification</Text>
            <Image
             style={styles.img}
             source={require('../../assets/images/openenvelop.png')} />
            <View style={styles.instructionContainer}>
                <Text style={styles.subHeading}>You will receive verification code shortly. kindly wait for some time to get verfication code. if You dont receive code contact Admin !</Text>
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
        marginBottom:10,
        textAlign:'center'
    },
    instructionContainer :{
        margin:15
    },
    normalText :{
        color:'black',
        marginBottom:5
    },
    img : {
        width:250,
        height:250
    },
    
      signUpBtnText: {
        fontSize: 14,
      },
})

export default PendingVerification;

