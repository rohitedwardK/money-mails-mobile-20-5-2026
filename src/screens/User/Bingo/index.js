import React, { useState, useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { ScrollView, RefreshControl, View, Text, StyleSheet, TouchableOpacity, Dimensions, BackHandler, Image } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLogin } from '../../../hooks/services/useLogin';
import CookieManager from "@react-native-cookies/cookies";
import { baseUrl, bingoUrl } from '../../../connections';
import { useNavigation } from '@react-navigation/native';

const Bingo = () => {
    const { data } = useLogin();
    const webViewRef = useRef();
    const [bingoData, setBingoData] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [refresherEnabled, setEnableRefresher] = useState(true);
    const [isAgree, setIsAgree] = useState(false);
    const navigation = useNavigation()
    useEffect(() => {
        const dataLoad = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const user = JSON.parse(userData);
                    if (user && user?.bingo && JSON.stringify(user?.bingo) !== "{}") {
                        const { dInfoUserId, dInfoUserType, dInfoUserEmail } = user.bingo;
                        setBingoData(`dInfoUserId=${dInfoUserId}; dInfoUserType=${dInfoUserType}; dInfoUserEmail=${dInfoUserEmail}`);

                    } else {
                        setBingoData('dInfoUserId=1')
                    }
                }
            } catch (error) {
                console.error("Error loading user data:", error);
            }
        };
        dataLoad();
    }, []);

    const handleScroll = (event) => {
        const yOffset = event.nativeEvent.contentOffset.y;
        setEnableRefresher(yOffset === 0);
    };

    useEffect(() => {
        const backAction = () => {
            if (isAgree) {
                setIsAgree(false);
                return true;
            } else {
                navigation.goBack();
                return true;
            }
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );
        return () => backHandler.remove();
    }, [isAgree, navigation]);


    return (
        <>
            {!isAgree && <ScrollView style={{ backgroundColor: "white" }}>
                <View style={{ flex: 1, margin: 10 }}>
                    <Image source={require('../../../assets/images/bingoLogo.jpg')} />
                    <Text style={{
                        color: 'black',
                        fontWeight: 'bold',
                        fontSize: 20,
                        textAlign: "center"
                    }}>Money Mails Bingo Game Rules</Text>
                    <Text style={{
                        color: 'black',
                        fontWeight: '800',
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 18
                    }}>Game Setup</Text>
                    <Text style={styles.listHead}>
                        1. Platform Access :
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Players can join the game via a website or app for free.</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        2. Player Registration:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Players must register with a valid account to participate in prize-winning games.</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        3. Bingo Cards:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Each player gets one Bingo card for free at the start of the game. Cards are assigned purely online.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Bingo cards feature a 5x5 grid of random numbers (ranging from 1 to 75) with the center square marked as a free space.</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }}></View>

                    <Text style={{
                        color: 'black',
                        fontWeight: '800',
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 18
                    }}>Gameplay</Text>
                    <Text style={styles.listHead}>
                        1. Caller's Numbers :
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Numbers are displayed in real-time on the game interface.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Players can select and mark matching numbers on their cards through the app or website.</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        2. Marking the Card:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>
                                Players mark their digital Bingo cards by tapping matching numbers as they are called.
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>
                                For convenience, the system automatically updates cards when numbers match.
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        3. Winning Patterns:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Players win by completing specific patterns such as:</Text>
                        </View>
                    </View>

                    <View style={styles.listDefination1Container2}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Horizontal Line: All five squares in a single row.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Vertical Line: All five squares in a single column.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Diagonal Line: Five squares from one corner to the opposite corner.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Full House/Blackout: All squares on the card.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Additional patterns like "X" or box shapes, depending on the game variant.</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        4. Declaring Bingo:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>
                                Players must mark their numbers quickly as others are simultaneously playing.
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>
                                Winners are determined automatically by the platform’s software, based on who completes the pattern first.
                            </Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }}></View>

                    <Text style={{
                        color: 'black',
                        fontWeight: '800',
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 18
                    }}>Prizes</Text>
                    <Text style={styles.listHead}>
                        1. Real Prizes :
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Winners can claim real prizes, such as gift cards, merchandise, or other rewards listed on the website or app.</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        2. Prize Distribution:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Prizes are managed and distributed fairly through the platform.</Text>
                        </View>
                    </View>



                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }}></View>


                    <Text style={{
                        color: 'black',
                        fontWeight: '800',
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 18
                    }}>Cost and Eligibility</Text>
                    <Text style={styles.listHead}>
                        1. Free-to-Play :
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>The game is completely free to play for all registered users.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>No purchase is required to win prizes.</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        2. Eligibility:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Players must comply with the platform’s terms and conditions to remain eligible.</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }}></View>


                    <Text style={{
                        color: 'black',
                        fontWeight: '800',
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 18
                    }}>Fair Play and Rules</Text>
                    <Text style={styles.listHead}>
                        1. Random Number Generator (RNG) :
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Each game uses an RNG to ensure fairness.</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        2. One Account Per Player:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Players are restricted to one account to avoid duplications</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        3. Cheating:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Cheating, such as using multiple accounts, results in immediate disqualification.</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }}></View>


                    <Text style={{
                        color: 'black',
                        fontWeight: '800',
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 18
                    }}>Community Fun Features</Text>
                    <Text style={styles.listHead}>
                        1. Chat Feature :
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>A moderated chat allows players to socialize during the game (coming soon).</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        2. Leaderboard:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Top players based on winnings or participation are highlighted weekly</Text>
                        </View>
                    </View>

                    <Text style={styles.listHead}>
                        3. Special Rounds:
                    </Text>
                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Themed rounds or bonus games with larger prizes are occasionally held (coming soon).</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, height: 1, backgroundColor: 'black' }}></View>

                    <Text style={{
                        color: 'black',
                        fontWeight: '800',
                        marginTop: 10,
                        marginBottom: 10,
                        fontSize: 18
                    }}>Disclaimer</Text>

                    <View style={styles.listDefination1Container1}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>Apple/Google is not a sponsor of, nor involved in, the Money Mails Bingo game.</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <View style={styles.litstPoint}></View>
                            <Text style={styles.listDefination}>All rules and prize allocations comply with local laws and regulations.</Text>
                        </View>
                    </View>


                    <View style={{ padding: 40, alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => setIsAgree(true)}>
                            <View style={{ backgroundColor: "#138d75" }}>
                                <Text style={{ paddingLeft: 15, paddingRight: 15, padding: 10, color: 'white' }}>Continue</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>}
            {isAgree && <ScrollView
                contentContainerStyle={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        enabled={refresherEnabled}
                        onRefresh={() => webViewRef.current.reload()}
                    />
                }>
                {bingoData ? (
                    <WebView
                        style={{ flex: 1 }}
                        source={{
                            // uri: 'https://bingo.money-mails.com/',
                            uri: `${bingoUrl}`,
                            headers: { 'Custom-Header': bingoData },
                        }}
                        ref={webViewRef}
                        onScroll={handleScroll}
                        sharedCookiesEnabled={true}
                        javaScriptEnabled={true}
                        thirdPartyCookiesEnabled={true}
                        CookieManager={CookieManager}
                        originWhitelist={['*']}
                        allowsInlineMediaPlayback
                        scalesPageToFit
                        mediaPlaybackRequiresUserAction={false}
                        javaScriptEnabledAndroid
                        useWebkit
                        startInLoadingState={true}
                        cacheEnabled
                    />
                    // <WebView
                    //     style={{ flex: 1 }}
                    //     source={{
                    //         uri: 'https://bingo.money-mails.com/',
                    //     }}
                    //     ref={webViewRef}
                    //     onScroll={handleScroll}
                    // />
                    //     <WebView
                    //     ref={webViewRef}
                    //     source={{ uri: 'https://your-website.com' }}
                    //     onLoad={() => setLoading(false)}
                    //     onError={(syntheticEvent) => {
                    //       const { nativeEvent } = syntheticEvent;
                    //       console.warn('WebView error: ', nativeEvent);
                    //     }}
                    //   />

                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'black' }}>Loading...</Text>
                    </View>
                )}
            </ScrollView>}
        </>
    );
};

const styles = StyleSheet.create({
    listHead: {
        color: 'black',
        fontWeight: '600',
        fontSize: 16
    },
    listDefination1Container1: {
        marginLeft: 20,
        width: Dimensions.get('window').width - 40
    },
    listDefination1Container2: {
        marginLeft: 50
    },
    listDefination: {
        color: 'black',
        fontSize: 16,
        marginTop: -10,
        // width : 160
    },
    litstPoint: {
        width: 4,
        height: 4,
        marginRight: 10,
        backgroundColor: 'black',
        borderRadius: 50
    }
})

export default Bingo;
