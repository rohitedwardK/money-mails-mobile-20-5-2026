import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import { ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../../../hooks/services/useLogin';

const Bingo = ()=>{
    const { data, isLoading, error, message, setPayload } = useLogin();
    const webViewRef = useRef();
    const [bingoData, setBingoData] = useState('');

    // useEffect(() => {
    //     if (data) {
    //     }
    //   }, [data]);

    const [refreshing, setRefreshing] = useState(false);
    const [refresherEnabled, setEnableRefresher] = useState(true);

    const handleScroll = (event) =>  {
        const yOffset = Number(event.nativeEvent.contentOffset.y);
        if (yOffset === 0){
          setEnableRefresher(true);
        }else{
          setEnableRefresher(false);
        }
      };

    const dataLoad = async()=>{
      let data = JSON.parse(await AsyncStorage.getItem('user'));
      // alert(JSON.stringify(data.bingo))
      if(Object.keys(data.bingo).length){
       setBingoData(`dInfoUserId=${data.dInfoUserId}; dInfoUserType=${data.dInfoUserType}; dInfoUserEmail=${data.dInfoUserEmail}`);
      }else{
        setBingoData('dInfoUserId=; dInfoUserType=; dInfoUserEmail=');
      }

    };

    useEffect(()=>{
        dataLoad();
    },[]);



    return (
        <ScrollView
        contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            enabled={refresherEnabled}
            onRefresh={()=>{webViewRef.current.reload();}}
          />
        }>
       {
        bingoData ? (
          <WebView
          style={{marginTop : 25}}
          source={{
            uri: 'https://stage-bingo.money-mails.com/',
            headers: {
              // 'Custom-Header':   `dInfoUserId=107; dInfoUserType=customer; dInfoUserEmail=stage@gmail.com`,
              'Custom-Header':   bingoData,
            },
          }}
          sharedCookiesEnabled={true}
          javaScriptEnabled={true}
          thirdPartyCookiesEnabled={true}
          CookieManager={CookieManager}
          ref={webViewRef}
          originWhitelist={['*']}
          allowsInlineMediaPlayback
          scalesPageToFit
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabledAndroid
          useWebkit
          startInLoadingState={true}
          cacheEnabled
          onScroll={handleScroll}
        />
        ) : null
       }
      </ScrollView>
    );
};

export default Bingo;
