import React, {useContext, useState} from 'react';
import {View, Text} from 'react-native';
import {DeviceContext} from '../../../context/DeviceContext';

const Grid = ({
  dir = 'row',
  justify = 'flex-start',
  items = 'center',
  gap = 16,
  gapY,
  containerStyles = {},
  children,
  wrap = false,
  squareChildren,
  columnsPerRow = 1,
}) => {
  const [onLayoutStyles, setOnLayoutStyles] = useState({
    marginRight: gap,
    marginBottom: gapY || gap,
    height: 0,
    width: `${100 / columnsPerRow}%`,
  });

  const [containerWidth, setContainerWidth] = useState(0);

  const {isIos} = useContext(DeviceContext);

  let styles = {
    paddingRight: gap,
    flex: 1,
  };

  if (dir !== 'row') {
    styles = {
      paddingBottom: gap,
      width: '100%',
    };
  }

  if (wrap) {
    styles = {
      marginRight: onLayoutStyles.marginRight,
      marginBottom: onLayoutStyles.marginBottom,
      width: onLayoutStyles.width,
    };

    if (squareChildren) {
      styles.height = onLayoutStyles.height;
    }
  }

  return (
    <View
      onLayout={event => {
        const {width} = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
      style={{
        display: 'flex',
        flexDirection: dir,
        justifyContent: justify,
        alignItems: items,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        opacity: wrap ? (onLayoutStyles.isSetOnLayout ? 1 : 0) : 1,
        ...containerStyles,
      }}>
      {children.map((child, index) => (
        <View
          key={index}
          onLayout={event => {
            let {width} = event.nativeEvent.layout;
            if (containerWidth) {
              width = containerWidth / columnsPerRow;
            }
            const isLastItem = (index + 1) % columnsPerRow === 0;

            if (squareChildren && !onLayoutStyles.isSetOnLayout) {
              let itemHeight = isLastItem ? width : width - gap;
              let itemWidth = isLastItem ? width : width - gap;
              if (isIos) {
                itemHeight = itemHeight - 1;
                itemWidth = itemWidth - 1;
              }
              setOnLayoutStyles({
                marginRight: gap,
                marginBottom: gapY || gap,
                height: itemHeight,
                width: itemWidth,
                isSetOnLayout: true,
              });
            }
          }}
          style={[
            styles,
            index === children.length - 1
              ? {
                  marginRight: 0,
                  marginBottom: 0,
                }
              : {},
          ]}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default Grid;
