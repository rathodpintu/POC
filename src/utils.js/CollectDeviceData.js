import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from 'react-native-network-info';

const CollectDeviceData = async () => {
  try {
    const ipv4Address = await NetworkInfo.getIPV4Address();
    const androidId = await DeviceInfo.getAndroidId();
    const brand = DeviceInfo.getBrand();
    const model = DeviceInfo.getModel();
    const screenSize = DeviceInfo.getDeviceType();
    const osVersion = DeviceInfo.getSystemVersion();
    const batteryLevel = await DeviceInfo.getBatteryLevel();
    const totalMemory = await DeviceInfo.getTotalMemory();
    const freeDiskStorage = await DeviceInfo.getFreeDiskStorage();
    const totalDiskCapacity = await DeviceInfo.getTotalDiskCapacity();
    const carrier = await DeviceInfo.getCarrier();
    const platFromVersion = DeviceInfo.getVersion();
    const startTime = new Date().getTime();

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
      platFromVersion,
      startTime
    };

    return deviceData;
  } catch (error) {
    console.log('Error collecting device data:', error);
    return null;
  }
};

export default CollectDeviceData;
