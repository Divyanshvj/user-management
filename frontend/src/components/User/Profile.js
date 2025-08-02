import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Button } from "@mui/material";
import * as apiUser from "../../api/user";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiUser.getProfile().then(res => setUser(res.data)).catch(() => alert("Failed to get profile"));
  }, []);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box p={3} maxWidth={400} mx="auto" textAlign="center">
      <Avatar
        src={user.profileImage ? `${process.env.REACT_APP_API_URL.replace('/api', '')}/uploads/${user.profileImage}` : ""}
        alt={user.name}
        sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
      />
      <Typography variant="h5">{user.name || "-"}</Typography>
      <Typography variant="body1">{user.email}</Typography>
      <Typography variant="body2" color="textSecondary">{user.role}</Typography>
      <Typography variant="body2" color={user.isVerified ? "green" : "red"}>
        {user.isVerified ? "Verified" : "Not Verified"}
      </Typography>
      <Button
        component={Link}
        to="/profile/edit"
        variant="contained"
        sx={{ mt: 3 }}
      >
        Edit Profile
      </Button>
    </Box>
  );
}
