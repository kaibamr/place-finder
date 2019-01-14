import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { Icon } from 'react-native-elements';

import store from './store';
import MapScreen from './screens/MapScreen';
import DeckScreen from './screens/DeckScreen';
import SettingsScreen from './screens/SettingsScreen';
import ReviewScreen from './screens/ReviewScreen';

export default class App extends React.Component {
  render() {
    const MainNavigator = createBottomTabNavigator({
      main: {
        screen: createBottomTabNavigator({
          map: { screen: MapScreen },
          Miejsca: { screen: DeckScreen },
          review: {
            screen: createStackNavigator({
              review: { screen: ReviewScreen },
              settings: { screen: SettingsScreen }
            }),
            navigationOptions: ({ navigation }) => ({
              title: 'Polubione',
              tabBarIcon: ({ tintColor }) => {
                return <Icon name='thumb-up' size={30} color={tintColor} />;
              }
            })
          }
        }, {
          tabBarLabel: { fontSize: 12 }
        })
      }
    }, {
      navigationOptions: {
        tabBarVisible: false,
      },
      animationsAreEnabled: false
    });

    return (
      <Provider store={store}>
        <MainNavigator style={styles.container} />
      </Provider>
    );
  }
}

const styles = {
  container: {
    marginTop: Platform.OS === 'android' ? 24 : 0,
    flex: 1,
    backgroundColor: '#fff'
  }
};

