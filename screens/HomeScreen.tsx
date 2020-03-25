import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ButtonGroup } from 'react-native-elements';
import EntryList from './homeScreen/EntryList';
import { StorageType } from '../storage';

const matchSection = (storageType: StorageType) => {
  switch (storageType) {
    case StorageType.Firestore:
      return 1;
    case StorageType.Local:
    default:
      return 0;
  }
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const [section, setSection] = useState<number>(
    matchSection(route.params?.storageType)
  );

  const buttons = ['Local (SQLite)', 'Firestore'];

  return (
    <View style={styles.container}>
      <ButtonGroup
        onPress={setSection}
        selectedIndex={section}
        buttons={buttons}
        containerStyle={{ height: 50 }}
      />
      {section === 0 && <EntryList storageType={StorageType.Local} />}
      {section === 1 && <EntryList storageType={StorageType.Firestore} />}
    </View>
  );
};

export default HomeScreen;

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
  date: {
    flexDirection: 'row',
    flexWrap: 'nowrap'
  },
  dateInput: {
    flexGrow: 1
  }
});
