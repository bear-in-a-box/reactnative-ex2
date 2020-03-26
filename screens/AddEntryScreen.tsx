import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { ReportToAdd } from '../storage/interface';

const AddEntryScreen: React.FC = () => {
  const [model, setModel] = useState<string>('');
  const [kmsSinceLastFill, setKmsSinceLastFill] = useState<number>(0);
  const [liters, setLiters] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [image, setImage] = useState<string>('');
  const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false);

  const navigation = useNavigation();
  const route = useRoute<any>();
  const storageType = route.params?.storageType;
  const saveResult = () => {
    const data: ReportToAdd = {
      model,
      kmsSinceLastFill,
      liters,
      litersPerKms: (liters / (kmsSinceLastFill || 1)) * 100,
      image,
      date: +date
    };
    navigation.navigate('Save', { data, storageType });
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const onDateChange = (_event: any, selectedDate: Date) => {
    const targetDate: Date = selectedDate || date;
    setDatePickerVisible(Platform.OS === 'ios');
    setDate(targetDate);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.storage}>
        Wpis zostanie zapisany w: {storageType}
      </Text>
      <Text>Marka/model</Text>
      <TextInput
        style={styles.input}
        placeholder="XYZ"
        value={model}
        onChangeText={setModel}
      />
      <Text>Liczba kilometrów przejechanych od ostatniego tankowania</Text>
      <TextInput
        style={styles.input}
        placeholder="0.0"
        value={String(kmsSinceLastFill)}
        onChangeText={text => setKmsSinceLastFill(+text || 0)}
        keyboardType="numeric"
      />
      <Text>Liczba litrów spalonych od ostatniego tankowania</Text>
      <TextInput
        style={styles.input}
        placeholder="0.0"
        value={String(liters)}
        onChangeText={text => setLiters(+text || 0)}
        keyboardType="numeric"
      />
      <Text>Data pomiaru</Text>
      <View style={{ ...styles.date, ...styles.input }}>
        <TextInput
          style={styles.dateInput}
          editable={false}
          value={date.toLocaleDateString('pl')}
        />
        <Button title="Ustaw..." onPress={showDatePicker} />
      </View>
      <Text>URL do zdjęcia</Text>
      <TextInput
        style={styles.input}
        placeholder="https://..."
        value={image}
        onChangeText={setImage}
      />
      <Button title="Przelicz" onPress={saveResult} />
      {datePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={new Date().getTimezoneOffset()}
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default AddEntryScreen;

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
  },
  storage: {
    color: '#09f',
    fontWeight: 'bold',
    marginVertical: 50
  }
});
