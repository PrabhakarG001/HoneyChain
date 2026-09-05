import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Input from '../../../components/ui/Input/Input';
import Button from '../../../components/ui/Button/Button';
import { farmService } from '../../../services/farm.service';
import { useAuthStore } from '../../../store/auth.store';
import { addFarmSchema } from '../schemas/farm.schema';
import styles from './AddFarmScreen.styles';
import { useThemeColors } from '../../../hooks/useThemeColors';

export default function AddFarmScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  const colors = useThemeColors();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addFarmSchema),
    defaultValues: {
      name: '',
      location: '',
      area: '',
      numberOfHives: '',
      beeSpecies: '',
      floralSource: ''
    }
  });

  const mutation = useMutation({
    mutationFn: (data) => farmService.createFarm(data, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      router.back();
    }
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Add New Farm</Text>

        <Controller
          control={control} name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Farm Name" placeholder="e.g. Sunny Valley Apiary" onBlur={onBlur} onChangeText={onChange} value={value ?? ''} error={errors.name?.message} />
          )}
        />
        <Controller
          control={control} name="location"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Location" placeholder="City, Region" onBlur={onBlur} onChangeText={onChange} value={value ?? ''} error={errors.location?.message} />
          )}
        />
        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Controller
              control={control} name="area"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Area (acres)" keyboardType="numeric" placeholder="2.5" onBlur={onBlur} onChangeText={onChange} value={value != null ? value.toString() : ''} error={errors.area?.message} />
              )}
            />
          </View>
          <View style={styles.halfWidth}>
            <Controller
              control={control} name="numberOfHives"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Initial Hives" keyboardType="numeric" placeholder="50" onBlur={onBlur} onChangeText={onChange} value={value != null ? value.toString() : ''} error={errors.numberOfHives?.message} />
              )}
            />
          </View>
        </View>
        
        <Controller
          control={control} name="beeSpecies"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Bee Species" placeholder="e.g. Apis mellifera" onBlur={onBlur} onChangeText={onChange} value={value ?? ''} error={errors.beeSpecies?.message} />
          )}
        />
        <Controller
          control={control} name="floralSource"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Primary Floral Source" placeholder="e.g. Mustard, Acacia" onBlur={onBlur} onChangeText={onChange} value={value ?? ''} error={errors.floralSource?.message} />
          )}
        />

        <View style={styles.submitContainer}>
          <Button title="Create Farm" onPress={handleSubmit((d) => mutation.mutate(d))} isLoading={mutation.isPending} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
