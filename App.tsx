import React from 'react';
import 'reflect-metadata';

import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, LogBox, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { DatabaseConnectionProvider } from './src/data/connexion';
import { useProjectFonts } from './src/static/fonts';
import AppStack from './src/navigators/bubbleStack';

import { store } from './src/store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const App = () => {
  const [loaded, error] = useProjectFonts();
  return (
    <DatabaseConnectionProvider>
      <Provider store={store}>

        <SafeAreaProvider>
          <View style={styles.container}>
            <NavigationContainer>

              {
                loaded
                  ? (
                    <>
                      <StatusBar style="auto" />
                      <AppStack />
                    </>
                  )
                  : (<ActivityIndicator />)
              }

            </NavigationContainer>
          </View>
        </SafeAreaProvider>
      </Provider>
    </DatabaseConnectionProvider>
  );
}
  ;

export default App;

LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
  'Setting a timer for a long period of time, i.e. multiple minutes, is a performance and correctness issue on Android as it keeps the timer module awake, and timers can only be called when the app is in the foreground. See https://github.com/facebook/react-native/issues/12981 for more info.',
]);
