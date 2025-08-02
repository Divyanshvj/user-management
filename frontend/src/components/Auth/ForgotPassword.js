import { useForm } from "react-hook-form";
import { Box, Typography, TextField, Button } from "@mui/material";
import * as apiAuth from "../../api/auth";
import { useState } from "react";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState(null);

  const onSubmit = async (data) => {
    try {
      await apiAuth.forgotPassword({ email: data.email });
      setMessage("Password reset link sent to your email.");
    } catch {
      setMessage("Failed to send reset link. Try again.");
    }
  };

  return (
    <Box maxWidth={360} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Forgot Password</Typography>
      {message ? (
        <Typography>{message}</Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register("email", { required: "Email is required" })}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Send Reset Link
          </Button>
        </form>
      )}
    </Box>
  );
}
