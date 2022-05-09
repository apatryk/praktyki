import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { Button } from 'react-native-elements';
import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from "react-native";
import { DetailsScreen } from './screens/Details';
import { HomeScreen } from './screens/Home';
import { PanningProvider } from 'react-native-ui-lib';

export type StackParamList = {
  Home: undefined,
  Details: { id: string },
};
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
export default () => {
  const Stack = createStackNavigator<StackParamList>();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ 
            title: 'Wybierz ulicę'
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({ title: 'Ulica: ' + route.params.data.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
