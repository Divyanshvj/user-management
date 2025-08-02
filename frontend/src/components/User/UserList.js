import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, TextField, Button, Box, Typography } from "@mui/material";
import * as apiUser from "../../api/user";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiUser.getUsers(search, page, 10);
        setUsers(res.data.users);
        setTotalPages(res.data.pages);
      } catch (error) {
        alert("Error fetching users");
      }
    };
    fetchUsers();
  }, [search, page]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>User List</Typography>
      <TextField
        label="Search users"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Verified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">No users found</TableCell>
              </TableRow>
            )}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name || "-"}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
        <Typography pt={1}>{page} / {totalPages}</Typography>
        <Button variant="contained" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </Box>
    </Box>
  );
}
