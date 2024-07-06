import React, {useState, useCallback, useEffect} from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native'
import CollectDeviceData from '../utils.js/CollectDeviceData'
import webServiceHandler from '../utils.js/webServiceHandler'
import AsyncStorage from '@react-native-async-storage/async-storage'

const HomeScreen = () => {
  const [deviceData, setDeviceData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoadingFetch, setIsLoadingFetch] = useState(false)
  const [isLoadingSend, setIsLoadingSend] = useState(false)

  useEffect(() => {
    checkSessionTimeout()
  }, [])

  const checkSessionTimeout = async () => {
    const sessionStartTime = await AsyncStorage.getItem('sessionStartTime')
    if (sessionStartTime) {
      const currentTime = new Date().getTime()
      const elapsedTime = currentTime - parseInt(sessionStartTime, 10)

      // 10 minutes in milliseconds
      const timeoutDuration = 10 * 60 * 1000
      console.log('====================================')
      console.log(elapsedTime, timeoutDuration)
      console.log('====================================')
      if (elapsedTime >= timeoutDuration) {
        await AsyncStorage.removeItem('sessionFlag')
        await AsyncStorage.removeItem('sessionStartTime')
        console.log('Session cleared due to timeout.')
      }
    }
  }
  // Memoize fetchDeviceData to prevent unnecessary re-renders
  const fetchDeviceData = useCallback(async () => {
    setIsLoadingFetch(true)
    setMessage('')
    setSuccess(false)
    console.log('Fetching device data...')
    try {
      const result = await CollectDeviceData()
      console.log('Device data collected:', result)
      if (result) {
        setDeviceData(result)
        setSuccess(true)
      } else {
        setDeviceData(null)
      }
    } catch (error) {
      console.error('Error capturing data:', error)
      setDeviceData(null)
    } finally {
      setIsLoadingFetch(false)
    }
  }, [])


  const confirmFetchData = () => {
    Alert.alert(
      'Confirm Fetch',
      'Are you sure you want to capture sensitive device data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Fetch',
          onPress: fetchDeviceData,
        },
      ],
      {cancelable: false},
    )
  }

  const sendDeviceData = data => {
    console.log('Sending device data:', data)
    setShowModal(true)
  }

  const confirmSendData = async () => {
    setShowModal(false)
    setIsLoadingSend(true)
    try {
      const result = await webServiceHandler(deviceData)
      if (result.success) {
        setMessage(result.message)
        setSuccess(result.success)

        Alert.alert('Success', result.message)
      } else {
        setSuccess(result.success)
        setMessage(result.message)
      }
    } catch (error) {
      console.log('Error capturing data:', error)
      setMessage('Failed to capture data. Please try again.')
      setSuccess(false)
      Alert.alert('Error', 'Failed to capture data. Please try again.')
    } finally {
      setIsLoadingSend(false)
    }
  }

  const cancelSendData = () => {
    setShowModal(false)
  }

  const deleteDeviceData = () => {
    setDeviceData(null)
    setMessage('')
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Device Information Capture</Text>

      {isLoadingFetch && <ActivityIndicator size='large' color='#00827F' />}

      {deviceData && !isLoadingFetch && (
        <View style={styles.dataContainer}>
          <DataRow label='IP Address' value={deviceData.ipv4Address} />
          <DataRow label='Android ID' value={deviceData.androidId} />
          <DataRow label='Brand' value={deviceData.brand} />
          <DataRow label='Model' value={deviceData.model} />
          <DataRow label='Screen Size' value={deviceData.screenSize} />
          <DataRow label='OS Version' value={deviceData.osVersion} />
          <DataRow label='App Version' value={deviceData.platFromVersion} />
          <DataRow
            label='Battery Level'
            value={`${Math.round(deviceData.batteryLevel * 100)}%`}
          />
          <DataRow
            label='Total Memory'
            value={`${(deviceData.totalMemory / 1024 ** 2).toFixed(2)} MB`}
          />
          <DataRow
            label='Free Storage'
            value={`${(deviceData.freeDiskStorage / 1024 ** 3).toFixed(2)} GB`}
          />
          <DataRow
            label='Total Storage'
            value={`${(deviceData.totalDiskCapacity / 1024 ** 3).toFixed(
              2,
            )} GB`}
          />
          <DataRow label='Carrier' value={deviceData.carrier} />
        </View>
      )}
      {!deviceData && !isLoadingFetch && (
        <Text style={styles.message}>No device data available.</Text>
      )}

      {message && (
        <Text style={[styles.message, {color: success ? 'green' : 'red'}]}>
          {message}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={confirmFetchData}
          style={[styles.button, isLoadingFetch && styles.disabledButton]}
          disabled={isLoadingFetch}>
          <Text style={styles.buttonText}>Get Device Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => sendDeviceData(deviceData)}
          style={[
            styles.button,
            !deviceData && styles.disabledButton,
            isLoadingFetch && styles.disabledButton,
          ]}
          disabled={!deviceData || isLoadingFetch}>
          <Text style={styles.buttonText}>
            {isLoadingSend ? 'Sending...' : 'Send Device Data'}
          </Text>
        </TouchableOpacity>
      </View>
      {deviceData && (
        <TouchableOpacity
          onPress={deleteDeviceData}
          style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Data</Text>
        </TouchableOpacity>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={showModal}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to send sensitive device data?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={confirmSendData}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes, Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cancelSendData}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const DataRow = ({label, value}) => (
  <View style={styles.dataRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dataContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    color:'#00827F'
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
  },
  button: {
    backgroundColor: '#00827F',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '47%',
  },
  buttonText: {
    color: 'white',
  },
  disabledButton: {
    opacity: 0.5,
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  deleteButtonText: {
    color: 'white',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#00827F',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
  },
})

export default HomeScreen
