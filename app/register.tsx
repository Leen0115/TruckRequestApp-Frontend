import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Register() {
  const router = useRouter();
  const i18n = require('./i18n').default;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fullText = i18n.t('have_account_full');
  const parts = fullText.split('<login>');

  const RegisterRequest = async () => {
    if (password !== confirmPassword) {
      Alert.alert(i18n.t('error'), i18n.t('password_mismatch'));
      return;
    }
    try {
      const response = await fetch('http://192.168.8.51:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
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
        Alert.alert(i18n.t('register_success'));
        router.push('/login');
      } else {
        Alert.alert(i18n.t('register_failed'), data.message);
      }
    } catch (error) {
      Alert.alert(i18n.t('error'), i18n.t('server_error'));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Vector.png')} style={styles.backgroundImage} />
      <Text style={styles.mainText}>{i18n.t('signup_title')}</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input]}
          placeholder={i18n.t('name')}
          placeholderTextColor="#828282"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input]}
          placeholder={i18n.t('email')}
          placeholderTextColor="#828282"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={[styles.input]}
          placeholder={i18n.t('password')}
          placeholderTextColor="#828282"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={[styles.input]}
          placeholder={i18n.t('confirm_password')}
          placeholderTextColor="#828282"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={RegisterRequest}>
          <Text style={styles.buttonText}>{i18n.t('signup_button')}</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText1}>
            {parts[0]}
            <Text style={styles.loginText2} onPress={() => router.push('/login')}>
              {i18n.t('login_link')}
            </Text>
            {parts[1]}
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
    marginTop: 120,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '50%',
  },
  mainText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 90,
  },
  input: {
    width: '90%',
    height: 48,
    borderColor: '#828282',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 5,
    marginBottom: 7,
    top: 160,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#5D437E',
    paddingHorizontal: 120,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    top: 155,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 190,
  },
  loginText1: {
    fontSize: 16,
    color: '#000',
  },
  loginText2: {
    fontSize: 16,
    color: '#4A91D0',
    fontWeight: 'bold',
  },
});