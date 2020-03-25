import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { APP_TITLE } from './constants/app.constants';
import SaveScreeen from './screens/SaveScreeen';
import ResultScreen from './screens/ResultScreen';
import HomeScreen from './screens/HomeScreen';
import AddEntryScreen from './screens/AddEntryScreen';
import { ThemeProvider } from 'react-native-elements';

console.disableYellowBox = true;

const Stack = createStackNavigator();

const App: React.FC = () => (
  <ThemeProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: APP_TITLE }}
        />
        <Stack.Screen
          name="Add"
          component={AddEntryScreen}
          options={{ title: 'Dodaj raport' }}
        />
        <Stack.Screen
          name="Save"
          component={SaveScreeen}
          options={{ title: 'Zapisywanie...' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ title: 'Szczegóły raportu' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </ThemeProvider>
);
export default App;
