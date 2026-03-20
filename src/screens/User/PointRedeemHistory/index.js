import React, {useContext, useState,useEffect} from 'react';
import {Text, View, ScrollView, StyleSheet, FlatList, BackHandler} from 'react-native';
import {UserContext} from '../../../context/UserContext';
import {usePointRedeemHistory} from '../../../hooks/services/usePointRedeemHistory';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';

// Render item component for FlatList
const renderItem = ({ item }) => {
    return (
        <View style={styles.card}>
        <Text style={{marginBottom:5, color : '#222'}}>Date         : {moment(item.createdAt).format('YYYY-MM-DD')}</Text>
        <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            marginBottom:5
            }}>
            <Text style={{color : '#222'}}>Points      : {item.point}</Text>
            <Text style={{color : '#222'}}>Status : {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
        </View>
        <Text style={{color : '#222'}}>Message : {item.comment}</Text>
        </View>
    );
  };

const PointRedeemHistory = ({ navigation }) => {
   
    const {userDetails} = useContext(UserContext);
    const {setRedeemPayload, data} = usePointRedeemHistory();
    const [page, setPage] = useState(0);
    const isFocused = useIsFocused();


    useEffect(() => {
        setRedeemPayload({user_uuid:userDetails?.uuid,page:page,key:Math.random(5)});
      }, [page,isFocused]);

      useEffect(() => {
        const backAction = () => {
          navigation.navigate('User', {
            screen: 'Rewards',
          });
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
        return () => {
          backHandler.remove();
        };
      }, [navigation]);

  return (
        <>
        {data.length > 0 &&
          <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item,index) => index.toString()}
          onEndReached={() => {
              // Load more data when reaching the end of the list
              setPage((prevPage) => prevPage + 1);
          }}
          onEndReachedThreshold={0.1}
          />
        }
        {data.length === 0&&<View style={{alignItems:'center',flex:1,justifyContent:'center'}}>
            <Text>Empty</Text>
            </View>}
        </>
  );
};

const styles = StyleSheet.create({
    card : {
        margin : 10,
        padding : 20,
        borderWidth:2,
        borderColor : '#13A997',
        borderRadius : 25
    }
})

export default PointRedeemHistory;
