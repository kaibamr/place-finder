import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { ScrollView, Text, View, Linking, ActivityIndicator, Image } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { MapView } from 'expo';

class ReviewScreen extends Component {
  state = {
    loadingPhoto: true
  }
  static navigationOptions = ({ navigation }) => {
    return ({
      headerTitle: 'Polubione miejsca',
      headerRight: (
        <Button
          title="Ustawienia"
          onPress={() => { navigation.navigate('settings'); }}
          backgroundColor="rgba(0,0,0,0)"
          color="rgba(0, 122, 255, 1)"
        />
      )
    });
  }

  renderLikedJobs() {
    const sortedPlaces = _.sortBy(this.props.likedPlaces, o => o.rating ? o.rating : 0).reverse();
    return sortedPlaces.map(place => {
      const latLng = `${place.geometry.location.lat},${place.geometry.location.lng}`;
      const url = `maps:0,0q=${latLng}`;

      const initialRegion = {
        latitude: Number(place.geometry.location.lat),
        longitude: Number(place.geometry.location.lng),
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005
      };
      
      return (
      
        <Card title={place.name} key={place.id}>
          <View style={{ height: 200 }}>
            <MapView
                style={{ flex: 1, marginBottom: 10}}
                scrollEnabled={false}
                initialRegion={initialRegion}
            >
              <MapView.Marker coordinate={initialRegion} />
            </MapView>
            <View style={styles.detailWrapper}>
              {place.rating ? <Text>Ocena: {place.rating}</Text> : <Text>Ocena: brak</Text> }
              <Image source={{ uri: place.icon }} style={{ width: 15, height: 15 }} />
            </View>    
            <Button
              title="Nawiguj mnie!"
              backgroundColor="#03A9F4"
              buttonStyle={{ borderRadius: 10 }}
              onPress={() => Linking.openURL(`maps://app?saddr=${this.props.geo.latitude}+${this.props.geo.longitude}&daddr=${place.geometry.location.lat}+${place.geometry.location.lng}`)}
            ></Button>
          </View>
        </Card>
      );
    });
  }

  renderNoLikedJobs() {
    return (
      <View style={styles.noLikedJobs}>
        <Card title='Brak polubionych miejsc'>
          <Text>Wróć do mapy lub wyszukanych miejsc w menu</Text>
        </Card>
      </View>
    );
  }

  render() {
    return (
      <ScrollView>
        {this.props.likedPlaces.length === 0 ? this.renderNoLikedJobs() : this.renderLikedJobs()}
      </ScrollView>
    );
  }
}

const styles = {
  detailWrapper: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  italics: {
    fontStyle: 'italic'
  },
  noLikedJobs: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

function mapStateToProps({ likedPlaces, geo, places }) {
  return { likedPlaces, geo, places };
}

export default connect(mapStateToProps, null)(ReviewScreen);

