import React, { Component } from 'react';
import { View} from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import { clearLikedPlaces } from '../actions';

class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerStyle: {
      marginBottom: 0
    }
  });

  render() {
    return (
      <View>
        <View>
          <Button
            title="Zresetuj polubione miejsca"
            large
            icon={{ name: 'delete' }}
            backgroundColor="#F44336"
            buttonStyle={{ marginTop: 100, borderRadius: 10 }}
            onPress={() => {
              this.props.clearLikedJobs();
              this.props.navigation.navigate('review');
              this.props.navigation.navigate('map');
            }}
          />
        </View>
      </View>
    );
  }
}

export default connect(null, { clearLikedJobs: clearLikedPlaces })(SettingsScreen);