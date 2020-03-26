import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import useStorage from '../storage/connectors/useStorage.hook';

const SaveScreeen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const storageType = route.params?.storageType;
  const storage = useStorage(storageType);

  useEffect(() => {
    storage
      .addReport(route.params?.data)
      .then(() => storage.refresh())
      .then(() =>
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: { storageType } }]
        })
      );
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0099ff" />
      <Text>Zapisywanie ({storageType})...</Text>
    </View>
  );
};

export default SaveScreeen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }
});
