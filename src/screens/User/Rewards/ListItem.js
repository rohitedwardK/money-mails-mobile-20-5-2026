import React from 'react';
import {View} from 'react-native';

const ListItem = ({children, ...props}) => (
    <View ref={props.refView}>
    {children}
    </View>
);

export default ListItem;
