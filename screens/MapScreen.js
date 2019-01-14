import React, { Component } from 'react';
import { Icon, Button } from 'react-native-elements';
import { MapView } from 'expo';
import { connect } from 'react-redux';
import { Location, Permissions } from 'expo';
import { fetchJobs, fetchPlaces, setPosition, placeCategory } from '../actions';
import { Animated, Dimensions, Picker, Platform, StyleSheet, TouchableWithoutFeedback, Text, View, ActivityIndicator, TouchableOpacity} from 'react-native';
const { width: WindowWidth } = Dimensions.get('window');

class MapScreen extends Component {
  static navigationOptions = {
    title: 'Mapa',
    tabBarIcon: ({tintColor}) => {
      return <Icon name="my-location" size={30} color={tintColor}/>;
    }
  };

  state = {
    mapLoaded: false,
    mapRegion: {
      longitude: 0,
      latitude: 0,
      longitudeDelta: 0.09,
      latitudeDelta: 0.09
    },
    hasLocationPermissions: false,
    loading: true,
    language: '',
    modalIsVisible: false,
    modalAnimatedValue: new Animated.Value(0),
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        loading: false
      });
    }, 2500);
    this._getLocationAsync();
  }

  _handleMapRegionChange = mapRegion => {
    this.setState({mapRegion});
  };

  _getLocationAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({hasLocationPermissions: true});
    }

    Location.watchPositionAsync({enableHighAccuracy: true, distanceInterval: 1}, (location) => {
      this.setState({
        mapRegion: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }
      });

      this.props.setPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
    });
  };

  _handlePressDone = () => {
    Animated.timing(this.state.modalAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalIsVisible: false });
    });

    this.props.fetchPlaces(this.state.mapRegion.latitude, this.state.mapRegion.longitude, this.state.language)
    .then(() => {
      setTimeout(() => {
        this.props.navigation.navigate('Miejsca', {
          categoryName: this.getCategoryName(this.state.language)
        });
      }, 300);
    });
  };

  getCategoryName(categoryName) {
    switch(categoryName) {
      case 'shopping_mall':
        return 'Centrum Handlowe'
      case 'bar':
        return 'Bary'
      case 'restaurant':
        return 'Restauracje'
      case 'supermarket':
        return 'Supermarkety'
    }
  }

  _handlePressClose = () => {
    Animated.timing(this.state.modalAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ modalIsVisible: false });
    });
  }

  _handlePressOpen = () => {
    if (this.state.modalIsVisible) {
      return;
    }

    this.setState({ modalIsVisible: true }, () => {
      Animated.timing(this.state.modalAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  render() {
   if (this.state.loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }} >
        <MapView
          style={{ flex: 1 }}
          initialRegion={this.state.mapRegion}
          onRegionChangeComplete={this._handleMapRegionChange}
          showsMyLocationButton={true}
          showsUserLocation={true}
        />
        <View style={styles.buttonContainer}>
          <Button
            large
            title="Wybierz typ miejsca i szukaj!"
            backgroundColor="#009688"
            buttonStyle={styles.toolbarButton}
            icon={{ name: 'search' }}
            onPress={this._handlePressOpen}
          />
          {this._maybeRenderModal()}
        </View>
      </View>
    );
  }

  _maybeRenderModal = () => {
    if (!this.state.modalIsVisible) {
      return null;
    }

    const { modalAnimatedValue } = this.state;
    const opacity = modalAnimatedValue;
    const translateY = modalAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });

    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this._handlePressDone}>
          <Animated.View style={[styles.overlay, { opacity }]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            position: 'absolute',
            bottom: -50,
            left: 0,
            transform: [{ translateY }],
          }}>
          <View style={styles.toolbar}>
            <View style={styles.toolbarLeft}>
              <Button title="Anuluj" buttonStyle={styles.toolbarButton} onPress={this._handlePressClose} />
            </View>
            <View style={styles.toolbarMiddle} />
            <View style={styles.toolbarRight}>
              <Button title="Szukaj" buttonStyle={styles.toolbarButton} onPress={this._handlePressDone} />
            </View>
          </View>
          <Picker
            style={{ width: WindowWidth, backgroundColor: '#e1e1e1' }}
            selectedValue={this.state.language}
            onValueChange={itemValue => this.setState({ language: itemValue })}>
            <Picker.Item label="Restauracje" value="restaurant" />
            <Picker.Item label="Bary" value="bar" />
            <Picker.Item label="Supermarket" value="supermarket" />
            <Picker.Item label="Centrum handlowe" value="shopping_mall" />
          </Picker>
        </Animated.View>
      </View>
    );
  };
}

const styles = {
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  toolbar: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row'
  },
  toolbarRight: {
    flex: 30
  },
  toolbarMiddle: {
    flex: 40
  },
  toolbarLeft: {
    flex: 30
  },
  toolbarButton: {
    borderRadius: 10
  }
};

export default connect(null, { fetchJobs, fetchPlaces, setPosition, placeCategory })(MapScreen);
