import { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { CardData } from '../../domain/models';
import {
  CVC_LENGTH,
  detectCardBrand,
  formatCardNumber,
  isValidCardHolder,
  isValidCardNumber,
  isValidCvc,
  isValidExpiry,
  sanitizeCardNumber,
} from '../../domain/rules/card';
import { colors, radius, shadow, spacing } from '../theme/colors';
import { CardBrandLogo } from './CardBrandLogo';
import { Select, type SelectOption } from './Select';

type Props = {
  onSubmit: (card: CardData) => void;
};

const MONTH_OPTIONS: SelectOption[] = Array.from({ length: 12 }, (_, i) => {
  const value = String(i + 1).padStart(2, '0');
  return { label: value, value };
});

export const CardForm = ({ onSubmit }: Props) => {
  const [number, setNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [touched, setTouched] = useState(false);

  const brand = useMemo(() => detectCardBrand(number), [number]);
  const numberOk = isValidCardNumber(number);
  const expiryOk = isValidExpiry(expMonth, expYear);
  const cvcOk = isValidCvc(cvc);
  const holderOk = isValidCardHolder(cardHolder);
  const formValid = numberOk && expiryOk && cvcOk && holderOk;

  const error = (ok: boolean) => touched && !ok;

  const submit = () => {
    setTouched(true);
    if (!formValid) {
      return;
    }
    onSubmit({
      number: number.replace(/\D/g, ''),
      cvc,
      expMonth,
      expYear,
      cardHolder: cardHolder.trim(),
    });
  };

  return (
    <View>
      <View style={styles.field}>
        <Text style={styles.label}>Card number</Text>
        <View style={styles.numberRow}>
          <TextInput
            style={[styles.input, styles.numberInput, error(numberOk) && styles.inputError]}
            value={formatCardNumber(number)}
            onChangeText={(text) => setNumber(sanitizeCardNumber(text))}
            keyboardType="number-pad"
            placeholder="4242 4242 4242 4242"
            placeholderTextColor={colors.textMuted}
            maxLength={19}
            testID="input-card-number"
          />
          <View style={styles.brand}>
            <CardBrandLogo brand={brand} />
          </View>
        </View>
        {error(numberOk) && <Text style={styles.errorText}>Invalid card number</Text>}
      </View>

      <View style={styles.row}>
        <View style={[styles.field, styles.flex1]}>
          <Text style={styles.label}>Month</Text>
          <Select
            value={expMonth}
            placeholder="MM"
            options={MONTH_OPTIONS}
            onChange={setExpMonth}
            hasError={error(expiryOk)}
            testID="select-exp-month"
          />
        </View>

        <View style={[styles.field, styles.flex1]}>
          <Text style={styles.label}>Year (YY)</Text>
          <TextInput
            style={[styles.input, error(expiryOk) && styles.inputError]}
            value={expYear}
            onChangeText={(text) => setExpYear(text.replace(/\D/g, '').slice(0, 2))}
            keyboardType="number-pad"
            placeholder="YY"
            placeholderTextColor={colors.textMuted}
            maxLength={2}
            testID="input-exp-year"
          />
        </View>

        <View style={[styles.field, styles.flex1]}>
          <Text style={styles.label}>CVC</Text>
          <TextInput
            style={[styles.input, error(cvcOk) && styles.inputError]}
            value={cvc}
            onChangeText={(text) =>
              setCvc(text.replace(/\D/g, '').slice(0, CVC_LENGTH))
            }
            keyboardType="number-pad"
            placeholder="123"
            placeholderTextColor={colors.textMuted}
            maxLength={CVC_LENGTH}
            secureTextEntry
            testID="input-cvc"
          />
        </View>
      </View>
      {error(expiryOk) && (
        <Text style={styles.errorText}>Select a valid expiry date</Text>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Cardholder name</Text>
        <TextInput
          style={[styles.input, error(holderOk) && styles.inputError]}
          value={cardHolder}
          onChangeText={setCardHolder}
          autoCapitalize="characters"
          placeholder="JOHN DOE"
          placeholderTextColor={colors.textMuted}
          testID="input-card-holder"
        />
        {error(holderOk) && (
          <Text style={styles.errorText}>
            Enter the full name (at least 5 characters)
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, !formValid && styles.buttonDisabled]}
        onPress={submit}
        activeOpacity={0.9}
        testID="submit-card"
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.secureRow}>
        <Text style={styles.secureIcon}>🔒</Text>
        <Text style={styles.secureText}>
          Your card data is encrypted and never stored
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md },
  flex1: { flex: 1 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputError: { borderColor: colors.error, backgroundColor: colors.errorLight },
  numberRow: { position: 'relative', justifyContent: 'center' },
  numberInput: { paddingRight: 60 },
  brand: { position: 'absolute', right: spacing.md },
  errorText: { color: colors.error, fontSize: 12, marginTop: spacing.xs, fontWeight: '500' },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadow.md,
  },
  buttonDisabled: { backgroundColor: colors.textMuted, opacity: 0.5 },
  buttonText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: 6,
  },
  secureIcon: { fontSize: 12 },
  secureText: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
});
