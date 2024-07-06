import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';


const sendDataToEndpoint = async (data) => {
  try {
    const response = await fetch('https://requestbin.com/', {
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
      Alert.alert('Server error:', 'Network Request Failed ')
      return false;
    }
  } catch (error) {
    console.log('Data transmission failed:', error);
    Alert.alert('Data transmission failed:', error)
    return false;
  }

};
const webServiceHandler = async (data) => {
  try {
   
    const sessionFlag = await AsyncStorage.getItem('sessionFlag');
    if (sessionFlag) {
      console.log('====================================');
      console.log(sessionFlag);
      console.log('====================================');
      Alert.alert('Data Already Store', 'Data Already Collected This Session')
      return { success: false, message: 'Data already collected this session'};
    }

   
    if (!data) {
      Alert.alert('Failed', 'Data Already Collected This Session')
      return { success: false, message: 'Failed to collect device data' };
    }

    const success = await sendDataToEndpoint(data);
    if (success) {
      await AsyncStorage.setItem('sessionFlag', 'true');
      return { success: true, message: 'Data sent successfully' ,deviceData:data };
    } else {
      return { success: false, message: 'Data transmission failed',deviceData:data };
    }
  } catch (error) {
    console.log('Data collection and transmission error:', error);
    return { success: false, message: 'Error processing data' };
  }
};

export default webServiceHandler

