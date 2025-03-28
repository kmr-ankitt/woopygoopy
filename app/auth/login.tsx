import { View } from "@/components/Themed";
import Button from "@/components/ui/Button";
import LoginForm from "@/components/ui/LoginForm";
import colors from "@/styles/colors";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";

export default function login() {
  return (
    <View style={styles.container}>
      <LoginForm />
      <Link href={'/auth/register'}>
        <Text style={styles.textStyle}>
          Don't have an account? Sign up
        </Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  textStyle: {
    textAlign: "center",
    marginTop: 10,
    color: colors["zinc-500"]
  }
})
