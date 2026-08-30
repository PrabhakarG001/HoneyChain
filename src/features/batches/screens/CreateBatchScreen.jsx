import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import { batchService } from '../../../services/batch.service';
import { createBatchSchema } from '../schemas/batch.schema';
import styles from './CreateBatchScreen.styles';

export default function CreateBatchScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createBatchSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => batchService.createBatch(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      router.replace(`/(app)/batches/${data.id}`);
    }
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Create Honey Batch</Text>

        <Controller
          control={control} name="farmId"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Farm ID" placeholder="e.g. farm-001" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.farmId?.message} />
          )}
        />
        <Controller
          control={control} name="hiveId"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Hive ID" placeholder="e.g. HV-UP-001" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.hiveId?.message} />
          )}
        />
        <Controller
          control={control} name="honeyType"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Honey Type" placeholder="e.g. Raw, Pasteurized" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.honeyType?.message} />
          )}
        />
        <Controller
          control={control} name="floralSource"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Floral Source" placeholder="e.g. Mustard, Multi-flora" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.floralSource?.message} />
          )}
        />
        <Controller
          control={control} name="quantity"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Quantity (kg)" keyboardType="numeric" placeholder="e.g. 50" onBlur={onBlur} onChangeText={onChange} value={value?.toString()} error={errors.quantity?.message} />
          )}
        />
        <Controller
          control={control} name="harvestDate"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Harvest Date" placeholder="YYYY-MM-DD" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.harvestDate?.message} />
          )}
        />

        <View style={styles.submitContainer}>
          <Button title="Create Batch" onPress={handleSubmit((d) => mutation.mutate(d))} isLoading={mutation.isPending} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
