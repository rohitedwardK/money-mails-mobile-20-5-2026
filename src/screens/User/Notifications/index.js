import React, { useContext, useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { UserContext } from '../../../context/UserContext';
import { useNotification } from '../../../hooks/services/useNotification';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import getColors from '../../../utils/colors';

const renderItem = ({ item, navigation, styles, colors }) => {
    let navigateRoute = 'Notification';
    let param = {};
    if(item.item.mlink){
        param = {
            brand_uuid : item.item.mlink.brand_uuid,
            category_uuid : item.item.mlink.category_uuid,
            sub_category_uuid : item.item.mlink.sub_category_uuid,
            mail_uuid : item.item.mlink.mail_uuid,
        };
        if(item.item.mlink.page == 'home') {navigateRoute = 'Home';}
        if(item.item.mlink.page == 'redeem_history') {navigateRoute = 'PointRedeemHistory';}
    }
    return (
        <TouchableOpacity activeOpacity={0.84} onPress={() => navigation.navigate(navigateRoute, param)}>
            <View style={styles.card}>
                <View style={styles.cardRow}>
                    <View style={styles.iconWrap}>
                        <AntIcon name="bells" color={colors.white} size={24} />
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.titleRow}>
                            <Text style={styles.title} numberOfLines={1}>{item.item.title}</Text>
                        </View>
                        <Text style={styles.message} numberOfLines={2}>{item.item.message}</Text>
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
    const {themeColors: colors} = getColors();
    const styles = getStyles(colors);

    useEffect(() => {
        if(isFocused){
            setPage(0);
        }
        setPege(page);
        setNotificationPayload({ user_uuid: userDetails?.uuid, page: page, key: Math.random(5) });
    }, [page, isFocused, setNotificationPayload, setPege, userDetails?.uuid]);

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
        <View style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Updates, rewards, and mail activity.</Text>
        </View>
        {data.length > 0 && <FlatList
            contentContainerStyle={styles.listContent}
            data={data}
            renderItem={(item) => renderItem({ item, navigation, styles, colors })}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => {
                setPage((prevPage) => prevPage + 1);

            }}
            onEndReachedThreshold={0.1}
        />}
        {data.length === 0 && <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>New alerts will show up here.</Text>
            </View>}
        </View>

    );
};

const getStyles = colors => StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 16,
        paddingTop: 18,
    },
    header: {
        backgroundColor: colors.surfacePrimary,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 12,
        shadowOpacity: 0,
        elevation: 0,
    },
    headerTitle: {
        color: colors.fontPrimary,
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '900',
    },
    headerSubtitle: {
        color: colors.fontSecondary,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        marginTop: 4,
    },
    listContent: {
        paddingBottom: 110,
    },
    card: {
        marginBottom: 12,
        padding: 14,
        backgroundColor: colors.surfacePrimary,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        borderRadius: 18,
        shadowOpacity: 0,
        elevation: 0,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrap: {
        width: 46,
        height: 46,
        backgroundColor: colors.highlightPrimary,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        flex: 1,
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '900',
        color: colors.fontPrimary,
    },
    message: {
        color: colors.fontSecondary,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        marginTop: 4,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    emptyTitle: {
        color: colors.fontPrimary,
        fontSize: 18,
        lineHeight: 24,
        fontWeight: '900',
    },
    emptyText: {
        color: colors.fontSecondary,
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '600',
        marginTop: 6,
        textAlign: 'center',
    },
});

export default Notification;
