import { useForm } from "react-hook-form";
import { Button, TextField, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import * as apiAuth from "../../api/auth";


export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await apiAuth.register(data);
      alert("Registered successfully! Check your email to verify your account.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Box maxWidth={360} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Register</Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          {...register("name", { required: "Name is required"})}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          {...register("email", { required: "Email is required" })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>
    </Box>
  );
}
