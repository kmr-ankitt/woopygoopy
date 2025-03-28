import colors from "@/styles/colors"
import { StyleSheet, Text, View } from "react-native"

export default function index() {
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Dashboard</Text>
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
