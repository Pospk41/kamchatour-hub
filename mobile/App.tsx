import React, { useState, useEffect, createContext, useContext } from 'react';
import * as Updates from 'expo-updates';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8003';

type Role = 'traveler' | 'operator' | 'guide' | 'admin';

type AuthState = {
  token: string | null;
  role: Role | null;
};

const AuthContext = createContext<{
  auth: AuthState;
  setAuth: (a: AuthState) => void;
}>({ auth: { token: null, role: null }, setAuth: () => {} });

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

async function apiLogin(email: string, password: string) {
  const body = new URLSearchParams();
  body.append('username', email);
  body.append('password', password);
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiMe(token: string) {
  const res = await fetch(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function apiSignup(email: string, password: string, role: Role, display_name: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role, display_name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function LoginScreen({ navigation }: any) {
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('operator@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    try {
      setError(null);
      const { access_token } = await apiLogin(email, password);
      const me = await apiMe(access_token);
      setAuth({ token: access_token, role: me.role });
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Вход</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }} />
      <TextInput placeholder="Пароль" value={password} secureTextEntry onChangeText={setPassword} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }} />
      {error && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}
      <TouchableOpacity onPress={onLogin} style={{ backgroundColor: '#3498db', padding: 14, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Войти</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ marginTop: 12, alignItems: 'center' }}>
        <Text style={{ color: '#3498db', fontWeight: '600' }}>Регистрация</Text>
      </TouchableOpacity>
    </View>
  );
}

function SignupScreen({ navigation }: any) {
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<Role>('operator');
  const [error, setError] = useState<string | null>(null);

  const onSignup = async () => {
    try {
      setError(null);
      await apiSignup(email.trim(), password, role, displayName || email.split('@')[0]);
      const { access_token } = await apiLogin(email.trim(), password);
      const me = await apiMe(access_token);
      setAuth({ token: access_token, role: me.role });
    } catch (e: any) {
      setError(e.message);
    }
  };

  const RoleButton = ({ value, label }: { value: Role; label: string }) => (
    <TouchableOpacity onPress={() => setRole(value)} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: role === value ? '#3498db' : '#ddd', backgroundColor: role === value ? '#eaf4fd' : '#fff', marginRight: 8 }}>
      <Text style={{ color: '#2c3e50' }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Регистрация</Text>
      <TextInput placeholder="Имя/Компания" value={displayName} onChangeText={setDisplayName} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }} />
      <TextInput placeholder="Пароль" value={password} secureTextEntry onChangeText={setPassword} style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }} />
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <RoleButton value="operator" label="Туроператор" />
        <RoleButton value="guide" label="Гид" />
        <RoleButton value="traveler" label="Путешественник" />
      </View>
      {error && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}
      <TouchableOpacity onPress={onSignup} style={{ backgroundColor: '#27ae60', padding: 14, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Создать аккаунт</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 12, alignItems: 'center' }}>
        <Text style={{ color: '#3498db', fontWeight: '600' }}>Назад к входу</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function OperatorToursScreen() {
  const { auth } = useContext(AuthContext);
  const [tours, setTours] = useState<any[]>([]);
  const [title, setTitle] = useState('Новый тур');

  const load = async () => {
    const res = await fetch(`${API_URL}/operator/tours`, { headers: { Authorization: `Bearer ${auth.token}` } });
    setTours(await res.json());
  };

  useEffect(() => { if (auth.token) load(); }, [auth.token]);

  const create = async () => {
    await fetch(`${API_URL}/operator/tours`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: '', price: 0, currency: 'RUB', images: [] }),
    });
    setTitle('Новый тур');
    load();
  };

  const publish = async (id: number) => {
    await fetch(`${API_URL}/operator/tours/${id}/publish`, { method: 'POST', headers: { Authorization: `Bearer ${auth.token}` } });
    load();
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Мои туры</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TextInput value={title} onChangeText={setTitle} placeholder="Название" style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginRight: 8 }} />
        <TouchableOpacity onPress={create} style={{ backgroundColor: '#27ae60', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>Добавить</Text>
        </TouchableOpacity>
      </View>
      {tours.map((t) => (
        <View key={t.id} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontWeight: '600' }}>{t.title}</Text>
          <Text style={{ color: '#7f8c8d' }}>{t.is_active ? 'Опубликован' : 'Черновик'}</Text>
          {!t.is_active && (
            <TouchableOpacity onPress={() => publish(t.id)} style={{ marginTop: 8, backgroundColor: '#3498db', padding: 10, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: '#fff' }}>Опубликовать</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

function GuideActivitiesScreen() {
  const { auth } = useContext(AuthContext);
  const [activities, setActivities] = useState<any[]>([]);
  const [title, setTitle] = useState('Новая активность');

  const load = async () => {
    const res = await fetch(`${API_URL}/guide/activities`, { headers: { Authorization: `Bearer ${auth.token}` } });
    setActivities(await res.json());
  };

  useEffect(() => { if (auth.token) load(); }, [auth.token]);

  const create = async () => {
    await fetch(`${API_URL}/guide/activities`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: '' }),
    });
    setTitle('Новая активность');
    load();
  };

  const publish = async (id: number) => {
    await fetch(`${API_URL}/guide/activities/${id}/publish`, { method: 'POST', headers: { Authorization: `Bearer ${auth.token}` } });
    load();
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Мои активности</Text>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <TextInput value={title} onChangeText={setTitle} placeholder="Название" style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginRight: 8 }} />
        <TouchableOpacity onPress={create} style={{ backgroundColor: '#27ae60', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>Добавить</Text>
        </TouchableOpacity>
      </View>
      {activities.map((a) => (
        <View key={a.id} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontWeight: '600' }}>{a.title}</Text>
          <Text style={{ color: '#7f8c8d' }}>{a.is_active ? 'Опубликована' : 'Черновик'}</Text>
          {!a.is_active && (
            <TouchableOpacity onPress={() => publish(a.id)} style={{ marginTop: 8, backgroundColor: '#3498db', padding: 10, borderRadius: 8, alignItems: 'center' }}>
              <Text style={{ color: '#fff' }}>Опубликовать</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

function OperatorTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Tours" component={OperatorToursScreen} options={{ title: 'Туры', tabBarIcon: ({ color, size }) => <MaterialIcons name="tour" color={color} size={size} /> }} />
    </Tabs.Navigator>
  );
}

function GuideTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Activities" component={GuideActivitiesScreen} options={{ title: 'Активности', tabBarIcon: ({ color, size }) => <MaterialIcons name="hiking" color={color} size={size} /> }} />
    </Tabs.Navigator>
  );
}

function Root(): JSX.Element {
  const { auth } = useContext(AuthContext);
  if (!auth.token)
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    ) as any;
  if (auth.role === 'operator') return <OperatorTabs /> as any;
  if (auth.role === 'guide') return <GuideTabs /> as any;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Для роли {auth.role} вкладки будут добавлены позже</Text>
    </View>
  );
}

export default function App() {
  const [auth, setAuth] = useState<AuthState>({ token: null, role: null });
  useEffect(() => {
    (async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch {}
    })();
  }, []);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

