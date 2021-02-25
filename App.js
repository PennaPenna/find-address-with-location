import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, Button, TextInput, StatusBar, Dimensions } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';


export default function App() {
  const [location, setLocation]= useState(null);
  const [address, setAddress] = useState(''); 
  const apiKey='V0bFrAggtQNE8XoCG1a5Em0Pse4vfyLk';
  const [lat, setLat]= useState(63.0);  
  const [lng, setLng]= useState(23.0);  

  const getLocation= async ()   => {
    //Checkpermission
    let   { status } = await Location.requestPermissionsAsync();
    if (status!=='granted') {
      Alert.alert('No permission to access location');
    }
    else { 
      let location= await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLat(Number(location.coords.latitude));
    setLng(Number(location.coords.longitude));
    console.log(location.coords.latitude, location.coords.longitude);
  }
};

 useEffect(() => {
  getLocation();
}, []);


  const getAddress = async () => {
    const url = 'http://www.mapquestapi.com/geocoding/v1/address?key='+apiKey+'&location='+lat+','+lng;
    console.log(url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setAddress(data.results[0].locations[0].street +', '+ data.results[0].locations[0].adminArea5);
      console.log(address);
    }
    catch(error) {
      Alert.alert('Error' , error);
    }
  };

 

 const map = () => {
  state = { 
    region: {
     latitude: lat,
     longitude: lng,
     latitudeDelta: 0.32,
     longitudeDelta: 0.22,
  }
  };
  return (
 <MapView style={styles.mapStyle}
           region={state.region}>
             <Marker
            coordinate={{
              latitude:lat, 
              longitude: lng}}
              title={address}/>
          </MapView>   
   ) };

   return (
    <View  style={styles.container}>
 {map()}
<TextInput
        style={{fontSize: 14, width: 250, margin:10, borderWidth:1, padding:5}}
        value={address}
        placeholder="Address will appear here!"
      />
     <Button title="Find" onPress={getAddress}/>
     <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  margin:20,
  backgroundColor:'#F5F5F5',
 },
 mapStyle: { width: (Dimensions.get('window').width)/1.5, 
 height: (Dimensions.get('window').height)/2,},
});
