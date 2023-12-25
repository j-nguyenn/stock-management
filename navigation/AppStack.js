import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen, ItemDetailScreen } from '../screens';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='ItemDetail' component={ItemDetailScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
};
