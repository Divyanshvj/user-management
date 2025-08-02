import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Button, TextField, Typography, Avatar } from "@mui/material";
import * as apiUser from "../../api/user";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { handleSubmit, setValue, control } = useForm();

  useEffect(() => {
    apiUser
      .getProfile()
      .then((res) => {
        setUser(res.data);
        setValue("name", res.data.name || "");
        if (res.data.profileImage) {
          setImagePreview(
            `${process.env.REACT_APP_API_URL.replace(
              "/api",
              ""
            )}/uploads/${res.data.profileImage}`
          );
        }
      })
      .catch(() => alert("Failed to load profile"));
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.profileImage && data.profileImage.length > 0) {
        formData.append("profileImage", data.profileImage[0]);
      }

      await apiUser.updateProfile(formData);
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  return (
    <Box maxWidth={400} mx="auto" p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2} textAlign="center">
        Edit Profile
      </Typography>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        noValidate
      >
        {/* Controlled TextField for name */}
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              label="Name"
              margin="normal"
              fullWidth
              {...field}
            />
          )}
        />

        {/* Controlled file input for profileImage */}
        <Controller
          name="profileImage"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload Profile Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const files = e.target.files;
                  field.onChange(files);
                  if (files && files.length > 0) {
                    setImagePreview(URL.createObjectURL(files[0]));
                  }
                }}
              />
            </Button>
          )}
        />

        {imagePreview && (
          <Box textAlign="center" mt={2}>
            <Avatar
              src={imagePreview}
              alt="Profile Preview"
              sx={{ width: 100, height: 100, margin: "auto" }}
            />
          </Box>
        )}

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Save Changes
        </Button>
      </form>
    </Box>
  );
}
