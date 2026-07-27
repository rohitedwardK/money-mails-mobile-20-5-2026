import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  Alert,
  Platform,
  FlatList,
  Pressable,
  StyleSheet,
  BackHandler,
} from 'react-native';
import Button from '../../../components/atoms/Button';
import Avatar from '../../../components/atoms/Avatar';
import { rewardsScreenStyles } from './index.style';
import OfferCard from '../../../components/organisms/OfferCard';
import TabView from '../../../components/organisms/TabView';
import getColors from '../../../utils/colors';
import ProgressBar from '../../../components/atoms/ProgressBar';
import { UserContext } from '../../../context/UserContext';
import { useCategory } from '../../../hooks/services/useCategory';
import { useReward } from '../../../hooks/services/useReward';
import { usePointRedeem } from '../../../hooks/services/usePointRedeem';
import { useFavourites } from '../../../hooks/services/useFavourites';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { baseUrl } from '../../../connections';

const Rewards = () => {
  const [pageNum, setPageNum] = useState(0);
  const pageSize = 10;
  const filterValue = '';
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const styles = rewardsScreenStyles();
  const { userDetails } = useContext(UserContext);
  const {
    categoryList = [],
    catDetails,
    setCatPayload,
    SetPege,
    setCatDetailsPayload,
  } = useCategory();
  const { setUpdateMailFav } = useFavourites();
  const { rewards, setPayload } = useReward();
  const [selCategory, setSelectCategory] = useState('');
  const [category, setCategory] = useState(null);
  const { setRedeemPayload, data, setRedeemPayloads, datas } = usePointRedeem();
  const [modalVisible, setModalVisible] = useState(false);
  const [pointRedeemData, setPointRedeemData] = useState({ point: 0, available: 0 })
  const [modalVisibles, setModalVisibles] = useState(false);
  const [redeemsuccessMessage, setRedeemsuccessMessage] = useState("");
  const [userPoints, setUserPoints] = useState(0);

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

  const {themeColors} = getColors();

  useEffect(() => {
    setCatPayload('search=');
  }, [setCatPayload]);

  useEffect(() => {
    setPayload(`${userDetails?.uuid}`);
  }, [setPayload, userDetails?.uuid]);

  const onCategoryHandle = useCallback((item) => {
    if (!item?.uuid || !userDetails?.uuid) return;

    SetPege(0);
    setPageNum(0);
    setCategory(item);
    setSelectCategory(item.name);
    setCatDetailsPayload(
      `user_uuid=${userDetails?.uuid}&category_uuid=${item?.uuid}&page=0&limit=${pageSize}`,
    );
  }, [SetPege, pageSize, setCatDetailsPayload, userDetails?.uuid]);

  useEffect(() => {
    if (!categoryList?.length || category?.uuid || !userDetails?.uuid) return;
    onCategoryHandle(categoryList[0]);
  }, [category?.uuid, categoryList, onCategoryHandle, userDetails?.uuid]);

  const rewardsData = useCallback(() => {
    if (!userDetails?.uuid) return;
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-auth-token", userDetails?.token);
    const requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };

    fetch(`${baseUrl}/user/point/${userDetails.uuid}`, requestOptions)
      .then(async (response) => {
        const res = await response.text();
        if (response.status !== 200) {
          throw res;
        }
        return JSON.parse(res);
      })
      .then((result) => {
        setUserPoints(result?.data?.point);
      })
      .catch((err) => {
        console.log(err)
      });
  }, [userDetails?.token, userDetails?.uuid]);

  useEffect(() => {
    if (isFocused) {
      rewardsData();
    }
  }, [isFocused, pageNum, rewardsData]);

  const onFavouriteMailToggle = mail_uuid => {
    setUpdateMailFav({
      user_uuid: userDetails?.uuid,
      mail_uuid: mail_uuid,
    });
    setTimeout(() => {
      onCategoryHandle(category);
    }, 1000);
  };

  const rewardTabs = useMemo(
    () => categoryList?.map(item => ({
      ...item,
      mails_count: item?.mails_count || 0,
    })) || [],
    [categoryList],
  );

  const filteredRewards = useMemo(() => {
    if (!catDetails) return [];
    if (!filterValue) return catDetails;

    return catDetails.filter(item => {
      return item?.brand?.some(val =>
        val.company_name.toLowerCase().startsWith(filterValue?.toLowerCase()),
      );
    });
  }, [catDetails, filterValue]);


  const redeemCheck = () => {
    setRedeemPayload({ user_uuid: userDetails?.uuid, point: rewards?.point });
    setPayload(`${userDetails?.uuid}`);
  };
  useEffect(() => {
    if (data != null) {
      setModalVisible(true);
      setPointRedeemData({ point: data?.redeemed_point, available: data?.available_point })
    }
  }, [data])

  const redeemed = () => {
    setRedeemPayloads({ user_uuid: userDetails?.uuid, point: rewards?.point });
    setPayload(`${userDetails?.uuid}`);
    rewardsData();
  };

  useEffect(() => {
    if (datas != null) {
      setModalVisible(false);
      setModalVisibles(true);
      setRedeemsuccessMessage(datas?.message)
    }
  }, [datas])

  return (
    <ScrollView style={styles.pageContainer} scrollToOverflowEnabled={true}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styless.centeredView}>
          <View style={styless.modalView}>
            <Text style={styless.modalText}>Redeem Point : {pointRedeemData?.point}</Text>
            <Text style={styless.modalText}>Available Point : {pointRedeemData?.available}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <Pressable
                style={[styless.button, styless.btnCancel]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styless.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styless.button, styless.btnOk]}
                onPress={redeemed}>
                <Text style={styless.textStyle}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibles}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisibles(!modalVisibles);
        }}>
        <View style={styless.centeredView}>
          <View style={styless.modalView}>
            <Text style={styless.modalText}> {redeemsuccessMessage}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              <Pressable
                style={[styless.button, styless.btnOk]}
                onPress={() => { rewardsData(); setModalVisibles(!modalVisibles) }}>
                <Text style={styless.textStyle}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.header}>
        <View style={styles.headerSummary}>
          <Avatar
            size={64}
            rounded
            src={userDetails?.src}
            userDetails={userDetails}
            fit="cover"
          />
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTextSecondary} numberOfLines={1}>
              Minimum Redeem
            </Text>
            <Text style={styles.headerTextPrimary}>
              {userDetails?.rewards?.max_point || 0}
            </Text>
            <Text style={styles.headerTextSecondary}>Points</Text>
          </View>
          <View style={styles.headerActions}>
            <Button
              variant="primary"
              btnText="Redeem Now"
              btnTextOverrideStyles={styles.redeemBtnText}
              overridingStyles={styles.redeedBtn}
              onPress={redeemCheck}
            />
            <Button
              btnTextOverrideStyles={styles.redeemBtnText}
              variant="primary"
              btnText="History"
              overridingStyles={styles.redeedBtn}
              onPress={() => navigation.navigate('PointRedeemHistory')}
            />
          </View>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>My Status</Text>

          {rewards !== null && (
            <View style={styles.progressTrack}>
              <ProgressBar progress={userPoints} />
            </View>
          )}
        </View>
      </View>
        {rewardTabs.length > 0 && (
          <View style={styles.rewardsTabsWrapper}>
            <TabView
              tabs={rewardTabs}
              actTab={category?.uuid || rewardTabs[0]?.uuid}
              subCheck
              onTabChange={index => onCategoryHandle(rewardTabs[index], index)}
              tabHeaderWrapperStyles={styles.rewardsTabHeader}
              tabContentBaseStyles={styles.tabContentBase}
              renderActiveTabContent={() => (
              <View style={styles.rewardTabContent}>
                {filteredRewards?.length > 0 ? (
                  <FlatList
              ItemSeparatorComponent={
                Platform.OS !== 'android' &&
                (({ highlighted }) => (
                  <View
                    style={[styles.separator, highlighted && { marginLeft: 0 }]}
                  />
                ))
              }
              numColumns={1}
              horizontal={false}
              onEndReached={() => {
                setPageNum((prevPage) => prevPage + 1);
              }}
              onEndReachedThreshold={0.1}
              scrollEnabled={false}
              data={filteredRewards}
              renderItem={({ item, index }) => {
                const cardItem = {
                  ...item,
                  subject: item?.mails?.[0]?.subject || item?.subject || 'Reward',
                  type: item?.mails?.[0]?.type || item?.type,
                };
                return (
                    <OfferCard
                      variant="reward"
                      containerStyles={{
                        marginBottom: index + 1 < filteredRewards?.length ? 14 : 0,
                      }}
                      isRedeemed={true}
                      isFavourite={item?.is_favourite === 'true' ? true : false}
                      onFavouriteToggle={e => onFavouriteMailToggle(item?.uuid)}
                      key={index}
                      item={cardItem}
                    />
                )
              }}
                  />
                ) : (
                  <View style={styles.emptyRewardState}>
                    <Text style={styles.emptyRewardTitle}>No Rewards Found</Text>
                    <Text style={styles.emptyRewardText}>Try another category or check back for fresh rewards.</Text>
                  </View>
                )}
              </View>
              )}
            />
          </View>
        )}
    </ScrollView>
  );
};

const styless = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowOpacity: 0,
    elevation: 0,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 0,
    width: 100,
  },
  btnOk: {
    backgroundColor: '#00AEEF',
    marginLeft: 5
  },
  btnCancel: {
    backgroundColor: 'orange',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#222'
  },
});

export default Rewards;
