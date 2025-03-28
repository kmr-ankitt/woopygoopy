import RegisterForm from "@/components/ui/RegisterForm";
import colors from "@/styles/colors";
import { StyleSheet, Text, View } from "react-native";

export default function register() {
  return (
    <View style={styles.container}>
      <RegisterForm />
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
