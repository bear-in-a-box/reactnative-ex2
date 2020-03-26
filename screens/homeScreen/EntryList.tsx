import React, { useEffect } from 'react';
import useStorage from '../../storage/connectors/useStorage.hook';
import { StorageType } from '../../storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, View } from 'react-native';
import Item from './entryList/Item';
import { Button, Text, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

interface Props {
  storageType: StorageType;
}

const EntryList: React.FC<Props> = ({ storageType }) => {
  const { reports, loading, refresh } = useStorage(storageType);
  const navigation = useNavigation();

  useEffect(() => refresh(), [storageType]);

  return (
    <React.Fragment>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <Button
          onPress={refresh}
          title="Odśwież"
          icon={{
            name: 'refresh',
            iconStyle: { color: '#fff' }
          }}
          loading={loading}
          buttonStyle={{ width: 150 }}
        />
        <Button
          onPress={() => navigation.navigate('Add', { storageType })}
          title="Dodaj"
          icon={{
            name: 'add',
            iconStyle: { color: '#fff' }
          }}
          buttonStyle={{ width: 150, backgroundColor: '#080' }}
        />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        {!loading &&
          (reports.length === 0 ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon
                name="car"
                type="antdesign"
                iconStyle={{ color: '#ccc' }}
                size={120}
              />
              <Text style={{ fontSize: 32, color: '#ccc' }}>
                Nie ma wpisów.
              </Text>
            </View>
          ) : (
            <FlatList
              data={reports}
              renderItem={item => (
                <Item report={item.item} storageType={storageType} />
              )}
              keyExtractor={item => String(item.date)}
            />
          ))}
      </SafeAreaView>
    </React.Fragment>
  );
};

export default EntryList;
