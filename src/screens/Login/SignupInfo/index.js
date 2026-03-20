import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Dimensions } from "react-native";

const SignUpInfo = ({ navigation }) => {

    const handlePrivacyLinkPress = async() => {
        const url = 'https://app.money-mails.com/privacy';
        await Linking.openURL(url);
      };


    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.textHead}>Welcome To Moneymails!</Text>
            </View>
            <Text style={styles.textHead2}>Why we collect Your Information</Text>
            <Text style={{padding:10, color:'black'}}>Welcome to MoneyMails! we're committed to Offering you personalized deals and rewards tailored to your preferences. To achieve this, we collect certain details during registration and in your profile:</Text>
            <View style={{flexDirection:'row',paddingLeft:30, width : Dimensions.get('window').width - 20}}>
                 <View style={styles.litstPoint}></View>
                 <View ><Text style={{color : 'black'}}><Text style={{fontWeight:'bold',color:'black'}}><>Basic Information</></Text>(Name, Phone, Email): Essential for account creation, login, and communication.</Text></View>
            </View>
            <View style={{flexDirection:'row',paddingLeft:30,marginTop:10, width : Dimensions.get('window').width - 20}}>
                 <View style={styles.litstPoint}></View>
                 <View ><Text style={{color : 'black'}}><Text style={{fontWeight:'bold'}}><>Date Of Birth :</></Text>Helps us send-appropriate deals and Offers.</Text></View>
            </View>
            <View style={{flexDirection:'row',paddingLeft:30,marginTop:10, width : Dimensions.get('window').width - 20}}>
                 <View style={styles.litstPoint}></View>
                 <View ><Text style={{color : 'black'}}><Text style={{fontWeight:'bold'}}><>Race/Ethnicity, Gender, Religion, Language:</></Text>Enables us to deliver deals and Offers that match your interests and preferences.</Text></View>
            </View>
            <View style={{flexDirection:'row',paddingLeft:30,marginTop:10, width : Dimensions.get('window').width  - 20}}>
                 <View style={styles.litstPoint}></View>
                 <View ><Text style={{color : 'black'}}><Text style={{fontWeight:'bold'}}><>Address Details:</></Text>Verifies your identity and helps us deliver localized and region-specific offers.</Text></View>
            </View>
            <View style={{flexDirection:'row',paddingLeft:30,marginTop:10, width : Dimensions.get('window').width  - 20}}>
                 <View style={styles.litstPoint}></View>
                 <View ><Text style={{color : 'black'}}><Text style={{fontWeight:'bold'}}><>Interests :</></Text>Helps us curate offers based on what you love.</Text></View>
            </View>
            <View style={{flexDirection:'row',paddingLeft:30,marginTop:10, width : Dimensions.get('window').width  - 20}}>
                 <View style={styles.litstPoint}></View>
                 <View ><Text style={{color : 'black'}}><Text style={{fontWeight:'bold'}}><>Verification Information(Zelle ID, ID Proof) :</></Text>Ensures that rewards are redeemed securely and uniquely for each user.</Text></View>
            </View>

            <Text style={{padding:10, color : "black"}}>We take our <Text style={styles.link} onPress={handlePrivacyLinkPress}>privacy</Text> seriously. All data is stored securely and used only to enhance your experience with MoneyMails. Providing this information is Optional, but completing your profile allows us to serve you better!</Text>
            <View style={{marginTop:20, margin:20}}>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('SignUp')
                }}>
                    <View style={{backgroundColor:'#45b39d', alignItems:'center',}}>
                        <Text style={{padding:10, color:'white'}}>Continue</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, 
        paddingTop: 10,
        backgroundColor: '#f8f9f9',
    },
    textHead2 : {
        color : 'black',
        fontSize : 18,
        fontWeight:'800',
        padding:10
    },
    textHead : {
        color : 'black',
        fontSize : 22,
        fontWeight : 'bold',
        padding:10
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%', 
    },
    litstPoint : {
        width:4,
        height:4,
        marginRight : 10,
        marginTop: 6,
        backgroundColor : 'black',
        borderRadius : 50
    },
    link: {
        color: '#007BFF',
        textDecorationLine: 'underline',
      }
});

export default SignUpInfo;
