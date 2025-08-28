import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { listBoosts, computeMultiplier, isBoostActive } from '../../lib/boosts';

export default function BookingFunnelScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; title?: string; price?: string }>();
  const basePrice = Number(params.price ?? '0') || 0;
  const title = params.title || 'Выбранный тур';

  const [step, setStep] = React.useState<number>(0);
  const steps = ['Даты', 'Люди', 'Опции', 'Итоги'];

  const [date, setDate] = React.useState<string>('');
  const [people, setPeople] = React.useState<number>(2);
  const [withTransfer, setWithTransfer] = React.useState<boolean>(true);
  const [withPhoto, setWithPhoto] = React.useState<boolean>(false);
  const [multiplier, setMultiplier] = React.useState<number>(1);
  const [activeBoosts, setActiveBoosts] = React.useState<number>(0);

  React.useEffect(() => {
    (async () => {
      try {
        const boosts = await listBoosts();
        const now = Date.now();
        setActiveBoosts(boosts.filter(b => isBoostActive(b, now)).length);
        const mult = computeMultiplier(boosts, { category: 'tours', amount: basePrice * people });
        setMultiplier(mult);
      } catch {}
    })();
  }, [basePrice, people]);

  const extrasCost = (withTransfer ? 1200 : 0) + (withPhoto ? 800 : 0);
  const subtotal = basePrice * people + extrasCost;
  const total = Math.round(subtotal * multiplier);

  const goNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setStep(s => Math.max(s - 1, 0));

  const confirm = () => {
    Alert.alert('Бронирование', `Заявка отправлена. Сумма: ${total} ₽`, [
      { text: 'Ок', onPress: () => router.replace('/(tabs)/booking') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.progressRow}>
          {steps.map((label, idx) => (
            <View key={label} style={[styles.progressDotWrap]}>
              <View style={[styles.progressDot, idx <= step && styles.progressDotActive]} />
              <Text style={[styles.progressLabel, idx === step && styles.progressLabelActive]}>{label}</Text>
              {idx < steps.length - 1 && <View style={[styles.progressLine, idx < step && styles.progressLineActive]} />}
            </View>
          ))}
        </View>

        {step === 0 && (
          <View style={styles.card}>
            <Text style={styles.section}>Выберите дату</Text>
            <View style={styles.chipsRow}>
              {['Завтра', '+2 дня', 'Выходные'].map(d => (
                <TouchableOpacity key={d} style={[styles.chip, date === d && styles.chipActive]} onPress={() => setDate(d)}>
                  <Text style={[styles.chipText, date === d && styles.chipTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.card}>
            <Text style={styles.section}>Количество людей</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity style={styles.counterBtn} onPress={() => setPeople(Math.max(1, people - 1))}><Ionicons name="remove" size={18} color="#0f172a" /></TouchableOpacity>
              <Text style={styles.counterVal}>{people}</Text>
              <TouchableOpacity style={styles.counterBtn} onPress={() => setPeople(people + 1)}><Ionicons name="add" size={18} color="#0f172a" /></TouchableOpacity>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            <Text style={styles.section}>Доп. опции</Text>
            <TouchableOpacity style={[styles.optionRow, withTransfer && styles.optionRowActive]} onPress={() => setWithTransfer(v => !v)}>
              <Ionicons name={withTransfer ? 'checkbox' : 'square-outline'} size={20} color={withTransfer ? '#16a34a' : '#64748b'} />
              <Text style={styles.optionText}>Трансфер (+1200 ₽)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionRow, withPhoto && styles.optionRowActive]} onPress={() => setWithPhoto(v => !v)}>
              <Ionicons name={withPhoto ? 'checkbox' : 'square-outline'} size={20} color={withPhoto ? '#16a34a' : '#64748b'} />
              <Text style={styles.optionText}>Фотосессия (+800 ₽)</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.card}>
            <Text style={styles.section}>Итоги</Text>
            <View style={styles.rowBetween}><Text style={styles.lineLabel}>Базовая цена</Text><Text style={styles.lineVal}>{basePrice} ₽ × {people}</Text></View>
            <View style={styles.rowBetween}><Text style={styles.lineLabel}>Опции</Text><Text style={styles.lineVal}>{extrasCost} ₽</Text></View>
            <View style={styles.rowBetween}><Text style={styles.lineLabel}>Множитель бустов</Text><Text style={styles.lineVal}>× {multiplier.toFixed(2)}</Text></View>
            <View style={styles.divider} />
            <View style={styles.rowBetween}><Text style={styles.totalLabel}>Итого</Text><Text style={styles.totalVal}>{total} ₽</Text></View>
            <Text style={styles.smallNote}>Активных бустов: {activeBoosts}</Text>
          </View>
        )}

        <View style={styles.navRow}>
          <TouchableOpacity style={[styles.navBtn, step === 0 && styles.navBtnDisabled]} disabled={step === 0} onPress={goPrev}>
            <Text style={[styles.navText, step === 0 && styles.navTextDisabled]}>Назад</Text>
          </TouchableOpacity>
          {step < steps.length - 1 ? (
            <TouchableOpacity style={[styles.navBtn, styles.navPrimary]} onPress={goNext}>
              <Text style={[styles.navText, styles.navPrimaryText]}>Далее</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.navBtn, styles.navPrimary]} onPress={confirm}>
              <Text style={[styles.navText, styles.navPrimaryText]}>Подтвердить</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  progressRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', rowGap: 10, marginBottom: 12 },
  progressDotWrap: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#cbd5e1' },
  progressDotActive: { backgroundColor: '#0891b2' },
  progressLabel: { marginLeft: 6, color: '#475569', fontWeight: '700' },
  progressLabelActive: { color: '#0f172a' },
  progressLine: { width: 20, height: 2, backgroundColor: '#e2e8f0', marginLeft: 10 },
  progressLineActive: { backgroundColor: '#0891b2' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  section: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 10 },
  chipsRow: { flexDirection: 'row' },
  chip: { height: 34, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: '#cbd5e1', justifyContent: 'center', backgroundColor: '#fff', marginRight: 8 },
  chipActive: { backgroundColor: '#e0f2fe', borderColor: '#7dd3fc' },
  chipText: { color: '#0f172a', fontWeight: '700' },
  chipTextActive: { color: '#075985' },
  counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  counterBtn: { width: 40, height: 40, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  counterVal: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  optionRowActive: { backgroundColor: '#f0f9ff', borderRadius: 8, paddingHorizontal: 8 },
  optionText: { color: '#0f172a', fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  lineLabel: { color: '#475569' },
  lineVal: { color: '#0f172a', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 8 },
  totalLabel: { color: '#0f172a', fontSize: 16, fontWeight: '800' },
  totalVal: { color: '#0f172a', fontSize: 18, fontWeight: '800' },
  smallNote: { color: '#64748b', marginTop: 6 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  navBtn: { height: 44, borderRadius: 12, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e5e7eb' },
  navBtnDisabled: { opacity: 0.5 },
  navText: { color: '#0f172a', fontWeight: '800' },
  navTextDisabled: { color: '#475569' },
  navPrimary: { backgroundColor: '#0891b2' },
  navPrimaryText: { color: '#fff' },
});

