import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View>
      <Text>Welcome</Text>
      <TouchableOpacity onPress={() => router.push('./welcome')}>
        <Text>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}