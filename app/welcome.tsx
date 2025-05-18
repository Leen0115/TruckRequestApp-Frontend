import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import i18n from '../app/i18n';


export default function Welcome() {
  const { initLanguage, setLanguage } = require('../app/i18n');
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [langLabel, setLangLabel] = useState(i18n.locale);

  useEffect(() => {
    initLanguage().then((lang: string) => setLangLabel(lang));
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    await setLanguage(langCode);
    setLangLabel(langCode);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Rodud.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.textstyle}>{i18n.t('welcome_text')}</Text>
      <Image source={require('../assets/images/Truck.png')} style={styles.truckImage} resizeMode="contain" />

      <TouchableOpacity style={styles.languageButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.languageText}>Language: {langLabel.toUpperCase()}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>{i18n.t('get_started')}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity onPress={() => handleLanguageChange('en')} style={styles.modalOption}>
              <Text>English</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('ar')} style={styles.modalOption}>
              <Text>العربية</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('ur')} style={styles.modalOption}>
              <Text>اُردو</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 15 }}>
              <Text style={{ color: 'red' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  logo: { width: 200, height: 120 },
  truckImage: { width: 250, height: 250 },
  textstyle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5D437E',
    paddingHorizontal: 35,
    paddingVertical: 12,
    top: -25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 17,
    paddingVertical: 8,
    top: -10,
    borderRadius: 8,
  },
  languageText: {
    color: '#333',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
  },
  modalOption: {
    paddingVertical: 10,
  },
});