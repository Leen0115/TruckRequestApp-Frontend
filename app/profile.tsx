import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const router = useRouter();
  const i18n = require('./i18n').default;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch('http://192.168.8.73:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const handleSaveChanges = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://192.168.8.73:8000/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(i18n.t('data_saved'), '', [
          {
            text: i18n.t('ok'),
            onPress: () => router.push('./trckRequest'),
          },
        ]);
      } else {
        Alert.alert(i18n.t('saved_failed'), data.message);
      }
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('server_error'));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Vector.png')} style={styles.backgroundImage} />
      <Text style={styles.mainText1}>{i18n.t('profile_title')}</Text>

      <View style={styles.editTitleWrapper}>
        <LottieView
          source={require('../assets/images/Edit.json')}
          style={styles.lottieIcon}
        />
        <Text style={styles.mainText2}>{i18n.t('edit_title')}</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder={i18n.t('name')}
          placeholderTextColor="#828282"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('email')}
          placeholderTextColor="#828282"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('password')}
          placeholderTextColor="#828282"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('confirm_password')}
          placeholderTextColor="#828282"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleSaveChanges}>
          <Text style={styles.buttonText}>{i18n.t('save_button')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1, 
  alignItems: 'center', 
  backgroundColor: '#fff', 
  position: 'relative' },
backgroundImage: { 
  position: 'absolute', 
  top: 0, 
  left: 0, 
  width: '100%', 
  height: '50%' },
mainText1: { 
  fontSize: 50, 
  fontWeight: 'bold', 
  color: '#fff', 
  marginTop: 90 },
editTitleWrapper: { 
  flexDirection: 'row', 
  alignItems: 'center', 
  marginTop: 260 },
lottieIcon: { 
  width: 30, 
  height: 30, 
  marginRight: 8 },
mainText2: { 
  fontSize: 22, 
  fontWeight: 'bold', 
  color: '#5D437E' },
formContainer: { 
  width: '100%', 
  alignItems: 'center', 
  marginTop: -150 },
input: {
  width: '90%', 
  height: 53, 
  borderColor: '#828282', 
  borderWidth: 1,
  borderRadius: 12, 
  paddingHorizontal: 5, 
  marginBottom: 10, 
  top: 170},
button: {
  backgroundColor: '#5D437E', 
  paddingHorizontal: 120, 
  paddingVertical: 12,
  borderRadius: 10, 
  top: 180},
buttonText: { 
  color: '#fff', 
  fontSize: 16, 
  fontWeight: 'bold' }
});