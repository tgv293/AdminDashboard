import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, IconButton } from "@mui/material";
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
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

const Category = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === "dark";
  const addButtonColor = isDarkMode ? "#3e4396" : "#a4a9fc";
  const textColor = isDarkMode ? "#ffffff" : "#000000";

  const [cateData, setCateData] = useState([]);
  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (selection) => {
    setSelectedRows(selection);
  };

  const handleEditCategory = (id) => {
    navigate(`/cateProfile/${id}`);
  };

  const handleAddCategory = () => {
    navigate("/cateProfile");
  };

  const fetchCategory = async () => {
    try {
      const response = await fetch(
        "https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Category"
      );

      const data = await response.json();

      const formattedCategory = data.map((cate) => {
        const { id, name, createdAt } = cate;

        const [day, month, year] = createdAt.split("/");
        const formattedCreatedAt = `${day}/${month}/${year}`;

        return {
          id,
          name,
          createdAt: formattedCreatedAt,
        };
      });

      setCateData(formattedCategory);
    } catch (error) {
      console.log("Error fetching category:", error);
      // Hiển thị thông báo lỗi cho người dùng hoặc thực hiện các xử lý khác tùy thuộc vào trường hợp sử dụng
    }
  };

  useEffect(() => {
    fetchCategory();

    // Thiết lập interval để fetch dữ liệu mỗi 5 giây (có thể điều chỉnh theo nhu cầu)
    const interval = setInterval(fetchCategory, 5000);

    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  }, []);

  const handleDeleteCategory = async (id) => {
    try {
      // Gửi yêu cầu fetch đến API endpoint để xóa danh mục với id đã cho
      await fetch(
        `https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Category/${id}`,
        {
          method: "DELETE",
        }
      );

      // Fetch và cập nhật danh mục sau khi xóa
      fetchCategory();
    } catch (error) {
      console.log("Error deleting category:", error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.3,
      sortComparator: (v1, v2, cellParams1, cellParams2) =>
        Number(v1) - Number(v2),
    },
    {
      field: "name",
      headerName: "Tên",
      flex: 2,
      cellClassName: "name-column--cell",
      sortComparator: (a, b) =>
        a.localeCompare(b, "vi", { sensitivity: "base" }),
    },
    {
      field: "createdAt",
      headerName: "Ngày tạo",
      flex: 1,
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
      field: "actions",
      headerName: "",
      disableColumnMenu: true,
      sortable: false,
      flex: 0.35,
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="space-around">
          <IconButton onClick={() => handleEditCategory(row.id)}>
            <EditOutlined />
          </IconButton>

          <IconButton onClick={() => handleDeleteCategory(row.id)}>
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
          fetch(
            `https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Category/${rowId}`,
            {
              method: "DELETE",
            }
          )
        );

        // Chờ cho tất cả các yêu cầu xóa hoàn thành
        await Promise.all(deleteRequests);

        // Cập nhật danh sách người dùng sau khi xóa
        fetchCategory();
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

        <Button
          variant="contained"
          sx={{
            marginLeft: "auto",
            marginBottom: "5px",
            borderRadius: "4px",
            color: textColor,
            backgroundColor: addButtonColor,
            "&:hover": {
              backgroundColor: addButtonColor,
            },
          }}
          onClick={handleAddCategory}
        >
          Thêm danh mục
        </Button>
      </GridToolbarContainer>
    );
  };

  return (
    <Box m="0px 20px 0px 20px">
      <Header title="DANH MỤC" subtitle="Quản lý danh mục" />
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
            color: `${colors.white} !important`,
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
          rows={cateData}
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

export default Category;
