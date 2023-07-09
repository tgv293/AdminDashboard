import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { Link, useParams, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isChange, setIsChange] = useState(false); // Biến state để theo dõi sự thay đổi

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Users/${id}`
        );

        const userData = await response.json();

        // Chuyển đổi định dạng chuỗi thành ngày
        const birthdayParts = userData.Birthday.split("/");
        const formattedBirthday = `${birthdayParts[2]}-${birthdayParts[1]}-${birthdayParts[0]}`;
        userData.Birthday = formattedBirthday;

        setUser(userData);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleSubmit = async (values) => {
    const formattedBirthday = values.Birthday.split("-").reverse().join("/");
    values.Birthday = formattedBirthday;
    try {
      await fetch(`https://64a4e0ad00c3559aa9bec3c3.mockapi.io/Users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      // Chuyển hướng về trang "/users"
      navigate("/users");
    } catch (error) {
      console.log("Error updating user data:", error);
    }
  };

  if (!user) {
    return <Box m="20px">Đang tải dữ liệu vui lòng chờ...</Box>;
  }

  const handleFormChange = () => {
    if (!isChange) {
      setIsChange(true); // Đánh dấu có sự thay đổi đầu tiên
    }
  };

  return (
    <Box m="20px">
      <Header title="NGƯỜI DÙNG" subtitle="Thông tin người dùng" />

      <Formik
        onSubmit={handleSubmit}
        initialValues={user}
        validationSchema={checkoutSchema}
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
                <FormLabel htmlFor="lastName">Họ</FormLabel>
                <TextField
                  id="lastName"
                  type="text"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  name="lastName"
                  value={values.lastName}
                  error={!!touched.lastName && !!errors.lastName}
                  variant="standard"
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
                {touched.lastName && errors.lastName && (
                  <Box color="red">{errors.lastName}</Box>
                )}
              </FormControl>
              <FormControl fullWidth>
                <FormLabel htmlFor="firstName">Tên</FormLabel>
                <TextField
                  id="firstName"
                  type="text"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.firstName}
                  name="firstName"
                  error={!!touched.firstName && !!errors.firstName}
                  variant="standard"
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
                {touched.firstName && errors.firstName && (
                  <Box color="red">{errors.firstName}</Box>
                )}
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="userName">Tên đăng nhập</FormLabel>
                <TextField
                  id="userName"
                  type="text"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.userName}
                  name="userName"
                  error={!!touched.userName && !!errors.userName}
                  variant="standard"
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
                {touched.userName && errors.userName && (
                  <Box color="red">{errors.userName}</Box>
                )}
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="Email">Email</FormLabel>
                <TextField
                  id="Email"
                  type="text"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.Email}
                  name="Email"
                  error={!!touched.Email && !!errors.Email}
                  variant="standard"
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
                {touched.Email && errors.Email && (
                  <Box color="red">{errors.Email}</Box>
                )}
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="phoneNumber">Số điện thoại</FormLabel>
                <TextField
                  id="phoneNumber"
                  type="text"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.phoneNumber}
                  name="phoneNumber"
                  error={!!touched.phoneNumber && !!errors.phoneNumber}
                  variant="standard"
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <Box color="red">{errors.phoneNumber}</Box>
                )}
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="Address">Địa chỉ</FormLabel>
                <TextField
                  id="Address"
                  type="text"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.Address}
                  name="Address"
                  error={!!touched.Address && !!errors.Address}
                  variant="standard"
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
                {touched.Address && errors.Address && (
                  <Box color="red">{errors.Address}</Box>
                )}
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="Birthday">Ngày sinh</FormLabel>
                <TextField
                  id="Birthday"
                  type="date"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.Birthday}
                  name="Birthday"
                  error={!!touched.Birthday && !!errors.Birthday}
                  variant="standard"
                  className="custom-date-field"
                />
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="passWord">Mật khẩu</FormLabel>
                <TextField
                  id="passWord"
                  type="text"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.passWord}
                  name="passWord"
                  error={!!touched.passWord && !!errors.passWord}
                  variant="standard"
                  inputProps={{
                    autoComplete: "off",
                  }}
                />
                {touched.passWord && errors.passWord && (
                  <Box color="red">{errors.passWord}</Box>
                )}
              </FormControl>

              <FormControl fullWidth>
                <FormLabel htmlFor="Role">Cấp quyền</FormLabel>
                <TextField
                  id="Role"
                  select
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    handleFormChange(); // Gọi hàm handleFormChange() khi có sự thay đổi trong form
                  }}
                  value={values.Role}
                  name="Role"
                  error={!!touched.Role && !!errors.Role}
                  variant="standard"
                  inputProps={{
                    autoComplete: "off",
                  }}
                >
                  {Roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                {touched.Role && errors.Role && (
                  <Box color="red">{errors.Role}</Box>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="flex-end" mt="20px">
              <Link to="/users">
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

// Khai báo các giá trị và nhãn cho trường Role
const valueOptions = ["admin", "admin", "user", "user"];

const uniqueValueOptions = [...new Set(valueOptions)];

const Roles = uniqueValueOptions.map((value) => {
  const label = value.toLowerCase() === "admin" ? "Admin" : "User";

  return {
    value: value,
    label: label,
  };
});

// Biểu thức chính quy để kiểm tra định dạng số điện thoại
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

// Khai báo schema validation bằng yup
const checkoutSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[\p{L}\s]+$/u, "Tên không được chứa ký tự đặc biệt")
    .required("Bắt buộc"),
  lastName: yup
    .string()
    .matches(/^[\p{L}\s]+$/u, "Tên không được chứa ký tự đặc biệt")
    .required("Bắt buộc"),
  userName: yup.string().required("Bắt buộc"),
  Email: yup.string().email("Email không hợp lệ").required("Bắt buộc"),
  phoneNumber: yup
    .string()
    .matches(phoneRegExp, "Số điện thoại không hợp lệ")
    .length(10, "Số điện thoại phải có đúng 10 số")
    .required("Bắt buộc"),
  Address: yup.string().required("Bắt buộc"),
  passWord: yup
    .string()
    .min(6, "Mật khẩu ít nhất 6 ký tự")
    .required("Bắt buộc"),
});

export default UserProfile;
