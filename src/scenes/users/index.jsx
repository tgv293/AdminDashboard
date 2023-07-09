import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, Button, IconButton } from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  viVN,
} from "@mui/x-data-grid";
import { EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  // Chuyển hướng đến trang chỉnh sửa thông tin người dùng
  const handleEditUser = (id) => {
    navigate(`/userProfile/${id}`);
  };

  // Xử lý sự kiện thay đổi lựa chọn các hàng
  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };

  // Lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Users"
      );
      const data = await response.json();

      // Chuẩn hóa dữ liệu người dùng trước khi lưu vào state
      const formattedUsers = data.map((user) => {
        const {
          id,
          lastName,
          firstName,
          Email,
          Address,
          phoneNumber,
          Birthday,
          Role,
        } = user;

        const [day, month, year] = Birthday.split("/");
        const formattedBirthday = `${day}/${month}/${year}`;

        return {
          id,
          lastName,
          firstName,
          Email,
          Address,
          phoneNumber,
          Birthday: formattedBirthday,
          Role,
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.log("Error fetching users:", error);
      // Hiển thị thông báo lỗi cho người dùng hoặc thực hiện các xử lý khác tùy thuộc vào trường hợp sử dụng
    }
  };

  useEffect(() => {
    fetchUsers();

    // Thiết lập interval để lấy dữ liệu từ API mỗi 5 giây (có thể điều chỉnh)
    const interval = setInterval(fetchUsers, 5000);

    // Xóa interval khi component bị hủy
    return () => clearInterval(interval);
  }, []);

  // Xóa người dùng dựa trên ID
  const handleDeleteUser = async (id) => {
    try {
      // Gửi yêu cầu xóa người dùng với ID tương ứng đến API
      await fetch(`https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Users/${id}`, {
        method: "DELETE",
      });

      // Cập nhật danh sách người dùng sau khi xóa
      fetchUsers();
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      sortComparator: (v1, v2, cellParams1, cellParams2) =>
        Number(v1) - Number(v2),
    },
    {
      field: "fullName", // Trường kết hợp của firstName và lastName
      headerName: "Họ tên",
      flex: 1,
      valueGetter: (params) => `${params.row.lastName} ${params.row.firstName}`, // Hiển thị lastName trước firstName
      sortComparator: (v1, v2, cellParams1, cellParams2) => {
        const collator = new Intl.Collator("vi", {
          sensitivity: "base",
          caseFirst: "false",
        });
        const firstName1 = v1.split(" ").pop();
        const firstName2 = v2.split(" ").pop();
        return collator.compare(firstName1, firstName2);
      },
    },
    {
      field: "Email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "Address",
      headerName: "Địa chỉ",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      flex: 1,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Birthday",
      headerName: "Ngày sinh",
      flex: 0.8,
      type: "date",
      headerAlign: "left",
      align: "left",
      sortComparator: (v1, v2, cellParams1, cellParams2) => {
        const [day1, month1, year1] = v1.split("/");
        const [day2, month2, year2] = v2.split("/");

        if (year1 !== year2) {
          return year1 - year2;
        }
        if (month1 !== month2) {
          return month1 - month2;
        }
        return day1 - day2;
      },
    },
    {
      field: "Role",
      headerName: "Quyền truy cập",
      flex: 0.8,
      renderCell: ({ row }) => {
        const accessLevel = row.Role === "admin" ? "admin" : "user";

        return (
          <Box
            width="80%"
            m="0"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              accessLevel === "admin"
                ? colors.greenAccent[500]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {accessLevel === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {accessLevel === "user" && <LockOpenOutlinedIcon />}
            <Typography color="white" sx={{ ml: "5px", alignSelf: "left" }}>
              {accessLevel}
            </Typography>
          </Box>
        );
      },
      sortComparator: (v1, v2, cellParams1, cellParams2) => {
        if (v1 === "admin" && v2 === "user") {
          return 1; // admin trước user (giảm dần)
        } else if (v1 === "user" && v2 === "admin") {
          return -1; // user trước admin (tăng dần)
        } else {
          return 0; // không thay đổi thứ tự
        }
      },
    },
    {
      field: "actions",
      headerName: "",
      disableColumnMenu: true,
      sortable: false,
      flex: 0.5,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="space-around" alignItems="center">
          <IconButton onClick={() => handleEditUser(row.id)}>
            <EditOutlined />
          </IconButton>
          <IconButton onClick={() => handleDeleteUser(row.id)}>
            <DeleteOutlined />
          </IconButton>
        </Box>
      ),
    },
  ];

  const CustomToolbar = () => {
    const handleDeleteSelectedRows = async () => {
      try {
        // Lặp qua danh sách các hàng đã chọn và xóa chúng từ API
        const deleteRequests = selectedRows.map((rowId) =>
          fetch(`https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Users/${rowId}`, {
            method: "DELETE",
          })
        );

        // Chờ cho tất cả các yêu cầu xóa hoàn thành
        await Promise.all(deleteRequests);

        // Cập nhật danh sách người dùng sau khi xóa
        fetchUsers();
      } catch (error) {
        console.log("Error deleting selected rows:", error);
      }
    };

    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton text={viVN.toolbarColumns} />
        <GridToolbarFilterButton text={viVN.toolbarFilter} />
        <GridToolbarDensitySelector text={viVN.toolbarDensity} />
        <GridToolbarExport text={viVN.toolbarExport} />

        <Button
          variant="outlined"
          startIcon={
            <DeleteIcon
              sx={{ width: "18px", marginLeft: "-2px", marginRight: "-2px" }}
            />
          }
          sx={{
            color: "#e0e0e0!important",
            fontSize: "0.6964285714285714rem",
            padding: "4px 5px",
            border: "none",
            "&:hover": {
              border: "none",
            },
            "&.MuiButton-outlinedPrimary": {
              color: `${colors.grey[100]}!important`,
              borderColor: `${colors.grey[100]}!important`,
              "&:hover": {
                borderColor: `${colors.grey[100]}!important`,
              },
            },
            "&.MuiButton-outlinedSecondary": {
              color: `${colors.grey[100]}!important`,
              borderColor: `${colors.grey[100]}!important`,
              "&:hover": {
                borderColor: `${colors.grey[100]}!important`,
              },
            },
          }}
          onClick={handleDeleteSelectedRows}
        >
          Xóa
        </Button>
      </GridToolbarContainer>
    );
  };

  return (
    <Box m="0px 20px 0px 20px">
      <Header title="NGƯỜI DÙNG" subtitle="Quản lý người dùng" />
      <Box
        m="auto"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
          checkboxSelection
          rows={users}
          columns={columns}
          components={{
            Toolbar: CustomToolbar,
          }}
          onSelectionModelChange={handleSelectionChange}
          selectionModel={selectedRows}
        />
      </Box>
    </Box>
  );
};

export default Users;
