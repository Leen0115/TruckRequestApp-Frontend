import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert, FlatList, Image, Keyboard, KeyboardAvoidingView, Modal, StyleSheet, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, View
} from 'react-native';

export default function TruckRequest() {
  const router = useRouter();
  const i18n = require('./i18n').default;
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [truckType, setTruckType] = useState('');
  const [weight, setWeight] = useState('');
  const [note, setNote] = useState('');
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showDeliveryPicker, setShowDeliveryPicker] = useState(false);
  const [isTruckTypeVisible, setIsTruckTypeVisible] = useState(false);
  const [showPickupCities, setShowPickupLocations] = useState(false);
  const [showDropoffCities, setShowDropoffLocations] = useState(false);
  const [cargoType, setCargoType] = useState('');
  const [showCargoTypes, setShowCargoTypes] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
const [editOrderId, setEditOrderId] = useState(null);

    useEffect(() => {
  const loadEditData = async () => {
    setIsEdit(true);
    const stored = await AsyncStorage.getItem('editOrder');
    if (stored) {
      const order = JSON.parse(stored);
      setPickupLocation(order.pickup_location || '');
      setDropoffLocation(order.dropoff_location || '');
      setPickupTime(order.pickup_time || '');
      setDeliveryTime(order.delivery_time || '');
      setTruckType(order.truck_type || '');
      setWeight(order.weight?.toString()||'');
      setCargoType(order.cargo_type || '');
      setNote(order.note || '');
    }
  };
  loadEditData();
}, []);
useFocusEffect(
  React.useCallback(() => {
    const loadEditOrder = async () => {
      const orderJSON = await AsyncStorage.getItem('editOrder');
      if (orderJSON) {
        const order = JSON.parse(orderJSON);
        setIsEdit(true);
        setEditOrderId(order.id);
        setPickupLocation(order.pickup_location);
        setDropoffLocation(order.dropoff_location);
        setPickupTime(order.pickup_time);
        setDeliveryTime(order.delivery_time);
        setTruckType(order.truck_type);
        setWeight(order.weight?.toString()||'');
        setCargoType(order.cargo_type);
        setNote(order.note || '');
      } else {
        setIsEdit(false);
        setEditOrderId(null);
      }
    };

    loadEditOrder();
    return () => {
      AsyncStorage.removeItem('editOrder');
    };
  }, [])
);

  const truckOptions = [
    { label: i18n.t('truckType.trailer_short_sides'), value: 'Trailer Short Sides' },
    { label: i18n.t('truckType.trailer_high_sides'), value: 'Trailer High Sides' },
    { label: i18n.t('truckType.trailer_curtain'), value: 'Trailer Curtain' },
    { label: i18n.t('truckType.trailer'), value: 'Trailer' },
];

  const Locations = [
    { label: i18n.t('cities.riyadh'), value: 'Riyadh' },
    { label: i18n.t('cities.jeddah'), value: 'Jeddah' },
    { label: i18n.t('cities.mecca'), value: 'Mecca' },
    { label: i18n.t('cities.medina'), value: 'Medina' },
    { label: i18n.t('cities.dammam'), value: 'Dammam' },
    { label: i18n.t('cities.khobar'), value: 'Khobar' },
    { label: i18n.t('cities.tabuk'), value: 'Tabuk' },
    { label: i18n.t('cities.abha'), value: 'Abha' },
    { label: i18n.t('cities.buraidah'), value: 'Buraidah' },
    { label: i18n.t('cities.hail'), value: 'Hail' },
  ];

  const cargoOptions = [
    { label: i18n.t('cargo.food_items'), value: 'Food Items' },
    { label: i18n.t('cargo.dry_fmcg'), value: 'Dry Fast-Moving Consume' },
    { label: i18n.t('cargo.dairy'), value: 'Dairy' },
    { label: i18n.t('cargo.oils'), value: 'Oils' },
  ];

  const handleSendRequest = async () => {
    Keyboard.dismiss();
    if (!pickupLocation||!truckType || !weight||!pickupTime || !deliveryTime || !dropoffLocation|| !cargoType) {
      Alert.alert('Please fill in all required fields');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const url = isEdit
  ? `http://172.20.10.2:8000/api/truck-requests/${editOrderId}/update`
  : 'http://172.20.10.2:8000/api/truck-requests';

const method = isEdit ? 'PUT' : 'POST';

const response = await fetch(url, {
  method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          pickup_time: pickupTime,
          delivery_time: deliveryTime,
          truck_type: truckType,
          weight: weight,
          cargo_type: cargoType,
          note,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push('/success');
        if (isEdit) {
  await AsyncStorage.removeItem('editOrder');
}
      } else {
        Alert.alert('Error');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to connect to server');
    }
  };
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setShowAccountOptions(false);
    router.push('/login'); 
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.lottieIcons}>
            <Text style={styles.title}>{isEdit ? i18n.t('edit_order') : i18n.t('request_title')}</Text>
            <TouchableOpacity onPress={() => setShowAccountOptions(!showAccountOptions)}>
  <LottieView source={require('../assets/images/Person.json')} style={styles.PersonIcon} />
{showAccountOptions && (
  <View style={styles.dropdownMenu}>
    <TouchableOpacity onPress={() => {
      setShowAccountOptions(false);
      router.push('/dashboard');
    }}>
      <Text style={styles.menuItem}>{i18n.t('my_orders')}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => {
      setShowAccountOptions(false);
      router.push('./profile');
    }}>
      <Text style={styles.menuItem}>{i18n.t('profile')}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleLogout}>
      <Text style={[styles.menuItem, { color: 'red' }]}>{i18n.t('logout')}</Text>
    </TouchableOpacity>
  </View>
)}
</TouchableOpacity>

          </View>
          <Text style={styles.label}>{i18n.t('pickup_location')}</Text>
<TouchableOpacity style={styles.dropdownBox} onPress={() => setShowPickupLocations(true)}>
  <Text style={{ color: pickupLocation ? '#000' : '#999',  }}>
  {pickupLocation
  ? i18n.t(`cities.${pickupLocation.toLowerCase()}`)
  : i18n.t('select_pickup_location')}
  </Text>
</TouchableOpacity>
          <Modal transparent visible={showPickupCities} animationType="fade" onRequestClose={() => setShowPickupLocations(false)}>
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowPickupLocations(false)}>
              <View style={styles.modalContent}>
                <FlatList
                  data={Locations}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => {
                        setPickupLocation(item.value);
                        setShowPickupLocations(false);
                      }}>
                      <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <Text style={styles.label}>{i18n.t('dropoff_location')}</Text>
<TouchableOpacity style={styles.dropdownBox} onPress={() => setShowDropoffLocations(true)}>
  <Text style={{ color: dropoffLocation ? '#000' : '#999'}}>
  {dropoffLocation
  ? i18n.t(`cities.${dropoffLocation.toLowerCase()}`)
  : i18n.t('select_dropoff_location')}
  </Text>
</TouchableOpacity>
          <Modal transparent visible={showDropoffCities} animationType="fade" onRequestClose={() => setShowDropoffLocations(false)}>
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowDropoffLocations(false)}>
              <View style={styles.modalContent}>
                <FlatList
                  data={Locations}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.optionItem}
                      onPress={() => {
                        setDropoffLocation(item.value);
                        setShowDropoffLocations(false);
                      }}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          <View style={styles.row}>
  <View style={styles.halfInputWrapper}>
    <Text style={styles.label}>{i18n.t('pickup_time')}</Text>
    <TouchableOpacity
      style={styles.dropdownBox}
      onPress={() => setShowPickupPicker(true)}
    >
      <Text style={{ color: pickupTime ? '#000' : '#999'}}>
        {pickupTime || i18n.t('select_time')}
      </Text>
    </TouchableOpacity>
    {showPickupPicker && (
      <DateTimePicker
        value={new Date()}
        mode="time"
        display="default"
        onChange={(event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            const formatted = selectedDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            setPickupTime(formatted);
          }
          setShowPickupPicker(false);
        }}
      />
    )}
  </View>

  <View style={styles.halfInputWrapper}>
    <Text style={styles.label}>{i18n.t('delivery_time')}</Text>
    <TouchableOpacity
      style={styles.dropdownBox}
      onPress={() => setShowDeliveryPicker(true)}
    >
      <Text style={{ color: deliveryTime ? '#000' : '#999'}}>
        {deliveryTime || i18n.t('select_time')}
      </Text>
    </TouchableOpacity>
    {showDeliveryPicker && (
      <DateTimePicker
        value={new Date()}
        mode="time"
        display="default"
        onChange={(event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            const formatted = selectedDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            setDeliveryTime(formatted);
          }
          setShowDeliveryPicker(false);
        }}
      />
    )}
  </View>
</View>

          <View style={styles.row}>
            <View style={styles.halfInputWrapper}>
            <Text style={styles.label}>{i18n.t('truck_type')}</Text>
<TouchableOpacity style={styles.dropdownBox} onPress={() => setIsTruckTypeVisible(true)}>
  <Text style={{ color: truckType ? '#000' : '#999' }}>
  {truckOptions.find(option => option.value.toLowerCase() === truckType?.toLowerCase())?.label || i18n.t('select_type')}
</Text>
</TouchableOpacity>
              <Modal transparent visible={isTruckTypeVisible} animationType="fade" onRequestClose={() => setIsTruckTypeVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setIsTruckTypeVisible(false)}>
                  <View style={styles.modalContent}>
                    <FlatList
                      data={truckOptions}
                      keyExtractor={(item) => item.value}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.optionItem}
                          onPress={() => {
                            setTruckType(item.value);
                            setIsTruckTypeVisible(false);
                          }}
                        >
                          <Text style={styles.optionText}>{item.label}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>

            <View style={styles.halfInputWrapper}>
            <Text style={styles.label}>{i18n.t('weight')}</Text>
<TextInput
  style={styles.input}
  placeholder={i18n.t('enter_weight')}
  placeholderTextColor="#999"
  keyboardType="numeric"
  value={weight}
  onChangeText={setWeight}
/>
            </View>
          </View>
          <Text style={styles.label}>{i18n.t('cargo_type')}</Text>
<TouchableOpacity style={styles.dropdownBox} onPress={() => setShowCargoTypes(true)}>
<Text style={{ color: cargoType ? '#000' : '#999'}}>
  {cargoType ? i18n.t(`cargo.${cargoType}`) : i18n.t('select_cargo')}
</Text>
</TouchableOpacity>

<Modal transparent visible={showCargoTypes} animationType="fade" onRequestClose={() => setShowCargoTypes(false)}>
  <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowCargoTypes(false)}>
    <View style={styles.modalContent}>
      <FlatList
        data={cargoOptions}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.optionItem}
            onPress={() => {
              setCargoType(item.value);
              setShowCargoTypes(false);
            }}
          >
            <Text style={styles.optionText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  </TouchableOpacity>
</Modal>
<Text style={styles.label}>{i18n.t('note')}</Text>
<TextInput
  style={[styles.input, { height: 100}]}
  placeholder={i18n.t('additional_notes')}
  multiline
  value={note}
  onChangeText={setNote}
/>
<TouchableOpacity style={styles.button} onPress={handleSendRequest}>
  <Text style={styles.buttonText}>
  {isEdit ? i18n.t('update_order') : i18n.t('send_request')}
</Text>
</TouchableOpacity>
          <Image source={require('../assets/images/Vector2.png')} style={styles.backgroundImage} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 100,
    paddingBottom: 160,
    backgroundColor: '#fff',
    position: 'relative',
  },
  lottieIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 25,
    right: 20,
    zIndex: 10,
  },
  PersonIcon: {
    width: 29,
    height: 29,
    marginLeft: 4,
    marginTop: 5,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40, 
    right: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    elevation: 5,
    padding: 10,
    zIndex: 999,
    minWidth: 160,
  },
  menuItem: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  logoutBox: {
    position: 'absolute',
    top: 75,
    right: 25,
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    zIndex: 11,
  },
  logoutText: {
    color: '#F01E1E',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 190,
    marginTop: 7,
  },
  label: {
    fontSize: 14,
    marginBottom: 1,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    height: 40,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputWrapper: {
    flex: 0.48,
  },
  dropdownBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 12,
    height: 40,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: '70%',
    elevation: 5,
  },
  optionItem: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#5D437E',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    zIndex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backgroundImage: {
    width: 500,
    height: 300,
    left: 0,
    top: 0,
    position: 'absolute',
    marginTop: 540,
  },

});
