import { UserLocation } from '@/utils/types';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Switch, StyleSheet, SafeAreaView } from 'react-native';
import { generateId, NewLocationData, LocationUpdates, LocationFormData } from '@/utils/locationStorage';

interface LocationFormProps {
  initialData?: Partial<UserLocation>;
  onSubmit: (data: UserLocation) => void;
  onCancel: () => void;
}

export const LocationForm = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}: LocationFormProps) => {

  const [name, setName] = useState(initialData?.name || '');
  const [message, setMessage] = useState(initialData?.message || '');
  const [timeNotification, setTimeNotification] = useState(initialData?.timeNotification?.toString() || '0');
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite || false);

  const handleSubmit = () => {
    const locationData = {
      id: initialData?.id || generateId(),
      region: initialData?.region || { 
        latitude: 0, 
        longitude: 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      },
      name,
      message,
      timeNotification: Number(timeNotification),
      isFavorite,
      createdAt: initialData?.createdAt || Date.now()
    };
    onSubmit(locationData);
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Text style={styles.header}>
            {initialData ? 'Edit Location' : 'Add New Location'}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Add a note about this location"
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notification Time (minutes)</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              value={timeNotification}
              onChangeText={setTimeNotification}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formGroup, styles.switchContainer]}>
            <Text style={styles.label}>Favorite Location</Text>
            <Switch
              value={isFavorite}
              onValueChange={setIsFavorite}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {initialData ? 'Update' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    marginRight: 12,
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    flex: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextCancel: {
    color: '#666',
  },
  buttonTextSubmit: {
    color: '#fff',
  },
});