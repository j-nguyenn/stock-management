import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { RootNavigator } from "./navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./providers";
import { AppProvider } from './screens/AppContext';

const App = () => {
  return (
    <AuthenticatedUserProvider>
      <AppProvider>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </AppProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;
