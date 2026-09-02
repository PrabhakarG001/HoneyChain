import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import { hiveService } from '../../../services/hive.service';
import { addHiveSchema } from '../schemas/hive.schema';
import styles from './AddHiveScreen.styles';

export default function AddHiveScreen() {
  const router = useRouter();
  const { farmId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addHiveSchema),
    defaultValues: {
      beeSpecies: ''
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
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add New Hive</Text>

        <Controller
          control={control} name="beeSpecies"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Bee Species" placeholder="e.g. Apis mellifera" onBlur={onBlur} onChangeText={onChange} value={value ?? ''} error={errors.beeSpecies?.message} />
          )}
        />

        <View style={styles.submitContainer}>
          <Button title="Create Hive" onPress={handleSubmit((d) => mutation.mutate(d))} isLoading={mutation.isPending} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
