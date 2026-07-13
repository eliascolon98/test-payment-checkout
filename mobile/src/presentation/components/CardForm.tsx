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
  isValidCardNumber,
  isValidCvc,
  isValidExpiry,
  sanitizeCardNumber,
} from '../../domain/rules/card';
import { colors, radius, spacing } from '../theme/colors';
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
  const holderOk = cardHolder.trim().length > 0;
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
      </View>

      <TouchableOpacity
        style={[styles.button, !formValid && styles.buttonDisabled]}
        onPress={submit}
        testID="submit-card"
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
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
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputError: { borderColor: colors.error },
  numberRow: { position: 'relative', justifyContent: 'center' },
  numberInput: { paddingRight: 60 },
  brand: { position: 'absolute', right: spacing.md },
  errorText: { color: colors.error, fontSize: 12, marginTop: spacing.xs },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: { backgroundColor: colors.textMuted, opacity: 0.6 },
  buttonText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
});
