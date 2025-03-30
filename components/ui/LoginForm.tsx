import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput } from "react-native-paper";
import Button from "@/components/ui/Button";
import colors from "@/styles/colors";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await axios.post("http://172.168.168.25:4000/api/user/login", {
        email: data.email,
        password: data.password,
      });

      // Save email to local storage
      await AsyncStorage.setItem("userEmail", data.email);

      Alert.alert("Success", "Login successful!");
      router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Email"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            mode="outlined"
            error={!!errors.email}
            style={styles.input}
            textColor={colors["zinc-400"]}
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry
            mode="outlined"
            error={!!errors.password}
            style={styles.input}
            textColor={colors["zinc-400"]}
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <Button value={loading ? "Logging in..." : "Login"} onSubmit={handleSubmit(onSubmit)} width="100%" disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: colors["zinc-200"],
    fontVariant: ["small-caps"],
  },
  input: {
    marginBottom: 15,
    backgroundColor: colors["zinc-950"],
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});