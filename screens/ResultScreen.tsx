import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Report } from '../models/report.model';
import { useRoute } from '@react-navigation/native';
import { Image } from 'react-native-elements';

const ResultScreen: React.FC = () => {
  const route = useRoute<any>();
  const report: Report = route.params?.report;

  if (report == null) {
    return (
      <View style={styles.container}>
        <Text>Brak raportu</Text>
      </View>
    );
  }

  const result = useMemo(
    () => (report.liters / (report.kmsSinceLastFill || 1)) * 100,
    [report]
  );

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
        <Text style={styles.resultValue}>{result.toFixed(2)} l/100km</Text>
      </View>
      {report.image != null && report.image !== '' && (
        <View style={styles.image}>
          <Image
            source={{ uri: report.image }}
            style={{ width: 200, height: 200 }}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
      )}
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
  image: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
