import { LayoutAnimation, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { View } from '@/components/Themed';
import Button from '@/components/ui/Button';
import colors from '@/styles/colors';
import { FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TabOneScreen() {
  const submitHandler = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    router.push('/auth/login')
  }

  return (
    <View style={styles.container}>
      <View style={{
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
      }}>
        <Text style={styles.title}>Woopygoopy</Text>
        <FontAwesome5 name="briefcase-medical" size={45} color={colors['red-400']} />
      </View>
      <Button value='START' width={'60%'} onSubmit={submitHandler} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors['zinc-200'],
    fontVariant: ['small-caps'],
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  icon: {
    color: colors['red-400'],
  }
});
