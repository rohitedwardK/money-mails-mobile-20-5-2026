import React, { useContext, useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { UserContext } from '../../../context/UserContext';
import { useNotification } from '../../../hooks/services/useNotification';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/AntDesign';

const renderItem = ({ item, navigation }) => {
    let navigateRoute = "Notification";
    let param = {}
    if(item.item.mlink){
        param = {
            brand_uuid : item.item.mlink.brand_uuid,
            category_uuid : item.item.mlink.category_uuid,
            sub_category_uuid : item.item.mlink.sub_category_uuid,
            mail_uuid : item.item.mlink.mail_uuid,
        }
        if(item.item.mlink.page == 'home') navigateRoute = 'Home';
        if(item.item.mlink.page == 'redeem_history') navigateRoute = 'PointRedeemHistory'
    }
    return (
        <TouchableOpacity onPress={() => navigation.navigate(navigateRoute, param)}>
            <View style={styles.card}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <View style={{
                            width: 50,
                            height: 50,
                            backgroundColor: "#13A997",
                            borderRadius: 25,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <AntIcon name="bells" color={'#fff'} size={30} />
                        </View>
                    </View>
                    <View style={{ flex: 3 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#09A57D' }}>{item.item.title}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{color : '#454545'}}>{item.item.message}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const Notification = () => {
    const navigation = useNavigation();
    const { userDetails } = useContext(UserContext);
    const { setNotificationPayload, data, setPege } = useNotification();
    const [page, setPage] = useState(0);
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){
            setPage(0)
        }
        setPege(page);
        setNotificationPayload({ user_uuid: userDetails?.uuid, page: page, key: Math.random(5) });
    }, [page,isFocused]);

     useEffect(() => {
            const backAction = () => {
                navigation.navigate('Home');
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
        {data.length > 0&&<FlatList
            data={data}
            renderItem={(item) => renderItem({ item, navigation })}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => {
                setPage((prevPage) => prevPage + 1);
                
            }}
            onEndReachedThreshold={0.1}
        />}
        {data.length === 0&&<View style={{alignItems:'center',flex:1,justifyContent:'center'}}>
            <Text>Empty</Text>
            </View>}
        </>
        
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        padding: 20,
        borderWidth: 2,
        borderColor: '#13A997',
        borderRadius: 25
    }
});

export default Notification;
