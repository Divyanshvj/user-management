import { useForm } from "react-hook-form";
import { Button, TextField, Box, Typography, Link as MUILink } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import * as apiAuth from "../../api/auth";
import { useAuth } from "../../context/AuthContext";



export default function Login() {
  const { setUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await apiAuth.login(data);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      navigate("/profile");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box maxWidth={360} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Login</Typography>
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
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          {...register("password", { required: "Password is required" })}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
      <Box mt={2} textAlign="right">
        <MUILink component={Link} to="/forgot-password">Forgot Password?</MUILink>
      </Box>
      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Don't have an account? <MUILink component={Link} to="/register">Register</MUILink>
        </Typography>
      </Box>
    </Box>
  );
}
