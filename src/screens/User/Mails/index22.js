import React from 'react';
import {Text, View,StyleSheet} from 'react-native';


const Mails = ()=>{
    return (
        <View style={styles.container}>
            <Text>Mail</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex :1,
        alignItems : 'center',
        textAlign: 'center',

    },
});


export default Mails;
