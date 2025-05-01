import React, { useState } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet } from 'react-native';


export const LocationForm = ({
  initialName = '',
  initialMessage = '',
  initialTime = 0,
  initialFavorite = false,
  onSubmit,
  onCancel
}: {
  initialName?: string;
  initialMessage?: string;
  initialTime?: number;
  initialFavorite?: boolean;
  onSubmit: (data: {
    name: string;
    message: string;
    timeNotification: number;
    isFavorite: boolean;
  }) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState(initialMessage);
  const [timeNotification, setTimeNotification] = useState(initialTime.toString());
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handleSubmit = () => {
    onSubmit({
      name,
      message,
      timeNotification: parseInt(timeNotification) || 0,
      isFavorite
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Location name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Notification time (minutes)"
        value={timeNotification}
        onChangeText={setTimeNotification}
        keyboardType="numeric"
      />
      <View style={styles.switchContainer}>
        <Switch
          value={isFavorite}
          onValueChange={setIsFavorite}
        />
        <Text>Favorite</Text>
      </View>
      <View style={styles.buttonRow}>
        <Button title="Cancel" onPress={onCancel} color="#999" />
        <Button title="Save" onPress={handleSubmit} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
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
});