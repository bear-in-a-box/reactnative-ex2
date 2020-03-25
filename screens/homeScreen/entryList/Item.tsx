import React from 'react';

import { Report } from '../../../models/report.model';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

interface Props {
  report: Report;
}

const Item: React.FC<Props> = ({ report }) => {
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
      onPress={() => navigation.navigate('Result', { report })}
    />
  );
};

export default Item;
