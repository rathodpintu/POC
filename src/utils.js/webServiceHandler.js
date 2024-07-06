import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';



const sendDataToEndpoint = async (data) => {
      let endpoint= 'https://requestbin.com/';
      console.log("datas",data);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return true;
    } else {
      console.log('Server error:', response.status);
      Alert.alert('Server error:', 'Network request failed');
      return false;
    }
  } catch (error) {
    console.log('Data transmission failed:', error);
    Alert.alert('Data transmission failed:', error.message);
    return false;
  }
};

const webServiceHandler = async (data) => {
  try {
    const sessionFlag = await AsyncStorage.getItem('sessionFlag');
    if (sessionFlag) {
      console.log('Data already collected this session');
      Alert.alert('Data Already Collected', 'Data already collected this session');
      return { success: false, message: 'Data already collected this session' };
    }

    if (!data) {
      console.log('Failed to collect device data');
      Alert.alert('Failed', 'Failed to collect device data');
      return { success: false, message: 'Failed to collect device data' };
    }

    const success = await sendDataToEndpoint(data);
    if (success) {
      await AsyncStorage.setItem('sessionFlag', 'true');
      const startTime = new Date().getTime();
      await AsyncStorage.setItem('sessionStartTime', startTime.toString());
      return { success: true, message: 'Data sent successfully', deviceData: data };
    } else {
      return { success: false, message: 'Data transmission failed', deviceData: data };
    }
  } catch (error) {
    console.log('Data collection and transmission error:', error);
    return { success: false, message: 'Error processing data' };
  }
};

export default webServiceHandler;
