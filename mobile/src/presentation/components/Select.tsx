import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors, radius, shadow, spacing } from '../theme/colors';

export type SelectOption = { label: string; value: string };

type Props = {
  value: string;
  placeholder: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  hasError?: boolean;
  testID?: string;
};

export const Select = ({
  value,
  placeholder,
  options,
  onChange,
  hasError,
  testID,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <TouchableOpacity
        style={[styles.field, hasError && styles.fieldError]}
        onPress={() => setOpen(true)}
        testID={testID}
      >
        <Text style={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={styles.list}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.optionSelected]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    testID={`option-${item.value}`}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  fieldError: { borderColor: colors.error, backgroundColor: colors.errorLight },
  value: { fontSize: 16, color: colors.text, fontWeight: '600' },
  placeholder: { fontSize: 16, color: colors.textMuted },
  chevron: { fontSize: 12, color: colors.textMuted },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    maxHeight: 340,
    overflow: 'hidden',
    ...shadow.lg,
  },
  list: { flexGrow: 0 },
  option: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionSelected: { backgroundColor: colors.primaryGhost },
  optionText: { fontSize: 16, color: colors.text, textAlign: 'center', fontWeight: '600' },
  optionTextSelected: { color: colors.primary, fontWeight: '800' },
});
