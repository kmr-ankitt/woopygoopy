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

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  house: z.string().min(2, "House is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

type InputField = {
  name: keyof RegisterFormData;
  label: string;
  keyboardType?: "default" | "email-address" | "numeric";
  secureTextEntry?: boolean;
};

const inputFields: InputField[] = [
  { name: "name", label: "Name", keyboardType: "default" },
  { name: "email", label: "Email", keyboardType: "email-address" },
  { name: "house", label: "House", keyboardType: "default" },
  { name: "password", label: "Password", secureTextEntry: true },
  { name: "confirmPassword", label: "Confirm Password", secureTextEntry: true },
];

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
      const response = await axios.post("http://172.168.168.25:4000/api/user/register", {
        name: data.name,
        email: data.email,
        house: data.house,
        password: data.password,
      });

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
      {inputFields.map(({ name, label, keyboardType, secureTextEntry }) => (
        <View key={name}>
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, onBlur, value } }) => {
              const [isPasswordVisible, setPasswordVisible] = React.useState(false);

              return (
                <TextInput
                  label={label}
                  value={value as string}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  keyboardType={keyboardType}
                  secureTextEntry={secureTextEntry && !isPasswordVisible}
                  mode="outlined"
                  error={!!errors[name]}
                  style={styles.input}
                  textColor={colors["zinc-400"]}
                  right={
                    secureTextEntry ? (
                      <TextInput.Icon
                        icon={isPasswordVisible ? "eye-off" : "eye"}
                        onPressIn={() => setPasswordVisible(true)}
                        onPressOut={() => setPasswordVisible(false)}
                      />
                    ) : null
                  }
                />
              );
            }}
          />
          {errors[name] && <Text style={styles.errorText}>{errors[name]?.message}</Text>}
        </View>
      ))}

      <Button value={loading ? "Registering..." : "Register"} onSubmit={handleSubmit(onSubmit)} width="100%" disabled={loading} />
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

