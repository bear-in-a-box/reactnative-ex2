import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ListItem } from 'react-native-elements';

import { Report } from '../../../models/report.model';
import { StorageType } from '../../../storage';

interface Props {
  report: Report;
  storageType: StorageType;
}

const Item: React.FC<Props> = ({ report, storageType }) => {
  const navigation = useNavigation();
  return (
    <ListItem
      key={report.date}
      title={new Date(report.date).toLocaleDateString()}
      subtitle={`${report.liters} l/${report.kmsSinceLastFill} km`}
      badge={{ value: report.model }}
      bottomDivider
      chevron
      leftAvatar={
        report.image != null &&
        report.image !== '' && {
          rounded: true,
          source: { uri: report.image }
        }
      }
      onPress={() => navigation.navigate('Result', { report, storageType })}
    />
  );
};

export default Item;
