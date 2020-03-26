import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Report } from '../models/report.model';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Image, Button } from 'react-native-elements';
import { StorageType } from '../storage';
import useStorage from '../storage/connectors/useStorage.hook';

const ResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const report: Report = route.params?.report;
  const storageType: StorageType = route.params?.storageType;
  const storage = useStorage(storageType);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteReport = async () => {
    setIsDeleting(true);
    try {
      await storage.deleteReport(report.id);
    } catch (e) {}
    storage.refresh();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home', params: { storageType } }]
    });
  };

  if (report == null) {
    return (
      <View style={styles.container}>
        <Text>Brak raportu</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Marka/model</Text>
      <TextInput style={styles.input} editable={false} value={report.model} />
      <Text>Liczba kilometrów przejechanych od ostatniego tankowania</Text>
      <TextInput
        style={styles.input}
        editable={false}
        value={String(report.kmsSinceLastFill)}
      />
      <Text>Liczba litrów spalonych od ostatniego tankowania</Text>
      <TextInput
        style={styles.input}
        editable={false}
        value={String(report.liters)}
      />
      <Text>Data pomiaru</Text>
      <TextInput
        style={styles.input}
        editable={false}
        value={new Date(report.date).toLocaleDateString('pl')}
      />
      <View style={styles.resultView}>
        <Text style={styles.resultValue}>
          {report.litersPerKms.toFixed(2)} l/100km
        </Text>
      </View>
      {report.image != null && report.image !== '' && (
        <View style={styles.center}>
          <Image
            source={{ uri: report.image }}
            style={{ width: 200, height: 200 }}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
      )}
      <View style={styles.center}>
        <Button
          title="Usuń"
          buttonStyle={{
            backgroundColor: '#f00',
            width: 150,
            marginTop: 20
          }}
          icon={{
            name: 'delete',
            iconStyle: { color: 'white' }
          }}
          onPress={() => deleteReport()}
          loading={isDeleting}
          disabled={isDeleting}
        />
      </View>
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 16
  },
  input: {
    paddingVertical: 8,
    marginBottom: 16
  },
  resultView: {
    alignItems: 'center',
    flexDirection: 'column'
  },
  resultValue: {
    fontSize: 48
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
