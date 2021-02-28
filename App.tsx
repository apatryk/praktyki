import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { DetailsScreen } from './screens/Details';
import { HomeScreen } from './screens/Home';

export type StackParamList = {
  Home: undefined,
  Details: { id: string },
};

export default () => {
  const Stack = createStackNavigator<StackParamList>();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Strona główna',
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{
            title: 'Ulica',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
