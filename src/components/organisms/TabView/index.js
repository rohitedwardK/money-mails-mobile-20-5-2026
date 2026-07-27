// import React, { useContext, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import { Text, View, ScrollView } from 'react-native';
// import { tabViewStyles } from './index.style';
// import { TabView as RNTabView, TabBar } from 'react-native-tab-view';
// import { DeviceContext } from '../../../context/DeviceContext';
// import getColors from '../../../utils/colors';
// // import { ScrollView } from 'react-native-gesture-handler';

// const TabContentBase = ({ tabContentBaseStyles, children }) => {
//   const styles = tabViewStyles();
//   return (
//     <View style={[styles.tabContentBase, tabContentBaseStyles]}>
//       {children}
//     </View>
//   );
// };

// const TabView = ({
//   tabs,
//   actTab,
//   subCheck,
//   tabContentBaseStyles,
//   tabHeaderProps,
//   tabHeaderWrapperStyles,
//   onTabChange,
//   renderActiveTabContent,
// }) => {
//   const styles = tabViewStyles();
//   const { tabBarColors } = getColors();
//   const { screenWidth } = useContext(DeviceContext);
//   const [tabsNavState, setTabsNavState] = useState({
//     index: tabs.findIndex(item => item?.mails_count > 0),
//     routes: tabs?.map(item => ({
//       key: item?._id || '',
//       title: item?.name + " (" + item.mails_count + ")",
//     })),
//   });

//   // useEffect(() => {
//   //   setTabsNavState({
//   //     index: tabs.findIndex(item => item?.mails_count > 0),
//   //     routes: tabs?.map(item => ({
//   //       key: item?._id || '',
//   //       title: item?.name + " (" + item.mails_count + ")",
//   //     })),
//   //   })
//   // }, [actTab])

//   useEffect(() => {
//   const newIndex = tabs.findIndex(item => item?.mails_count > 0);
//   const newIndex1 = tabs.findIndex(item => item?._id === actTab);

//   // if (newIndex !== tabsNavState.index) {
//     setTabsNavState(prevState => ({
//       ...prevState,
//       index: subCheck ? newIndex1 : newIndex,
//       routes: tabs.map(item => ({
//         key: item?._id || '',
//         title: `${item?.name} (${item.mails_count})`,
//       })),
//     }));
//   // }
// }, [actTab, tabs]); // Ensure it only updates when tabs or actTab changes

// const handleIndexChange = (index) => {
//   if (index !== tabsNavState.index) {
//     setTabsNavState(prevState => ({ ...prevState, index }));
//     onTabChange(index);
//   }
// };


//   const renderTabBar = props => {
//     return (
//       <View style={[styles.tabBar, tabHeaderWrapperStyles]}>
//         <ScrollView>
//           <TabBar
//             {...props}
//             indicatorStyle={styles.tabBarIndicator}
//             activeColor={tabBarColors.indicatorColor}
//             inactiveColor={tabBarColors.inactiveColor}
//             scrollEnabled
//             tabStyle={styles.tabItem}
//             labelStyle={styles.tabBarLabels}
//             style={styles.tabBarContainer}
//             {...tabHeaderProps}
//           />
//         </ScrollView>
//       </View>
//     );
//   };

//   const renderScene = ({ route, jumpTo }) => {
//     return (
//       <TabContentBase tabContentBaseStyles={tabContentBaseStyles}>
//         {renderActiveTabContent({ route, jumpTo })}
//       </TabContentBase>
//     );
//   };

//   // const handleIndexChange = index => {
//   //   setTabsNavState(prevState => ({ ...prevState, index }));
//   //   onTabChange(index);
//   // };

//   return (
//     <RNTabView
//       // navigationState={{
//       //   ...{
//       //     index: tabs.findIndex(item => item?.mails_count > 0),
//       //     routes: tabs?.map(item => ({
//       //       key: item?._id,
//       //       title: item?.name + " (" + item.mails_count + ")",
//       //     })),
//       //   }
//       // }}
//       navigationState={{ ...tabsNavState }}
//       renderTabBar={renderTabBar}
//       renderScene={renderScene}
//       onIndexChange={(event) => handleIndexChange(event)}
//       initialLayout={{ width: screenWidth }}
//     />
//   );
// };

// TabView.prototypes = {
//   tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
//   tabContentBaseStyles: PropTypes.object,
//   tabHeaderProps: PropTypes.object,
//   tabHeaderWrapperStyles: PropTypes.object,
//   onTabChange: PropTypes.func,
//   renderActiveTabContent: PropTypes.func.isRequired,
// };

// TabView.defaultProps = {
//   tabs: [],
//   tabContentBaseStyles: {},
//   tabHeaderProps: {},
//   tabHeaderWrapperStyles: {},
//   onTabChange: () => void 0,
//   renderActiveTabContent: () => '',
// };

// export default TabView;
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import getColors from '../../../utils/colors';

const TabView = ({
  tabs,
  actTab,
  subCheck,
  tabContentBaseStyles,
  tabHeaderProps,
  tabHeaderWrapperStyles,
  onTabChange,
  renderActiveTabContent,
}) => {
  const { themeColors: colors, tabBarColors } = getColors();

  // State to track the active tab index
  const [activeTabIndex, setActiveTabIndex] = useState(() => {
    const initialIndex = subCheck
      ? tabs.findIndex(item => item?.uuid === actTab)
      : tabs.findIndex(item => item?.isProfileTab) >= 0
        ? tabs.findIndex(item => item?.isProfileTab)
        : tabs.findIndex(item => item?.mails_count > 0);
    return initialIndex >= 0 ? initialIndex : 0;
  });

  // Keep the visible tab stable across data refreshes.
  useEffect(() => {
    setActiveTabIndex(previousIndex => {
      const activeTabIndexByUuid = tabs.findIndex(item => item?.uuid === actTab);
      if (activeTabIndexByUuid >= 0) {
        return activeTabIndexByUuid;
      }

      if (tabs[previousIndex]) {
        return previousIndex;
      }

      const profileTabIndex = tabs.findIndex(item => item?.isProfileTab);
      if (!subCheck && profileTabIndex >= 0) {
        return profileTabIndex;
      }

      const tabWithMailIndex = tabs.findIndex(item => item?.mails_count > 0);
      return tabWithMailIndex >= 0 ? tabWithMailIndex : 0;
    });
  }, [actTab, tabs, subCheck]);

  // Handle tab button press
  const handleTabPress = (index) => {
    if (index !== activeTabIndex) {
      setActiveTabIndex(index);
      onTabChange(index);
    }
  };

  // Prepare FlatList data: only show content for the active tab
  const flatListData = useMemo(() => {
    const activeTab = tabs[activeTabIndex];
    if (!activeTab) {return [];}
    return [
      { type: 'header', id: activeTab.uuid, title: activeTab.name },
      { type: 'content', id: `content-${activeTab.uuid}`, data: activeTab },
    ];
  }, [activeTabIndex, tabs]);

  // Render FlatList items
  const renderItem = ({ item }) => {
    if (item.type === 'header') {
      return (
        <></>
      );
    }
    return (
      <View style={[styles.contentContainer, tabContentBaseStyles]}>
        {renderActiveTabContent({ route: { key: item.id } })}
      </View>
    );
  };

  // Render tab buttons
  const renderTabButtons = () => (
   <View style={[
     styles.tabStrip,
     {
       backgroundColor: colors.homeBand || colors.surfacePrimary,
       borderColor: colors.borderSubtle,
     },
     tabHeaderWrapperStyles,
   ]}>
     <ScrollView
       horizontal
       showsHorizontalScrollIndicator={false}
       contentContainerStyle={styles.tabScrollContent}>
     <View style={styles.tabBar}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.uuid}
          activeOpacity={0.82}
          style={[
            styles.tabButton,
            activeTabIndex === index
              ? [styles.activeTabButton, {borderBottomColor: tabBarColors.activeColor}]
              : null,
          ]}
          onPress={() => handleTabPress(index)}
          {...tabHeaderProps}
        >
          <Text style={[
            styles.tabButtonText,
            { color: activeTabIndex === index ? tabBarColors.activeColor : tabBarColors.inactiveColor },
          ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
   </ScrollView>
   </View>
  );

  return (
    <View style={styles.container}>
      {renderTabButtons()}
      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        scrollEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No content available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabStrip: {
    borderTopWidth: 0,
    borderBottomWidth: 1,
  },
  tabScrollContent: {
    paddingHorizontal: 10,
  },
  tabButton: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabButton: {
  },
  tabButtonText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
  },
  flatListContent: {
    // paddingHorizontal: 15,
    paddingBottom: 0,
  },
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginVertical: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  contentContainer: {
    width: '100%',
    marginTop: 0,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

TabView.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.shape({
    uuid: PropTypes.string,
    name: PropTypes.string,
    mails_count: PropTypes.number,
  })).isRequired,
  actTab: PropTypes.string,
  subCheck: PropTypes.bool,
  tabContentBaseStyles: PropTypes.object,
  tabHeaderProps: PropTypes.object,
  tabHeaderWrapperStyles: PropTypes.object,
  onTabChange: PropTypes.func,
  renderActiveTabContent: PropTypes.func.isRequired,
};

TabView.defaultProps = {
  tabs: [],
  actTab: '',
  subCheck: false,
  tabContentBaseStyles: {},
  tabHeaderProps: {},
  tabHeaderWrapperStyles: {},
  onTabChange: () => {},
  renderActiveTabContent: () => null,
};

export default TabView;
