import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UserDashboard() {
  const router = useRouter();
  const i18n = require('./i18n').default;
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  interface Order {
    id: number;
    status: string;
  }
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('in progress');
  const [lastStatuses, setLastStatuses] = useState({});
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ccc';
      case 'accepted': return '#66ccff';
      case 'in progress': return 'gold';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return '#aaa';
    }
  };
  const isStepActive = (current: string, step: string) => {
    const orderStages = ['pending', 'accepted', 'in progress', 'delivered'];
    return orderStages.indexOf(step.toLowerCase()) <= orderStages.indexOf(current.toLowerCase());
  };

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.8.51:8000/api/my-requests', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();
      setOrders(json.data);
      const updatedStatuses: Record<number, string> = {};
      json.data.forEach((order: Order) => {
        updatedStatuses[order.id] = order.status;
      });
      setLastStatuses(updatedStatuses);
    } catch (error) {
      console.log('Error fetching orders:', error);
    }
  };

  const cancelOrder = async (orderId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`http://192.168.8.51:8000/api/cancel-request/${orderId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert(i18n.t('order_cancelled'));
        fetchOrders();
      } else {
        Alert.alert(i18n.t('could_not_cancel'), data.message);
      }
    } catch (error) {
      console.error('Cancel error:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setShowAccountOptions(false);
    router.push('./login');
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  
  const filteredOrders = (orders || []).filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return order.status.toLowerCase() === 'delivered';
    if (activeTab === 'cancelled') return order.status.toLowerCase() === 'cancelled';
    return !['delivered', 'cancelled'].includes(order.status.toLowerCase());
  });

  const handleEdit = async (order: Order) => {
  await AsyncStorage.setItem('editOrder', JSON.stringify(order));
 router.push('./truckRequest');
};

  return (
    <View style={styles.container}>
<Image source={require('../assets/images/Vector.png')} style={styles.backgroundImage} />

      <View style={styles.header}>
        <Text style={styles.title}>
          {i18n.t('track') + '\n'}<Text style={styles.bold}>{i18n.t('your_order')}</Text>
        </Text>
        <View style={styles.lottieIcons}>

          <TouchableOpacity onPress={() => setShowAccountOptions(!showAccountOptions)}>
            <LottieView source={require('../assets/images/Person.json')} style={styles.PersonIcon} />
          </TouchableOpacity>

         {showAccountOptions && (
  <View style={styles.dropdownMenu}>
    <TouchableOpacity onPress={() => {
      setShowAccountOptions(false);
      router.push('./truckRequest');
    }}>
      <Text style={styles.menuItem}>{i18n.t('request_new_order')}</Text>
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

          
        </View>
      </View>

      <View style={styles.tabs}>
        {['in_progress', 'completed', 'cancelled', 'all'].map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTab]}>
              {i18n.t(`tabs.${tab}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView>
        {filteredOrders.map((order, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>{i18n.t('order_id')}: #{order.id}</Text>
{order.status.toLowerCase() === 'pending' && (
                <>
                <TouchableOpacity onPress={() => handleEdit(order)} style={styles.editButtonSmall}>
                    <Text style={styles.editButtonText}>{i18n.t('edit')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => cancelOrder(order.id)} style={styles.cancelButtonSmall}>
                    <Text style={styles.cancelButtonText}>{i18n.t('cancel')}</Text>
                  </TouchableOpacity>
                  
                </>
              )}
            </View>

            <View style={styles.progressWrapper}>
              <View style={styles.fullLine} />
              <View style={styles.stepsRow}>
                {['pending', 'accepted', 'in progress', 'delivered'].map((status, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.circle,
                      {
                        backgroundColor: isStepActive(order.status, status)
                          ? getStatusColor(status)
                          : '#e0e0e0',
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.status}>{i18n.t(`status.${order.status.toLowerCase()}`)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    paddingBottom: 30,
    width: '100%',
    height: '60%',
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    padding: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 50,
    padding: 7,
  },
  tabText: {
    fontSize: 16,
    color: '#aaa',
  },
  activeTab: {
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#FFC107',
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
  },
  menuItem: {
    paddingVertical: 10,
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
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 10,
  },
  orderId: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  status: {
    textAlign: 'center',
    color: '#555',
    marginTop: 6,
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  line: {
    width: 30,
    height: 2,
    marginHorizontal: 2,
  },
  
  activeLine: {
    backgroundColor: '#FFC107',
  },
  
  inactiveLine: {
    backgroundColor: '#ccc',
  },
  
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  activeCircle: {
    backgroundColor: '#FFC107',
  },
  
  inactiveCircle: {
    backgroundColor: '#ccc',
  },
  fullLine: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#000',
    zIndex: 0,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    zIndex: 1,
  },
  cancelButtonSmall: {
    backgroundColor: '#E31C1C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    width:70,
    alignItems:'center'
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButtonSmall: {
  backgroundColor: '#ccc',
  paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    width:70,
  marginLeft: 100,
  alignItems:'center'
},
editButtonText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: 'bold',
},
});