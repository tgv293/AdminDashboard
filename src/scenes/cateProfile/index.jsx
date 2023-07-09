import { Box, Button, FormControl, FormLabel, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import "./style.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const CateProfile = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [isChange, setIsChange] = useState(false); // Biến state để theo dõi sự thay đổi

  useEffect(() => {
    // Gọi mockAPI để lấy dữ liệu danh mục dựa trên id
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Category/${id}`
        );
        const data = await response.json();

        // Chuyển đổi định dạng chuỗi thành ngày
        const createdAtParts = data.createdAt.split("/");
        const formattedCreatedAt = `${createdAtParts[2]}-${createdAtParts[1]}-${createdAtParts[0]}`;
        data.createdAt = formattedCreatedAt;

        setCategory(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (values) => {
    const formattedCreatedAt = values.createdAt.split("-").reverse().join("/");
    values.createdAt = formattedCreatedAt;
    try {
      if (id) {
        // Gọi mockAPI để cập nhật danh mục dựa trên id
        await fetch(
          `https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Category/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
      } else {
        // Gọi mockAPI để tạo danh mục mới
        await fetch("https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
      }

      // Sau khi lưu thành công, chuyển về trang danh sách danh mục
      navigate("/category");
    } catch (error) {
      console.log(error);
    }
  };

  if (!category && id) {
    return <Box m="20px">Đang tải dữ liệu vui lòng chờ...</Box>;
  }

  const handleFormChange = () => {
    if (!isChange) {
      setIsChange(true); // Đánh dấu có sự thay đổi đầu tiên
    }
  };

  return (
    <Box m="20px">
      <Header title="DANH MỤC" subtitle="Thông tin danh mục" />

      <Formik
        onSubmit={handleSubmit}
        validationSchema={checkoutSchema}
        initialValues={category || initialValues}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="1fr 1fr"
              sx={{
                "& > div": { gridColumn: undefined },
              }}
            >
              <FormControl fullWidth>
                <FormLabel htmlFor="name">Tên</FormLabel>
                <TextField
                  id="name"
                  type="text"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.name}
                  name="name"
                  error={!!touched.name && !!errors.name}
                  variant="standard"
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
                {touched.name && errors.name && (
                  <Box color="red">{errors.name}</Box>
                )}
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="createdAt">Ngày tạo</FormLabel>
                <TextField
                  id="createdAt"
                  type="date"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.createdAt}
                  name="createdAt"
                  error={!!touched.createdAt && !!errors.createdAt}
                  variant="standard"
                  className="custom-date-field"
                />
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Link to="/category">
                <Button
                  type="button"
                  color="primary"
                  variant="contained"
                  sx={{
                    minWidth: 120,
                    fontWeight: "bold",
                    color: "#ffffff",
                    backgroundColor: "#e57373",
                  }}
                >
                  Hủy bỏ
                </Button>
              </Link>
              <Box ml="10px">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  sx={{
                    minWidth: 120,
                    fontWeight: "bold",
                    color: "#ffffff",
                  }}
                  disabled={!isChange} // Vô hiệu hóa nút "Lưu" nếu không có sự thay đổi
                >
                  Lưu
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Định nghĩa schema sử dụng thư viện yup để kiểm tra và xác thực dữ liệu
const checkoutSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[\p{L}\s]+$/u, "Tên không được chứa ký tự đặc biệt")
    .required("Bắt buộc"),
});

// Giá trị khởi tạo ban đầu cho form
const initialValues = {
  name: "",
  createdAt: new Date().toISOString().split("T")[0],
};

export default CateProfile;
