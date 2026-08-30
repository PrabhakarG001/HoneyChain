import { Redirect } from 'expo-router';

export default function Index() {
  // DEV BYPASS: Skip splash screen and login completely
  return <Redirect href="/(app)/dashboard" />;
}
