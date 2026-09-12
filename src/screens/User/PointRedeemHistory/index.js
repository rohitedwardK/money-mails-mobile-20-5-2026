import React, {useContext, useState,useEffect} from 'react';
import {Text, View, ScrollView, StyleSheet, FlatList, BackHandler} from 'react-native';
import {UserContext} from '../../../context/UserContext';
import {usePointRedeemHistory} from '../../../hooks/services/usePointRedeemHistory';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import getColors from '../../../utils/colors';

// Render item component for FlatList
const renderItem = ({item, styles}) => {
    const status = item.status
      ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
      : 'Pending';

    return (
        <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View>
                <Text style={styles.cardEyebrow}>Redeem Request</Text>
                <Text style={styles.cardDate}>{moment(item.createdAt).format('MMM DD, YYYY')}</Text>
            </View>
            <View style={styles.statusPill}>
                <Text style={styles.statusText}>{status}</Text>
            </View>
        </View>
        <View style={styles.metaRow}>
            <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Points</Text>
                <Text style={styles.metaValue}>{item.point || 0}</Text>
            </View>
            <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Message</Text>
                <Text style={styles.metaValue} numberOfLines={2}>{item.comment || 'No message'}</Text>
            </View>
        </View>
        </View>
    );
  };

const PointRedeemHistory = ({ navigation }) => {

    const {userDetails} = useContext(UserContext);
    const {setRedeemPayload, data} = usePointRedeemHistory();
    const [page, setPage] = useState(0);
    const isFocused = useIsFocused();
    const {themeColors: colors} = getColors();
    const styles = getStyles(colors);


    useEffect(() => {
        setRedeemPayload({user_uuid:userDetails?.uuid,page:page,key:Math.random(5)});
      }, [page, isFocused, setRedeemPayload, userDetails?.uuid]);

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
        <View style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.title}>Redeem History</Text>
            <Text style={styles.subtitle}>Track your point redemption requests.</Text>
        </View>
        {data.length > 0 &&
          <FlatList
          contentContainerStyle={styles.listContent}
          data={data}
          renderItem={item => renderItem({...item, styles})}
          keyExtractor={(item,index) => index.toString()}
          onEndReached={() => {
              // Load more data when reaching the end of the list
              setPage((prevPage) => prevPage + 1);
          }}
          onEndReachedThreshold={0.1}
          />
        }
        {data.length === 0 && <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptyText}>Your redeemed points will appear here.</Text>
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
    title: {
        color: colors.fontPrimary,
        fontSize: 20,
        lineHeight: 25,
        fontWeight: '900',
    },
    subtitle: {
        color: colors.fontSecondary,
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        marginTop: 4,
    },
    listContent: {
        paddingBottom: 110,
    },
    card : {
        marginBottom: 12,
        padding: 16,
        backgroundColor: colors.surfacePrimary,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        borderRadius: 18,
        shadowOpacity: 0,
        elevation: 0,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    cardEyebrow: {
        color: colors.highlightPrimary,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '800',
    },
    cardDate: {
        color: colors.fontPrimary,
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '800',
        marginTop: 2,
    },
    statusPill: {
        backgroundColor: colors.brandSoft,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    statusText: {
        color: colors.highlightPrimary,
        fontSize: 11,
        lineHeight: 14,
        fontWeight: '900',
    },
    metaRow: {
        flexDirection: 'row',
        gap: 10,
    },
    metaItem: {
        flex: 1,
        backgroundColor: colors.surfaceSecondary,
        borderRadius: 14,
        padding: 12,
    },
    metaLabel: {
        color: colors.fontMuted,
        fontSize: 11,
        lineHeight: 14,
        fontWeight: '700',
        marginBottom: 5,
    },
    metaValue: {
        color: colors.fontPrimary,
        fontSize: 14,
        lineHeight: 18,
        fontWeight: '800',
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

export default PointRedeemHistory;
