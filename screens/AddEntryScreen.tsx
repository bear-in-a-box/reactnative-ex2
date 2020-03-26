import React, { useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
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
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const navigation = useNavigation();
  const route = useRoute<any>();
  const storageType = route.params?.storageType;
  const saveResult = () => {
    setIsAdding(true);
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
      <Input
        label="Marka/model"
        containerStyle={styles.input}
        placeholder="XYZ"
        value={model}
        onChangeText={setModel}
      />
      <Input
        label="Liczba kilometrów przejechanych od ostatniego tankowania"
        containerStyle={styles.input}
        placeholder="0.0"
        value={String(kmsSinceLastFill)}
        onChangeText={text => setKmsSinceLastFill(+text || 0)}
        keyboardType="numeric"
      />
      <Input
        label="Liczba litrów spalonych od ostatniego tankowania"
        containerStyle={styles.input}
        placeholder="0.0"
        value={String(liters)}
        onChangeText={text => setLiters(+text || 0)}
        keyboardType="numeric"
      />
      <View style={{ ...styles.date, ...styles.input }}>
        <Input
          label="Data pomiaru"
          editable={false}
          value={date.toLocaleDateString('pl')}
        />
        <Button
          buttonStyle={{ width: 100, alignSelf: 'flex-end' }}
          title="Ustaw..."
          onPress={showDatePicker}
        />
      </View>
      <Input
        label="URL do zdjęcia (opcjonalne)"
        containerStyle={styles.input}
        placeholder="https://..."
        value={image}
        onChangeText={setImage}
      />
      <Button
        title={`Zapisz do pamięci ${storageType}`}
        onPress={saveResult}
        loading={isAdding}
        disabled={isAdding}
        buttonStyle={{ width: 300, alignSelf: 'center' }}
      />
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
    marginBottom: 20
  },
  date: {
    flexDirection: 'column',
    flexWrap: 'nowrap'
  }
});
