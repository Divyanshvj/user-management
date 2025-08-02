import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as apiAuth from "../../api/auth";
import { Box, Typography, Button } from "@mui/material";

export default function EmailVerification() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        await apiAuth.verifyEmail(token);
        setSuccess(true);
        setMessage("Email successfully verified! You can now login.");
      } catch {
        setMessage("Verification failed or token expired.");
      }
    }
    verify();
  }, [token]);

  return (
    <Box maxWidth={400} mx="auto" mt={8} p={3} boxShadow={3} borderRadius={2} textAlign="center">
      <Typography variant="h6" mb={2}>{message}</Typography>
      {success && (
        <Button variant="contained" href="/login">
          Go to Login
        </Button>
      )}
      {!success && (
        <Button variant="contained" href="/register">
          Register Again
        </Button>
      )}
    </Box>
  );
}
