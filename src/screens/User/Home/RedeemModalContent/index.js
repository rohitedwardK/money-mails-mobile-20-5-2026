import React from 'react';
import {Text, View} from 'react-native';
import Button from '../../../../components/atoms/Button';

const RedeemModalContent = ({points, totalAmount, onActionClick}) => {
  return (
    <View
      style={{
        maxWidth: '98%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          fontSize: 22,
          color: '#47CACC',
        }}>
        Congratulations!
      </Text>
      <View
        style={{
          width : 'auto',
          height : 'auto',
        }}>
          <Text style={{
            color : 'green',
            flexWrap: 'wrap',
            fontSize : 20,
            margin : 10,
            }}>{points}</Text>
      </View>
      <View
        style={{
          borderTopWidth: 1,
          borderColor: '#E0ECDE',
          paddingTop: 30,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}>
        <View>
          <Text
            style={{
              fontSize: 12,
              color: '#205072',
              opacity: 0.34,
            }}>
            Your Rewards
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: '#205072',
              marginVertical: 3,
            }}>
            {`${totalAmount}`}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#205072',
              opacity: 0.34,
            }}>
            Points
          </Text>
        </View>
        <Button
          btnText="back"
          overridingStyles={{
            backgroundColor: '#205072',
            borderRadius: 30,
            maxWidth: 120,
            marginLeft: 'auto',
          }}
          onPress={onActionClick}
        />
      </View>
    </View>
  );
};

export default RedeemModalContent;
