import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useLanguage } from '../../src/i18n/LanguageContext';

function TabIcon({ label }: { label: string }) {
  return <Text style={{ fontSize: 22 }}>{label}</Text>;
}

export default function TabLayout() {
  const { lang } = useLanguage();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#c41e3a',
      tabBarInactiveTintColor: '#999',
      headerStyle: { backgroundColor: '#fff' },
      headerTitleStyle: { color: '#333' },
    }}>
      <Tabs.Screen
        name="calculate"
        options={{
          title: lang === 'zh' ? '计算' : 'Calculate',
          tabBarIcon: () => <TabIcon label="🧮" />,
        }}
      />
      <Tabs.Screen
        name="lookup"
        options={{
          title: lang === 'zh' ? '查询' : 'Lookup',
          tabBarIcon: () => <TabIcon label="🔍" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: lang === 'zh' ? '设置' : 'Settings',
          tabBarIcon: () => <TabIcon label="⚙️" />,
        }}
      />
    </Tabs>
  );
}
