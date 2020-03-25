import React, { useEffect } from 'react';
import useStorage from '../../storage/connectors/useStorage.hook';
import { StorageType } from '../../storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, View } from 'react-native';
import Item from './entryList/Item';
import { Button, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

interface Props {
  storageType: StorageType;
}

const EntryList: React.FC<Props> = ({ storageType }) => {
  const { reports, loading, refresh } = useStorage(storageType);
  const navigation = useNavigation();

  useEffect(() => refresh(), []);

  return (
    <React.Fragment>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Button
          onPress={refresh}
          title="Odśwież"
          loading={loading}
          buttonStyle={{ width: 150 }}
          type={loading ? 'clear' : 'solid'}
        />
        <Button
          onPress={() => navigation.navigate('Add', { storageType })}
          title="Dodaj"
          buttonStyle={{ width: 150 }}
        />
      </View>
      <SafeAreaView>
        {!loading &&
          (reports.length === 0 ? (
            <Text>Nie ma w pisów</Text>
          ) : (
            <FlatList
              data={reports}
              renderItem={item => <Item report={item.item} />}
              keyExtractor={item => String(item.date)}
            />
          ))}
      </SafeAreaView>
    </React.Fragment>
  );
};

export default EntryList;
