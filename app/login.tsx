import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import i18n from './i18n';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginRequest = async () => {
    try {
      const response = await fetch('http://192.168.8.51:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', String(data.token));
        console.log('Saved token:', data.token);
        Alert.alert(i18n.t('login_success'));
        router.push('./truckRequest');
      } else {
        Alert.alert(i18n.t('login_failed'), data.message || i18n.t('invalid_credentials'));
      }
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('server_error'));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Vector.png')} style={styles.backgroundImage} />
      <Text style={styles.mainText}>{i18n.t('login_title')}</Text>

      <View style={styles.formContainer}>
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
          secureTextEntry
          placeholderTextColor="#828282"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={loginRequest}>
          <Text style={styles.buttonText}>{i18n.t('login_button')}</Text>
        </TouchableOpacity>

        <View style={styles.signupRow}>
          <Text style={styles.signupText1}>
            {i18n.t('no_account').replace('{signup}', '')}
            <Text style={styles.signupText2} onPress={() => router.push('/register')}>
              {i18n.t('signup')}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingTop: 0,
    position: 'relative',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  backgroundImage: {
    position: 'absolute',
    paddingBottom: 30,
    top: 0,
    left: 0,
    width: '100%',
    height: '50%',},
  mainText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 90,},
  input: {
    width: '90%',
    height: 53,
    borderColor: '#828282',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 5,
    marginBottom: 10,
    top: 170,},
  button: {
    backgroundColor: '#5D437E',
    paddingHorizontal: 120,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    top: 180,},
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',},
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 220,},
  signupText1: {
    fontSize: 16,
    color: '#000',},
  signupText2: {
    fontSize: 16,
    color: '#4A91D0',
    fontWeight: 'bold',},
});