import React, {useContext, useState, useEffect, useRef} from 'react';
import {View, Text,TouchableOpacity,Modal,Pressable,ScrollView,Linking,
  ToastAndroid, AlertIOS, Platform
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Button from '../../../components/atoms/Button';
import {DeviceContext} from '../../../context/DeviceContext';
import {styles as resetPasswordStyles} from './index.style';
import { useVerification } from "../../../hooks/services/useVerification";
import { UserContext } from "../../../context/UserContext";
import Toast from '../../../components/atoms/Snackbar';
import {Checkbox} from 'react-native-paper';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 8;

const UserVerification = ({navigation}) => {
  const [checked, setChecked] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const {isIos, screenHeight} = useContext(DeviceContext);
  const { userDetails } = useContext(UserContext);
  const [value, setValue] = useState('');
  const {isOTPVerified, error, setOTPPayload} = useVerification();
  const [isVerify, setIsVerify] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const styles = resetPasswordStyles({screenHeight, isIos});

  const otpOnSubmit = async(e) => {
    if(!checked){
      let msg = "Please accept Terms and Conditions.";
      if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
      } else {
        AlertIOS.alert(msg);
      }
    }else{
      await setOTPPayload({
        user_uuid: userDetails.user_uuid? userDetails?.user_uuid : '',
        code: value
      });
      setIsVerify(true);
    }
    
  }

  useEffect(()=>{
    setIsVerify(false);
    if(isOTPVerified) navigation.navigate("SignIn")
  },[isOTPVerified, error])

  return (
    <View style={styles.pageContainer}>
      <Button
        btnText="Back"
        startIcon={<EntypoIcon name="chevron-small-left" size={30} />}
        variant="secondary"
        type="text"
        onPress={() => navigation.navigate('SignIn')}
        overridingStyles={styles.backButton}
      />
      <View style={styles.header}>
        <Text style={styles.pageTitle}>User Verification</Text>
        <Text style={styles.subTitle}>
        Insert your code here:
        </Text>
      </View>
      <View style={styles.otpFieldsWrapper}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      </View>
      <View style={{flexDirection:'row'}}>
          <View style={{marginTop:12}}>
              <Checkbox.Item 
              style={{marginLeft:-20,marginRight:-10}}
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
              color="green"
              uncheckedColor="red"
              mode="android"
              />
          </View>
          <View>
            <Text style={styles.termcondition}>
        I have read and accept the </Text>
          </View>
          <View>
          <TouchableOpacity onPress={()=>{
             setModalVisible(true)
          }}><Text style={styles.termconditionLink}>Terms and Conditions.</Text></TouchableOpacity>
          </View>
      </View>
      {/* Modal Code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
           <ScrollView>
           <View style={styles.modalContents}>
              <Text style={styles.heading}>TERMS & CONDITIONS</Text>
              <Text style={styles.modalText}>Please read these terms and conditions carefully before using https://money-mails.com. This website is operated and managed by money-mails.com in the whole extent of this website, every point the terms “we”, “us” or “our” is used, it refers to money-mails.com. By purchasing goods from us, you involve in our “Service” and agree to be bound by the following terms and conditions stated, including the policies referenced herein and/or available by hyperlink. These Terms and Conditions are applicable to all users of the site, including without limitation every user who is browsers, customers and merchants. If you disagree with all or any of the terms of use in this agreement, then you may consider not to access the website or use any of the services.</Text>
              <Text style={styles.subHeading}>CHANGES TO TERMS</Text>
              <Text style={styles.modalText}>We are committed to ensuring that our online store is as useful and efficient as possible. For that reason, we reserve the right to make changes to the services, at any time. We will never charge you for any service without making it very clear to you precisely what you're paying for.</Text>
              <Text style={styles.modalText}>Any new features or product(s) which are added to the current store shall also be subject to this Terms and condition. You can always review the most current version of the Terms and conditions at any time on this page. We reserve the right to update, change or retrieve any part of these Terms and conditions by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes</Text>
              <Text style={styles.subHeading}>PLACING AN ORDER</Text>
              <Text style={styles.modalText}>When you place an order through the Website, we will send an email to confirm that we have received the order. All orders are subject to these terms and conditions. Orders placed through the Website represent an offer to purchase a product. It is accepted for each product when we send you an email to confirm that the order has been received. We reserve the right to reject any order for any reason. It is important that you enter the correct e-mail address when placing your order. We also recommend that you save your order confirmation email to facilitate any contact with customer service or for future references. The order confirmation (receipt) also serves as a guarantee of proof of purchase.</Text>
              <Text style={styles.subHeading}>PRICES, TAXES, AND PAYMENT TERMS</Text>
              <Text style={styles.modalText}>Prices and payment details of products are specified on the website. Payment can be made by credit card, Debit card, and/or as further described in the store. Prices are shown exclusive of VAT, import duties and other government-imposed taxes, duties, and levies. You will be responsible for the payment of such import duties and taxes. It should be noted that money-mails.com has no control over these charges. The User guarantees that the information submitted when using the Service, including without limitation, its payment details, shall be complete, correct, truthful and up to date.</Text>
              <Text style={styles.modalText}>The User must inform money-mails.com immediately about any inaccuracies in the offer provided, including the price. Our banking services and payment gateways manage all of our banking transactions. We don’t store any credit card numbers. Your payment is handled by the payment gateways with secure encryption and under strict banking standards. Your card details are sent directly to them and cannot be read or accessed by anyone.</Text>
              <Text style={styles.modalText}>During the period of validity indicated in the offer for the product, the prices of the product will not be increased, except for price changes in VAT-tariffs. After such a period, we are entitled to adjust the price for any product(s). In such cases, money-mails.com shall notify the User in advance. Such notice may be provided at any time by posting the changes to the Website or via the product itself</Text>
              <Text style={styles.subHeading}>OUR RIGHTS TO CANCEL/REJECT ORDERS</Text>
              <Text style={styles.modalText}>We reserve the right to decline any order you place with us. We may, in our exclusive discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, or orders that use the same billing and/or shipping address. If we make a change to or cancel an order, we may attempt to notify you by contacting the e¬mail and billing address/phone number provided at the time the order was made. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers or distributors. You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.</Text>
              <Text style={styles.subHeading}>PRODUCT AVAILABILITY, ERRORS, INACCURACIES AND OMISSIONS</Text>
              <Text style={styles.modalText}>Products on our online store through https://money-mails.com are subject to change without notice. Errors will be corrected when discovered. Our Site contains a large number of products and it is always possible that, despite our best efforts, some of the products listed on our Site may be incorrectly priced, the quantity or availability of a product may have changed just prior to you placing your order or other errors may be displayed on the product page. We will normally verify prices, availability and confirm there are no errors on the product page as part of our dispatch procedures.</Text>
              <Text style={styles.modalText}>Where a product's correct price is less than our stated price, we will charge the lower amount when dispatching the product to you. If a product's correct price is higher than the price stated on our Site, we will normally, at our discretion, either contact you for instructions before dispatching the Product, or reject your order and notify you of such rejection. We are under no obligation to provide the product to you at the incorrect (lower) price, even after we have sent you an Order Confirmation.</Text>
              <Text style={styles.modalText}>Also, there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions on a product page. We reserve the right to rescind our acceptance and cancel your order without penalty in the event there is an obvious and unmistakable error on the product page, in our reasonable discretion.</Text>
              <Text style={styles.subHeading}>VENDOR TERMS</Text>
              <Text style={styles.subHeading}>Fees and Billing</Text>
              <Text style={styles.modalText}>Joining and listing of products on money-mails.com is free. money-mails.com charges a fee and a percentage of the sale price when the item sells. When you list an item, you have an opportunity to review and accept the fees that you will be charged. Dinfokit Fees Policy, which is subject to change, is incorporated into this Agreement by reference. Changes to the Fees Policy and the fees for Dinfokit services are effective after Dinfokit provides you with at least fourteen (14) days’ notice by posting the changes on the Site. However, money-mails.com may choose to temporarily change the Fees Policy and the fees for Dinfokit services for promotional events. Such changes are effective when money-mails.com posts the temporary promotional event on the Site. money-mails.com may, at their sole discretion, change some or all of money-mails.com services at any time. In the event money-mails.com introduces a new service, the fees for that service are effective at the launch of the service.</Text>
              <Text style={styles.subHeading}>Fees and termination</Text>
              <Text style={styles.modalText}>If money-mails.com terminates a listing or your account, if you close your account, or if the payment of your money-mails.com fees cannot be completed for any reason, you remain obligated to pay money-mails.com for all unpaid fees plus any penalties, if applicable. If the seller’s account is not paid in full and becomes past due, the seller risks penalties such as the suspension of privileges and/or termination of the account and other collection mechanisms (including retaining collection agencies and legal counsel). If you have a question or wish to dispute a charge, contact money-mails.com.</Text>
              <Text style={styles.subHeading}>Listing and selling</Text>
              <Text style={styles.modalText}>By listing an item on the website, you warrant that you and all aspects of the item comply with money-mails.com published policies. You also warrant that you may legally sell the item. You must accurately describe your item and all terms of sale in your money-mails.com profile. Your listings may only include text descriptions, graphics, pictures and other content relevant to the sale of that item. All items must be listed in an appropriate category with appropriate tags. Each listing must accurately and completely describe the item/items for sale in that listing. If the “in stock” quantity is more than one, all items in that listing must be identical. Each unique item must have its own listing.</Text>
              <Text style={styles.subHeading}>Restricted activities:</Text>
              <Text style={styles.subHeading}>Your Content and your use of DINFOKIT INC shall not:</Text>
              <Text style={styles.modalText}>Be false, inaccurate or misleading Be fraudulent or involve the sale of illegal, counterfeit or stolen items Infringe upon any third-party’s copyright, patent, trademark, trade secret or other proprietary or intellectual property rights or rights of publicity or privacy Violate this Agreement, any site policy, or any applicable law, ordinance or regulation (including, but not limited to, those governing export control, consumer protection, unfair competition, anti-discrimination or false advertising) Furthermore, you may not list any item on DINFOKIT INC (or consummate any transaction that was initiated using DINFOKIT INC’s service) that, by paying to DINFOKIT INC the listing fee or the final value fee, could cause DINFOKIT INC to violate any applicable law, statute, ordinance or regulation, or that violates the Terms of Use.</Text>
              <Text style={styles.subHeading}>DPRICING POLICY</Text>
              <Text style={styles.modalText}>Please note that faith is the most important aspect of trade between buyers and sellers in a business place and one of the key aspects of faith is fair pricing. For healthy transaction flow at money-mails.com, we ask you to price your items responsibly and reasonably. Please note that we are constantly monitoring prices for each merchant at various channels and do not allow you to price your items at higher prices at money-mails.com vs. other channels such as your own retail store, your own Website (if any) or any other 3rd party retail stores or Websites. You should price your items sold at money-mails.com to be same as the lowest rate you are selling at elsewhere or even lower but it should not be more. Violation of our pricing policy will result into warning notices and can also result into account suspension and/or store suspension.</Text>
              <Text style={styles.subHeading}>BUYER PROTECTION</Text>
              <Text style={styles.modalText}>As an online market place, money-mails.com runs a very supportive Buyer security program so that buyer is totally protected dealing with money-mails.com. At money-mails.com, trust is the biggest thing for each dealing. To extend this trust to buyers, we offer Buyer security, which is based on four trust pillars i.e.</Text>
              <Text style={styles.subHeading}>Payment Security -</Text>
              <Text style={styles.modalText}>Your payment is not released to merchant unless you have received your item.</Text>
              <Text style={styles.subHeading}>Product Guarantee -</Text>
              <Text style={styles.modalContents}>All products sold at money-mails.com are new, 100% genuine and manufacturer warranty wherever applicable.</Text>
              <Text style={styles.subHeading}>Easy Replacement -</Text>
              <Text style={styles.modalText}>For wrong size, color, quantity, style, manufacturing, defects, damaged or significantly different from product listing.</Text>
              <Text style={styles.subHeading}>Reliable Merchants -</Text>
              <Text style={styles.modalText}>All the merchants go through a rigorous verification process before having their online store at money-mails.com.</Text>
              <Text style={styles.modalText}>All the merchants selling at money-mails.com are very well observed and then they are allowed to business on our site. We see to it that all the products you buy from our website are genuine, authentic, products being sold by well reputed and tested merchants at the best prices possible. Of course, we also offer all the warranties, guarantees as entailed by the product, all this at a great price and with the best customer service in the industry.</Text>
              <Text style={styles.modalText}>At money-mails.com, we believe that customer satisfaction is key- therefore we stand behind all merchandise bought at our site. We will replace any order within 7 days of delivery, with free return shipping if you receive a product which is not as per the specifications ordered by you:</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'black'}}>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5,color:'black'}}>Wrong color</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'black'}}>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5,color:'black'}}>Wrong size</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'black'}}>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5,color:'black'}}>Wrong style</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'black'}}>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5,color:'black'}}>Wrong quantity</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'black'}}>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5,color:'black'}}>Missing parts/accessories</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'black'}}>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5,color:'black'}}>Defective</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'black'}}>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5,color:'black'}}>Dead on arrival</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'black'}}>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5,color:'black'}}>Damaged</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color:'black'}}>{'\u2022'}</Text>
                <Text style={{flex: 1, paddingLeft: 5,color:'black'}}>Significantly different from the description given by the merchant</Text>
              </View>
              <Text style={styles.modalText}>However, do make sure that the product has not been used/worn or altered/tampered with, as well as is accompanied by its original price tag and packing slip. Please contact our customer care team, so we can help facilitate your return.</Text>
              <Text style={styles.modalText}>In case of pre-shipment delays, money-mails.com also offers you choice to cancel an order prior to its shipment by contacting us at Customer care team. Our trust policies define who we are and we promise the best online shopping experience to our customers.</Text>
              <Text style={styles.subHeading}>PROMO CODES AND OFFERS</Text>
              <Text style={styles.modalText}>Promo Codes and Offers are made at our sole discretion and are subject to time validity, a valid Promotional Code should be entered during the checkout process for a product to be valid. Attempting to add a promo code after purchase or after the expiration of the code will not be acknowledged.</Text>
              <Text style={styles.subHeading}>AGE OF CONSENT</Text>
              <Text style={styles.modalText}>By agreeing to these Terms of Use, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence. You may not use/access our products for any illegal or unauthorized purpose nor may you, in the use of the Service or online store, violate any laws in your jurisdiction (including but not limited to copyright laws). A breach or violation of any of the Terms will result in an immediate termination of your access to our products or services.</Text>
              <Text style={styles.subHeading}>SERVICE TERMS</Text>
              <Text style={styles.modalText}>money-mails.com at this moment grants the User a non-exclusive, non-transferable, limited right to access and use the Service, under the conditions of these Terms & Conditions and for the duration of the Agreement.</Text>
              <Text style={styles.modalText}>The use of the Service is at the User's own expense and risk. The User is responsible for meeting the technical and functional requirements and using the electronic communication facilities that are necessary to be able to access and use the Service. The User will at all times bear the risk of loss, theft or damage to any of its data.</Text>
              <Text style={styles.modalText}>money-mails.com will have the right (but not the obligation), at its sole discretion, to review, edit, limit, refuse or remove Content, products or to limit or refuse the User access to the Service. More specifically in the event the use of the Service, according to us, violates these Terms of Use.</Text>
              <Text style={styles.modalText}>We may disclose the User's Personal Data or Content, or other data relating to the use of the Service, to third parties where it believes, in good faith, that it is necessary to comply with a court order, ongoing judicial proceeding, criminal or civil subpoena, or other legal process or request by law enforcement authorities, or to exercise its constitutional rights of defense against legal claims.</Text>
              <Text style={styles.subHeading}>THIRD-PARTY LINKS</Text>
              <Text style={styles.modalText}>Certain content and services available via our website may include materials from third-parties. Third-party links on this site may direct you to third-party websites or applications that are not affiliated with us. money-mails.com is not responsible for examining or evaluating the content or accuracy of such website or application and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties. We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any third-party websites.</Text>
              <Text style={styles.modalText}>You’re obliged to review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.</Text>
              <Text style={styles.subHeading}>PERSONAL INFORMATION</Text>
              <Text style={styles.modalText}>Your submission of personal information through the store is regulated by our Privacy Policy. You are to view our <Pressable onPress={()=>{ Linking.openURL("https://moneymails.scienstechnologies.com/privacy")}}><Text style={{color:'#6495ED',marginTop:15}}>Privacy Policy</Text></Pressable>.</Text>
              




           </View>
           </ScrollView>
           <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
          </View>
        </View>
      </Modal>
      {/* Modal Code End */}
       
      <Button
                  btnText="submit"
                  variant="primary"
                  fontStrong
                  size="large"
                  overridingStyles={styles.sendBtn}
                  onPress={otpOnSubmit}
                />
      {/* <Button
        btnText={"submit"}
        variant="secondary"
        size="large"
        overridingStyles={styles.sendBtn}
        btnTextOverrideStyles={styles.sendBtnText}
        onPress={otpOnSubmit}
      /> */}
      {isVerify && <Toast message={!error ? 'Verification successfully done' : error} isOpen={true} />}
          
    </View>
  );
};

export default UserVerification;
