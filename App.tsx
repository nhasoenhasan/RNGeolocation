/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import * as turf from '@turf/turf';

const App = () => {
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState<any>();
  const [longitude, setLongitude] = useState<any>();

  // Sample data from a local GeoJSON asset or network API
  const countriesGeoJSON = require('./filtered_asean_countries_with_hk.json');

  // Function to check which country a point (latitude, longitude) belongs to
  function getCountryFromCoordinates(lat: number, long: number) {
    // Loop through all the countries in the GeoJSON data
    for (const feature of countriesGeoJSON.features) {
      const country = feature.properties.name;
      const coordinates = feature.geometry.coordinates;

      // Handle MultiPolygon geometries (countries that span multiple areas)
      if (feature.geometry.type === 'MultiPolygon') {
        for (const polygon of coordinates) {
          const countryPolygon = turf.polygon(polygon);
          const point = turf.point([long, lat]); // [longitude, latitude]

          // Check if the point is inside the current polygon
          if (turf.booleanPointInPolygon(point, countryPolygon)) {
            return country;
          }
        }
      } else if (feature.geometry.type === 'Polygon') {
        const countryPolygon = turf.polygon(coordinates);
        const point = turf.point([long, lat]); // [longitude, latitude]

        // Check if the point is inside the polygon
        if (turf.booleanPointInPolygon(point, countryPolygon)) {
          return country;
        }
      }
    }

    // If the point is not inside any polygon, return 'No country found'
    return 'No country found';
  }

  const handleCheckLocation = () => {
    const lat = latitude; // Example latitude for Hong Kong
    const long = longitude; // Example longitude for Hong Kong

    const result = getCountryFromCoordinates(lat, long);
    setCountry(result);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>The point is located in: {country}</Text>
      <TextInput
        value={latitude}
        placeholder="Latitude"
        onChangeText={text => setLatitude(text)}
        style={{
          borderWidth: 1,
          width: '80%',
          height: 50,
          padding: 5,
          marginBottom: 25,
          marginTop: 25,
        }}
      />
      <TextInput
        value={longitude}
        placeholder="Longitude"
        onChangeText={text => setLongitude(text)}
        style={{
          borderWidth: 1,
          width: '80%',
          height: 50,
          padding: 5,
          marginBottom: 10,
        }}
      />

      <Button title="Check Location" onPress={handleCheckLocation} />
      <Button title="Reset" onPress={() => setCountry('')} />
    </View>
  );
};

export default App;
