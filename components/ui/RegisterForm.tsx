import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Button from "@/components/ui/Button";
import colors from "@/styles/colors";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HOUSES = ["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"];

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  house: z.enum(["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"], {
    message: "Invalid house selection",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/register`, {
        name: data.name,
        email: data.email,
        house: data.house,
        password: data.password,
      });

      // Save email to local storage
      await AsyncStorage.setItem("userEmail", data.email);

      Alert.alert("Success", "Registration completed!");
      reset();
      router.replace("/dashboard");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Name"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            mode="outlined"
            error={!!errors.name}
            style={styles.input}
            textColor={colors["zinc-400"]}
          />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

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
        name="house"
        render={({ field: { onChange, value } }) => (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={value}
              onValueChange={onChange}
              style={styles.picker}
            >
              <Picker.Item label="Select House" value="" />
              {HOUSES.map((house) => (
                <Picker.Item key={house} label={house} value={house} />
              ))}
            </Picker>
          </View>
        )}
      />
      {errors.house && <Text style={styles.errorText}>{errors.house.message}</Text>}

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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Confirm Password"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            secureTextEntry
            mode="outlined"
            error={!!errors.confirmPassword}
            style={styles.input}
            textColor={colors["zinc-400"]}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
      )}

      <Button
        value={loading ? "Registering..." : "Register"}
        onSubmit={handleSubmit(onSubmit)}
        width="100%"
        disabled={loading}
      />
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
  pickerContainer: {
    backgroundColor: colors["zinc-950"],
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    color: colors["zinc-400"],
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
