import React from 'react';
import {Dialog, Portal} from 'react-native-paper';
import Button from '../../atoms/Button';
import {modalStyles} from './index.style';

const ModalDialog = ({
  open = false,
  containerStyles = {},
  contentStyles = {},
  actions = [],
  content = null,
  onDismiss,
}) => {
  const styles = modalStyles();

  return (
    <Portal>
      <Dialog
        visible={open}
        style={[styles.modalContainer, containerStyles]}
        onDismiss={onDismiss}>
        <Dialog.Content style={[contentStyles]}>{content}</Dialog.Content>
        {actions.length > 0 && (
          <Dialog.Actions>
            {actions.map(item => (
              <Button
                key={item.name}
                btnText={item?.name}
                variant={item.variant}
                onClick={item.onClick}
                overridingStyles={item.styles || {}}
              />
            ))}
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
};

export default ModalDialog;
