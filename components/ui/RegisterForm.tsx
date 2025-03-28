import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextInput } from "react-native-paper";
import Button from "@/components/ui/Button";
import colors from "@/styles/colors";
import { router } from "expo-router";
import { Link } from "expo-router";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  age: z.coerce.number().min(1, "Age is required"),
  caretakerName: z.string().min(2, "Caretaker name is required"),
  caretakerEmail: z.string().email("Invalid caretaker email"),
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
  { name: "age", label: "Age", keyboardType: "numeric" },
  { name: "caretakerName", label: "Caretaker Name", keyboardType: "default" },
  { name: "caretakerEmail", label: "Caretaker Email", keyboardType: "email-address" },
  { name: "password", label: "Password", secureTextEntry: true },
  { name: "confirmPassword", label: "Confirm Password", secureTextEntry: true },
];

export default function RegisterForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("Register Data:", data);
    reset();
    router.replace("/dashboard"); // Redirect to homepage and replace history
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {inputFields.map(({ name, label, keyboardType, secureTextEntry }) => (
        <View key={name}>
          <Controller
            control={control}
            name={name as keyof RegisterFormData}
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
                  error={!!errors[name as keyof RegisterFormData]}
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
          {errors[name as keyof RegisterFormData] && (
            <Text style={styles.errorText}>{errors[name as keyof RegisterFormData]?.message}</Text>
          )}
        </View>
      ))}

      <Button value="Register" onSubmit={handleSubmit(onSubmit)} width={'100%'} />
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
    fontVariant: ['small-caps'],
  },
  input: {
    marginBottom: 15,
    backgroundColor: colors["zinc-950"],
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
});