import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
export default function Success() {
const router = useRouter();
const i18n = require('./i18n').default;
  return (
    <View style={styles.container}>
      <LottieView 
        source={require('../assets/images/tik.json')}
        autoPlay
        speed={0.6}
        loop={true}
        style={styles.tickAnimation}  />
     <View style={styles.textcolumn}>
   <Text style={styles.textstyle1}>{i18n.t('success_title1')}</Text>
    <Text style={styles.textstyle2}>{i18n.t('success_title2')}</Text>
    </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.button}
        onPress={() => router.push('./dashboard')}>
        <Text style={styles.buttonText}>{i18n.t('track_order')}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 50,
  },
  tickAnimation: {
    width: 150,
    height: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,height: 4,},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    },
    textcolumn: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
    },
  textstyle1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  textstyle2: {
    fontSize: 15.5,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5D437E',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});