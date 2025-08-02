import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button } from "@mui/material";
import * as apiAuth from "../../api/auth";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      await apiAuth.resetPassword(token, { password: data.password });
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch {
      setMessage("Reset token is invalid or expired.");
    }
  };

  return (
    <Box maxWidth={360} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Reset Password</Typography>
      {message ? (
        <Typography>{message}</Typography>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be 6+ chars" },
            })}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Reset Password
          </Button>
        </form>
      )}
    </Box>
  );
}
