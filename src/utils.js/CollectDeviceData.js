// import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from 'react-native-network-info';
import { Platform } from 'react-native';

const CollectDeviceData = async () => {
 

  try {
   
    const ipv4Address = await NetworkInfo.getIPV4Address()
    const androidId = await DeviceInfo.getAndroidId()
    const brand = DeviceInfo.getBrand()
    const model = DeviceInfo.getModel()
    const screenSize = DeviceInfo.getDeviceType()
    const osVersion = DeviceInfo.getSystemVersion()
    const batteryLevel = await DeviceInfo.getBatteryLevel()
    const totalMemory = await DeviceInfo.getTotalMemory()
    const freeDiskStorage = await DeviceInfo.getFreeDiskStorage()
    const totalDiskCapacity = await DeviceInfo.getTotalDiskCapacity()
    const carrier = await DeviceInfo.getCarrier()
    const platFromVersion =  DeviceInfo.getVersion()
   
    

    // const netInfo = await NetInfo.fetch()

    const deviceData = {
      ipv4Address,
      androidId,
      brand,
      model,
      screenSize,
      osVersion,
      batteryLevel,
      totalMemory,
      freeDiskStorage,
      totalDiskCapacity,
      carrier,
      platFromVersion
      // netInfo,
    }

    isDataCollected = true
    console.log('d====================================');
    console.log(deviceData?.deviceId);
    console.log('d====================================');
    return deviceData
  } catch (error) {
    console.log('Error collecting device data:', error)
    return null
//     {message: 'Error collecting device data:', error:error}
  }
}

export default CollectDeviceData


