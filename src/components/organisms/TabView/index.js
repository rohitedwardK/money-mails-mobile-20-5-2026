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
import React, { useContext, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DeviceContext } from '../../../context/DeviceContext';
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
  const { tabBarColors } = getColors();
  const { screenWidth } = useContext(DeviceContext);
 
  // State to track the active tab index
  const [activeTabIndex, setActiveTabIndex] = useState(() => {
    const initialIndex = subCheck
      ? tabs.findIndex(item => item?.uuid === actTab)
      : tabs.findIndex(item => item?.mails_count > 0);
    return initialIndex >= 0 ? initialIndex : 0;
  });
 
  // Update active tab when actTab or tabs change
  useEffect(() => {
    const newIndex = subCheck
      ? tabs.findIndex(item => item?.uuid === actTab)
      : tabs.findIndex(item => item?.mails_count > 0);
    const validIndex = newIndex >= 0 ? newIndex : 0;
    setActiveTabIndex(validIndex);
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
    if (!activeTab) return [];
    return [
      { type: 'header', id: activeTab.uuid, title: `${activeTab.name} (${activeTab.mails_count})` },
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
   <ScrollView horizontal={true}>
     <View style={[styles.tabBar, ]}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.uuid}
          style={[
            styles.tabButton,
            activeTabIndex === index ? styles.activeTabButton : null,
            // { backgroundColor: activeTabIndex === index ? tabBarColors.indicatorColor : tabBarColors.inactiveColor },
          ]}
          onPress={() => handleTabPress(index)}
          {...tabHeaderProps}
        >
          <Text style={[
            styles.tabButtonText,
            // { color: activeTabIndex === index ? '#fff' : tabBarColors.textPrimary },
            { color: activeTabIndex === index ? tabBarColors.indicatorColor : tabBarColors.inactiveColor }
          ]}>
            {`${tab.name} (${tab.mails_count})`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
   </ScrollView>
  );
 
  return (
    <View style={styles.container}>
      {renderTabButtons()}
      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.flatListContent, tabContentBaseStyles]}
        scrollEnabled={true} // Rely on parent ScrollView for scrolling
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
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tabButton: {
 
    margin: 5,
 
  },
  activeTabButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  flatListContent: {
    // paddingHorizontal: 15,
    paddingBottom: 20,
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
    marginTop: 10,
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