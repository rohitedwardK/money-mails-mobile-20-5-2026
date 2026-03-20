import React, {createContext, useContext, useState} from 'react';
import {BlurView} from '@react-native-community/blur';
import Dialog from '../../components/organisms/Dialog';
import {Provider} from 'react-native-paper';
import {modalContextStyles} from './index.style';
import {View} from 'react-native';
import {DeviceContext} from '../DeviceContext';

const TransparentContainer = ({modalDetails}) => {
  const {isAndroid} = useContext(DeviceContext);
  const styles = modalContextStyles({isAndroid});

  if (!modalDetails?.isOpen) {
    return null;
  }
  const Component = isAndroid ? View : BlurView;

  return (
    <Component
      style={[
        styles.modalContainer,
        modalDetails?.modalStyles?.containerStyles,
      ]}>
      <View
        style={[styles.modalContent, modalDetails?.modalStyles?.contentStyles]}>
        {modalDetails?.modalContent}
      </View>
    </Component>
  );
};

export const ModalContext = createContext();

const ModalContextProvider = ({children}) => {
  const [modalDetails, setModalDetails] = useState({
    modalType: 'dialog',
    isOpen: false,
    modalContent: null,
    modalStyles: {},
    actions: [],
  });

  const value = {
    setModalDetails,
  };

  return (
    <Provider>
      <ModalContext.Provider value={value}>
        {children}
        {modalDetails.modalType === 'dialog' ? (
          <Dialog
            content={modalDetails?.modalContent}
            open={modalDetails?.isOpen}
            containerStyles={modalDetails?.modalStyles?.containerStyles}
            contentStyles={modalDetails?.modalStyles?.contentStyles}
            actions={modalDetails?.actions}
            onDismiss={modalDetails?.onClose && modalDetails?.onClose()}
          />
        ) : (
          <TransparentContainer modalDetails={modalDetails} />
        )}
      </ModalContext.Provider>
    </Provider>
  );
};

export default ModalContextProvider;
