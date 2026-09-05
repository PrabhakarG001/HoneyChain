import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import { hiveService } from '../../../services/hive.service';
import styles from './AddHiveScreen.styles';
import { useThemeColors } from '../../../hooks/useThemeColors';

const addHiveFormSchema = z.object({
  name: z.string().min(1, 'Hive name is required'),
  location: z.string().optional(),
  beeSpecies: z.string().optional()
});

export default function AddHiveScreen() {
  const router = useRouter();
  const { farmId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const colors = useThemeColors();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addHiveFormSchema),
    defaultValues: {
      name: '',
      location: '',
      beeSpecies: 'Apis mellifera'
    }
  });

  const mutation = useMutation({
    mutationFn: (data) => hiveService.createHive({ ...data, farmId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hives', farmId] });
      router.back();
    }
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Add New Hive</Text>

        <Controller
          control={control} name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Hive Name" placeholder="e.g. Hive Alpha-01" onBlur={onBlur} onChangeText={onChange} value={value ?? ''} error={errors.name?.message} />
          )}
        />

        <Controller
          control={control} name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Location / Position" placeholder="e.g. North Apiary Field" onBlur={onBlur} onChangeText={onChange} value={value ?? ''} />
          )}
        />

        <Controller
          control={control} name="beeSpecies"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Bee Species" placeholder="e.g. Apis mellifera" onBlur={onBlur} onChangeText={onChange} value={value ?? ''} error={errors.beeSpecies?.message} />
          )}
        />

        <View style={styles.submitContainer}>
          {mutation.isError && (
            <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
              {mutation.error?.response?.data?.detail || mutation.error?.message || 'Failed to create hive'}
            </Text>
          )}
          <Button title="Create Hive" onPress={handleSubmit((d) => mutation.mutate(d))} isLoading={mutation.isPending} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
