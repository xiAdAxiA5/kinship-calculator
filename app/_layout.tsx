import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LanguageProvider } from '../src/i18n/LanguageContext';
import { RelativesProvider } from '../src/store/RelativesContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <RelativesProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="result" options={{ headerShown: true, title: '结果', headerBackTitle: '返回' }} />
        </Stack>
      </RelativesProvider>
    </LanguageProvider>
  );
}
