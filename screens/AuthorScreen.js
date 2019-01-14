import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button } from 'react-native-elements';

class AuthorScreen extends Component {
    static navigationOptions = {
        title: 'Autor',
        tabBarIcon: ({tintColor}) => {
          return <Icon name="person" size={30} color={tintColor}/>;
        }
      };

  render() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
            <Text style={{ fontSize: 20 }}>
                Autor: Wojciech Mrózek
            </Text>
        </View>
    );
  }
}

export default connect(null, null)(AuthorScreen);