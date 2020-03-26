import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ButtonGroup, Text } from 'react-native-elements';
import EntryList from './homeScreen/EntryList';
import { StorageType } from '../storage';

const buttons = [
  { label: 'Local (SQLite)', storageType: StorageType.Local },
  { label: 'Firestore', storageType: StorageType.Firestore }
];
const buttonLabels = buttons.map(({ label }) => label);

function matchSection(storageType: StorageType): number {
  const index = buttons.findIndex(button => button.storageType === storageType);
  return index === -1 ? 0 : index;
}

const HomeScreen: React.FC = () => {
  const route = useRoute<any>();

  const [section, setSection] = useState<number>(
    matchSection(route.params?.storageType)
  );

  return (
    <View style={styles.container}>
      <ButtonGroup
        onPress={setSection}
        selectedIndex={section}
        buttons={buttonLabels}
        containerStyle={{ height: 50 }}
      />
      <EntryList storageType={buttons[section].storageType} />
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
