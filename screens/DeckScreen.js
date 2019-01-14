import React, { Component } from 'react';
import { View, Text, Platform, ActivityIndicator, Image} from 'react-native';
import { connect } from 'react-redux';
import { MapView } from 'expo';
import { Card, Button, Icon } from 'react-native-elements';
import Swipe from '../components/Swipe';
import { likePlace } from '../actions';

class DeckScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('categoryName', 'Miejsca'),
      tabBarIcon:  ({ tintColor }) => {
        return <Icon name="description" size={30} color={tintColor} />
      }
    }
  };

  renderCard(place) {
    const initialRegion = {
      longitude: Number(place.geometry.location.lng),
      latitude: Number(place.geometry.location.lat),
      latitudeDelta: 0.0005,
      longitudeDelta: 0.0005
    }

    return (
      <Card title={place.name}>
        <View style={{ height: 300 }}>
          <MapView
            scrollEnabled={false}
            style={{ flex: 1 }}
            cacheEnabled={Platform.OS === 'android'}
            initialRegion={initialRegion}
          >
           
          </MapView>
        </View>
        <View style={styles.detailWrapper}>
          {place.rating ? <Text>Ocena: {place.rating}</Text> : <Text> </Text> }
          <Text>Odległość: {this.distance(initialRegion.latitude, initialRegion.longitude, this.props.geo.latitude, this.props.geo.longitude)} metrów</Text>
          <Image source={{ uri: place.icon }} style={{ width: 15, height: 15 }} />
        </View>    
      </Card>
    );
  }

  distance(lat1, lon1, lat2, lon2) {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat2 - lat1) * p) / 2 +
      c(lat1 * p) * c(lat2 * p) *
      (1 - c((lon2 - lon1) * p)) / 2;
    return Math.round((12742 * Math.asin(Math.sqrt(a))) * 1000); // 2 * R; R = 6371 km
  }

  renderNoMoreCards = () => {
    return (
      <Card title={'Brak wyników'}>
        <Button
          title="Powrót do mapy"
          large
          icon={{ name: 'my-location' }}
          backgroundColor="#03A9F4"
          onPress={() => this.props.navigation.navigate('map')}
        />
      </Card>
    );
  }

  render() {
    if(this.props.places.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (this.props.places && this.props.places.data && this.props.places.data.length > 0) {
      return (
        <View style={{ marginTop: 35 }}>
          <Swipe
            data={this.props.places.data}
            renderCard={this.renderCard.bind(this)}
            renderNoMoreCards={this.renderNoMoreCards}
            keyProp="id"
            onSwipeRight={job => this.props.likePlace(job)}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.noPlaces}>
          <Card title='Brak danych'>
            <Text>Wróć do mapy i kliknij aby znaleźć wymarzone miejsce!</Text>
          </Card>
        </View>
      );
    }
  }
}

const styles = {
  detailWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    marginTop: 10
  },
  noPlaces: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
}

function mapStateToProps({ places, geo }) {
  return { places, geo };
}

export default connect(mapStateToProps, { likePlace })(DeckScreen);
