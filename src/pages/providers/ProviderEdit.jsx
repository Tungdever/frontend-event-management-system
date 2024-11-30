import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProviderForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { providerId } = useParams(); // Lấy providerId từ URL
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null); // State để lưu dữ liệu provider

  useEffect(() => {
    // Gọi API để lấy thông tin của provider theo ID
    const fetchProvider = async () =>  {
      try {
        const response = await axios.get(`http://localhost:8080/man/provider/${providerId}`,  {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          });
 
        const providerData = response.data;
        setInitialValues({
          id: providerData.id,
          name: providerData.name,
          contact: providerData.contact,
          email: providerData.email,
          phone: providerData.phone,
          address: providerData.address,
          website: providerData.website,
        });
      } catch (error) {
        console.error("Error fetching provider data:", error);
        alert("Failed to load provider details. Please try again.");
      }
    };

    fetchProvider();
  }, [providerId]);

  const handleFormSubmit = async (values) => {
    try {
      // Gửi request PUT để cập nhật provider
      const response = await axios.put(`http://localhost:8080/man/provider`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`, // Thêm JWT token từ localStorage
        },
      });
      alert("Provider updated successfully!");
      console.log("Response:", response.data);
      navigate("/providers"); // Quay lại trang danh sách provider sau khi cập nhật
    } catch (error) {
      console.error("Error updating provider:", error);
      alert("Failed to update provider. Please try again.");
    }
  };

  if (!initialValues) {
    // Hiển thị loading khi đang tải dữ liệu
    return <div>Loading provider details...</div>;
  }

  return (
    <Box m="20px">
      <Header title="EDIT PROVIDER" subtitle="Edit Provider Details" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize // Kích hoạt cập nhật giá trị initialValues khi dữ liệu được tải xong
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
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Provider Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Person"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Phone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Website"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.website}
                name="website"
                error={!!touched.website && !!errors.website}
                helperText={touched.website && errors.website}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update Provider
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const validationSchema = yup.object().shape({
  name: yup.string().required("Provider name is required"),
  contact: yup.string().required("Contact person is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Phone is required"),
  address: yup.string().required("Address is required"),
  website: yup.string().url("Invalid URL").required("Website is required"),
});

export default EditProviderForm;
