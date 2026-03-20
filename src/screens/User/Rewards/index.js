import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Pressable,
  TouchableHighlight,
  StyleSheet,
  BackHandler,
} from 'react-native';
import Button from '../../../components/atoms/Button';
import Avatar from '../../../components/atoms/Avatar';
import { rewardsScreenStyles } from './index.style';
import Grid from '../../../components/atoms/Grid';
import BrandIconCard from '../../../components/molecules/BrandIconCard';
import OfferCard from '../../../components/organisms/OfferCard';
import SubCatCard from '../../../components/molecules/SubCatCard';
import getColors from '../../../utils/colors';
import ProgressBar from '../../../components/atoms/ProgressBar';
import { UserContext } from '../../../context/UserContext';
import { useCategory } from '../../../hooks/services/useCategory';
import { useReward } from '../../../hooks/services/useReward';
import { usePointRedeem } from '../../../hooks/services/usePointRedeem';
import { useFavourites } from '../../../hooks/services/useFavourites';
import ListItem from './ListItem';
import { useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { baseUrl } from '../../../connections';

const Rewards = () => {
  const [pageNum, setPageNum] = useState(0);
  const [PageSize, setPageSize] = useState(10);
  const [filterValue, setFilterValue] = useState('');
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const styles = rewardsScreenStyles();
  const { userDetails } = useContext(UserContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {
    categoryList = [],
    point,
    isCatLoading,
    catError,
    catDetails,
    setCatPayload,
    setCatDetails,
    SetPege,
    setCatDetailsPayload,
  } = useCategory();
  const { setUpdateMailFav } = useFavourites();
  const { rewards, setPayload } = useReward();
  const [selCategory, setSelectCategory] = useState('');
  const [category, setCategory] = useState('');
  const ref = React.createRef();
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

  const {
    themeColors,
    rewardsScreenColors,
    offerCardColors: colors,
  } = getColors();

  useEffect(() => {
    setCatPayload('search=');
  }, [setCatPayload]);

  useEffect(() => {
    setPayload(`${userDetails?.uuid}`);
  }, [userDetails?.uuid]);

  const rewardsData = () => {
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
  }

  useEffect(() => {
    if (isFocused) {
      rewardsData();
    }
  }, [isFocused, pageNum]);

  const onFavouriteMailToggle = mail_uuid => {
    setUpdateMailFav({
      user_uuid: userDetails?.uuid,
      mail_uuid: mail_uuid,
    });
    setTimeout(() => {
      onCategoryHandle(category);
    }, 1000);
  };

  const onCategoryHandle = (item, i) => {
    SetPege(0);
    setPageNum(0);
    if (i) setSelectedIndex(i);

    setCategory(item);
    setSelectCategory(item.name);
    setCatDetailsPayload(
      `user_uuid=${userDetails?.uuid}&category_uuid=${item?.uuid}&page=${pageNum}&limit=${PageSize}`,
    );
    setTimeout(() => {
      ref.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }, 100);
  };


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
      <View styles={styles.header}>
        <Grid gap={10}>
          <Avatar
            src={userDetails?.src}
            userDetails={userDetails}
            fit="cover"
          />
          <View style={styles.headerTextWrapper}>
            <Text style={styles.headerTextSecondary}>Minimum Redeem</Text>
            <Text style={styles.headerTextPrimary}>
              {userDetails?.rewards?.max_point} Points
            </Text>
            <Text style={styles.headerTextSecondary}>Points</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ marginBottom: 5 }}>
              <Button variant="primary" btnText="Redeem Now"
                btnTextOverrideStyles={{ fontSize: 12 }}
                overridingStyles={styles.redeedBtn} onPress={redeemCheck} />
            </View>
            <Button
              btnTextOverrideStyles={{ fontSize: 12 }}
              variant="primary" btnText="Redeem History" overridingStyles={styles.redeedBtn} onPress={() => navigation.navigate('PointRedeemHistory')} />
          </View>
        </Grid>
        <View style={styles.statusContainer}>
          <Text style={styles.statusTitle}>My Status</Text>

          {rewards !== null && (
            <View style={{ width: '90%', marginHorizontal: 5 }}>
              <ProgressBar progress={userPoints} />
            </View>
          )}
        </View>
        {/* {categoryList?.length > 0 && (
          <Grid
            gap={10}
            dir="column"
            containerStyles={styles.rewardsItemsWrapper}>
            {categoryList?.map((item, i) => {
              const isSelected = true;
              return (
                <TouchableOpacity
                  onPress={() => onCategoryHandle(item, i)}
                  style={[
                    styles.rewardItemContainer,
                    isSelected ? styles.rewardItemContainerSelected : {},
                  ]}
                  key={i}>
                  <SubCatCard
                    color={
                      isSelected
                        ? rewardsScreenColors.rewardIconSelectedBg
                        : themeColors.bgPrimary
                    }
                    disableSelect
                    rounded
                    wrapperStyles={styles.rewardCategoryIcon}
                    size={78}>
                    <Image
                      key={i}
                      source={{uri: `${item?.image}`}}
                      style={{width: 50, height: 50}}
                      resizeMode={'cover'}
                    />
                  </SubCatCard>
                  <View>
                    <Text style={styles.rewardItemTitle}>{item?.name}</Text>
                     <Text style={styles.rewardItemSubTitle}>
                      You have 0 Points!
                    </Text>
                    <Text style={styles.rewardItemInfoText}>
                      1,000 Points = $1 USD
                    </Text> 
                  </View>
                </TouchableOpacity>
              );
            })}
          </Grid>
        )} */}


        <ScrollView horizontal>
          <View style={{ flexDirection: 'row', backgroundColor: '#BCE5D7', width: '200%', }}>
            {categoryList?.map((item, i) => {
              const isSelected = true;
              return (
                <TouchableOpacity
                  onPress={() => onCategoryHandle(item, i)}
                  style={[
                    styles.rewardItemContainer,
                    isSelected ? styles.rewardItemContainerSelected : {},
                  ]}
                  key={i}>
                  {/* <SubCatCard
                    color={
                      isSelected
                        ? rewardsScreenColors.rewardIconSelectedBg
                        : themeColors.bgPrimary
                    }
                    disableSelect
                    rounded
                    wrapperStyles={styles.rewardCategoryIcon}
                    size={78}>
                    <Image
                      key={i}
                      source={{uri: `${item?.image}`}}
                      style={{width: 50, height: 50}}
                      resizeMode={'cover'}
                    />
                  </SubCatCard> */}

                  {selCategory == item.name && <View style={{ flexDirection: 'column', padding: 10, backgroundColor: '#16A2A0', borderRadius: 15 }}>
                    <View>
                      <Text style={[styles.rewardItemTitle, { color: 'white' }]}>{item?.name}</Text>
                    </View>
                  </View>}
                  {selCategory != item.name && <View style={{ flexDirection: 'column', padding: 10 }}>
                    <View>
                      <Text style={styles.rewardItemTitle}>{item?.name}</Text>
                    </View>
                  </View>}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <ListItem ref={ref}>
          {catDetails?.length > 0 && (
            <View style={styles.catTitle}>
              <Text>{selCategory} </Text>
            </View>
          )}
          <View style={styles.categoryView}>


            {catDetails && <FlatList
              ItemSeparatorComponent={
                Platform.OS !== 'android' &&
                (({ highlighted }) => (
                  <View
                    style={[styles.separator, highlighted && { marginLeft: 0 }]}
                  />
                ))
              }
              columnWrapperStyle={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}
              numColumns={2}
              horizontal={false}
              onEndReached={() => {
                setPageNum((prevPage) => prevPage + 1);
              }}
              onEndReachedThreshold={0.1}
              scrollEnabled={false}
              onScrollEndDrag={() => console.log("end")}
              data={filterValue ? catDetails.filter((item) => {
                return item?.brand.some((val) => val.company_name.toLowerCase().startsWith(filterValue?.toLowerCase()));
              }) : catDetails}
              renderItem={({ item, index }) => {
                item.subject = item.mails[0].subject;
                item.type = item.mails[0].type;
                let j = index % 4;
                return (
                  <TouchableHighlight
                    key={index}>
                    <OfferCard
                      containerStyles={{
                        margin: 5,
                        marginBottom: index + 1 < catDetails?.length ? 10 : 0,
                        backgroundColor: colors[j],
                      }}
                      isRedeemed={true}
                      isFavourite={item?.is_favourite === 'true' ? true : false}
                      onFavouriteToggle={e => onFavouriteMailToggle(item?.uuid)}
                      key={index}
                      item={item}
                    />
                  </TouchableHighlight>
                )
              }}
            />}
          </View>
        </ListItem>
      </View>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
