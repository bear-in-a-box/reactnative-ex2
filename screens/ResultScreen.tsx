import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Card, ListItem } from 'react-native-elements';
import { Report } from '../models/report.model';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StorageType } from '../storage';
import useStorage from '../storage/connectors/useStorage.hook';

const ResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const report: Report = route.params?.report;
  const storageType: StorageType = route.params?.storageType;
  const storage = useStorage(storageType);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const title = useMemo(
    () =>
      `${report.kmsSinceLastFill} km ze spalaniem ${report.litersPerKms.toFixed(
        2
      )} l/100km`,
    [report]
  );

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
      <Card
        title={title}
        image={
          report.image != null && report.image !== ''
            ? { uri: report.image }
            : null
        }
      >
        <ListItem
          title={new Date(report.date).toLocaleDateString('en-GB')}
          subtitle="Data pomiaru"
        />
        <ListItem title={report.model} subtitle="Marka/model auta" />
        <ListItem title={String(report.liters)} subtitle="Litry spalone" />
      </Card>
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
