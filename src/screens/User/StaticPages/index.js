import React, {useContext, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Snackbar from 'react-native-snackbar';
import {WebView} from 'react-native-webview';
import Button from '../../../components/atoms/Button';
import {UserContext} from '../../../context/UserContext';
import {deleteAccount} from '../../../api/moneyMails';
import {usePopUpAds} from '../../../hooks/services/usePopupads';
import {clearAuthSession} from '../../../utils/authSession';
import {
  PRIVACY_POLICY_URL,
  TERMS_CONDITIONS_URL,
} from '../../../constants';

const sections = {
  About: [
    ['Welcome to MoneyMails', 'Your one-stop shop for all things marketing! Our mission is to empower local entrepreneurs and businesses to reach new heights through effective marketing strategies and cutting-edge technology.'],
    [null, 'Our platform provides a unique space for business owners to connect with their target audience, promote their products and services, and gain valuable insights from customer feedback. With our user-friendly interface and comprehensive database, you can easily reach and engage with your ideal customer.'],
    [null, "At MoneyMails, we believe in the power of data-driven marketing to drive real results. That's why we provide our users with the tools and resources they need to succeed in today's fast-paced marketplace. Whether you're looking to boost brand awareness, drive sales, or expand your customer base, we've got you covered."],
    [null, 'MoneyMails provides a platform for local entrepreneurs to showcase their deals, coupons, and business updates to the community. They can post their offers via email in two ways: Paid Mail and Informational Mail. With Paid Mail, they earn points (redeemable for cash) when users click on their emails. Informational Mail allows users to access coupons, deals, and vendor information with a single click.'],
    [null, 'Our aim is to offer a one-stop platform for local deals on everyday essentials like grocery stores, haircuts, salons, and more. Additionally, we provide business owners with a robust database of users, enabling them to leverage our precise user list in every area, maximizing their reach and impact.'],
    [null, 'We offer local entrepreneurs a dedicated online space and exclusive access to a user list, enabling them to market and promote their business daily. Additionally, we provide valuable customer feedback on their products, empowering them to make informed decisions and drive growth.'],
    [null, 'Join our community today and discover the power of effective marketing for yourself!'],
  ],
  FAQ: [
    ['What is Money Mails?', 'Money Mails is a local deals and rewards app that helps users discover brands, offers, and paid mail.'],
    ['Why complete my profile?', 'Profile details help Money Mails verify your account and tailor deals to your current location.'],
    ['Can I change my ZIP?', 'Current ZIP changes require Money Mails Support because location-based eligibility depends on verified address data.'],
    ['How do rewards work?', 'Eligible paid mail and reward activity can generate points. Redemption is subject to account and admin verification.'],
  ],
  Support: [
    ['Support', 'For account, ZIP, verification, reward, or offer issues, contact Money Mails Support through the official support channel.'],
    ['Before Contacting Support', 'Include your registered email, phone number if available, and a clear description of the issue so support can locate your account quickly.'],
  ],
};

const policyUrls = {
  Privacy: PRIVACY_POLICY_URL,
  Terms: TERMS_CONDITIONS_URL,
};

const policyPageStyles = `
  (function () {
    var style = document.createElement('style');
    style.textContent = '* { box-sizing: border-box !important; } html, body { margin: 0 !important; padding: 0 !important; width: 100% !important; min-height: 0 !important; background: #FFFFFF !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; } #hosted[data-custom-class="body"] { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 8px 5px 24px !important; background: #FFFFFF !important; color: #475467 !important; } [data-custom-class="title"] { display: none !important; margin: 0 !important; } [data-custom-class="subtitle"] { display: block !important; color: #475467 !important; font-size: 11px !important; line-height: 16px !important; text-align: center !important; margin: 0 0 8px !important; } [data-custom-class="heading_1"] { color: #17212B !important; font-size: 17px !important; line-height: 23px !important; text-align: center !important; margin: 4px 0 8px !important; } [data-custom-class="heading_2"], [data-custom-class="heading_3"] { color: #17212B !important; font-size: 15px !important; line-height: 21px !important; text-align: center !important; margin: 11px 0 5px !important; } [data-custom-class="body_text"], [data-custom-class="body_text"] span, [data-custom-class="body_text"] a, p, li, dd, td { color: #475467 !important; font-size: 13px !important; line-height: 20px !important; text-align: justify !important; text-justify: inter-word !important; } p { margin: 0 0 9px !important; } ul, ol { margin: 4px 0 9px !important; padding-left: 20px !important; }';
    document.head.appendChild(style);
  })();
  true;
`;

const StaticContentScreen = ({route}) => {
  const page = route?.params?.page || 'Terms';
  const policyUrl = policyUrls[page];
  const content = sections[page] || sections.About;

  if (policyUrl) {
    return (
      <WebView
        style={styles.documentPage}
        source={{uri: policyUrl}}
        injectedJavaScriptBeforeContentLoaded={policyPageStyles}
        injectedJavaScript={policyPageStyles}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.policyLoading}>
            <ActivityIndicator color="#168F79" size="large" />
            <Text style={styles.policyLoadingText}>Loading {page}…</Text>
          </View>
        )}
        renderError={() => (
          <View style={styles.policyLoading}>
            <Text style={styles.policyErrorText}>
              Unable to load {page}. Please check your connection and try again.
            </Text>
          </View>
        )}
      />
    );
  }

  return (
    <ScrollView
      style={[styles.page, page === 'About' ? styles.documentPage : null]}
      contentContainerStyle={[
        styles.content,
        page === 'About' ? styles.aboutContent : null,
      ]}>
      {page !== 'About' ? <Text style={styles.title}>{page}</Text> : null}
      {content.map(([heading, body], index) => (
        <View
          key={`${page}-${index}`}
          style={[styles.section, page === 'About' ? styles.aboutSection : null]}>
          {heading ? (
            <Text style={[styles.heading, page === 'About' ? styles.aboutHeading : null]}>
              {heading}
            </Text>
          ) : null}
          <Text style={[styles.body, page === 'About' ? styles.aboutBody : null]}>
            {body}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export const TermsScreen = props => (
  <StaticContentScreen {...props} route={{params: {page: 'Terms'}}} />
);

export const PrivacyScreen = props => (
  <StaticContentScreen {...props} route={{params: {page: 'Privacy'}}} />
);

export const AboutScreen = props => (
  <StaticContentScreen {...props} route={{params: {page: 'About'}}} />
);

export const FAQScreen = props => (
  <StaticContentScreen {...props} route={{params: {page: 'FAQ'}}} />
);

export const SupportScreen = props => (
  <StaticContentScreen {...props} route={{params: {page: 'Support'}}} />
);

export const DeleteAccountScreen = ({navigation}) => {
  const {userDetails, setUserDetails} = useContext(UserContext);

  const clearSession = async () => {
    await clearAuthSession();
    setUserDetails({});
  };

  const confirmDelete = () => {
    Alert.alert(
      'Confirm Account Deletion',
      'This will permanently remove your account, reward points, and associated data. This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(userDetails?.uuid || userDetails?.user_uuid);
              Snackbar.show({
                text: 'Account deleted successfully.',
                duration: Snackbar.LENGTH_SHORT,
              });
              await clearSession();
            } catch (error) {
              Snackbar.show({
                text: error?.message || 'Something went wrong.',
                duration: Snackbar.LENGTH_SHORT,
              });
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.page, styles.deletePage]}>
      <Text style={styles.title}>Delete Your Account?</Text>
      <Text style={styles.body}>
        Selecting Delete will permanently delete your account, reward points,
        and associated data.
      </Text>
      <Button
        btnText="Go Back"
        variant="secondary"
        overridingStyles={styles.action}
        onPress={() => navigation.goBack()}
      />
      <Button
        btnText="Delete Account"
        variant="primary"
        overridingStyles={styles.action}
        onPress={confirmDelete}
      />
    </View>
  );
};

export const PopupAdsScreen = () => {
  const {userDetails} = useContext(UserContext);
  const {PopUpAddData, isLoading, setPopUpAds} = usePopUpAds();

  useEffect(() => {
    if (userDetails?.uuid) {setPopUpAds(`?user_uuid=${userDetails.uuid}`);}
  }, [setPopUpAds, userDetails?.uuid]);

  const ads = Array.isArray(PopUpAddData) ? PopUpAddData : PopUpAddData?.data || [];

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Popup Ads</Text>
      {isLoading ? <ActivityIndicator color="#168F79" /> : null}
      {!isLoading && !ads?.length ? (
        <Text style={styles.body}>No popup ads are available.</Text>
      ) : null}
      {ads?.map(item => (
        <View key={item.uuid || item.image} style={styles.adCard}>
          {item.image ? <Image source={{uri: item.image}} style={styles.adImage} /> : null}
          <Text style={styles.heading}>{item.title || item.name || 'Advertisement'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  documentPage: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  aboutContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  title: {
    color: '#17212B',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 18,
  },
  section: {
    borderBottomColor: '#EAECF0',
    borderBottomWidth: 1,
    paddingBottom: 18,
    paddingTop: 4,
  },
  aboutSection: {
    borderBottomWidth: 0,
    paddingTop: 0,
    paddingBottom: 9,
  },
  heading: {
    color: '#17212B',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  aboutHeading: {
    fontSize: 17,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  body: {
    color: '#475467',
    fontSize: 14,
    lineHeight: 21,
  },
  aboutBody: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'justify',
  },
  deletePage: {
    justifyContent: 'center',
    padding: 24,
  },
  action: {
    marginTop: 16,
    width: '100%',
  },
  policyLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    padding: 24,
  },
  policyLoadingText: {
    color: '#475467',
    fontSize: 14,
    marginTop: 12,
  },
  policyErrorText: {
    color: '#475467',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  adCard: {
    borderColor: '#EAECF0',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  adImage: {
    aspectRatio: 1.6,
    width: '100%',
  },
});
