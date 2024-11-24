import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useParams } from "react-router-dom"; // Để lấy providerId từ URL

const ServiceAddForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { providerId } = useParams(); // Lấy providerId từ URL

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Chuẩn bị dữ liệu gửi đi đúng định dạng DTO
      const serviceDTO = {
        ...values,
        providerId: parseInt(providerId), // Lấy providerId từ URL
      };

      const response = await axios.post(
        "http://localhost:8080/man/proService",
        serviceDTO,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`, // Thêm JWT token từ localStorage
          },
        }
      );

      alert("Service added successfully!");
      console.log("Response:", response.data);
      resetForm(); // Reset form fields after successful submission
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service. Please try again.");
    }
  };

  return (
    <Box m="20px">
      <Header title="ADD SERVICE" subtitle="Add a New Service for Provider" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
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
                label="Service Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serviceType}
                name="serviceType"
                error={!!touched.serviceType && !!errors.serviceType}
                helperText={touched.serviceType && errors.serviceType}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Service Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serviceName}
                name="serviceName"
                error={!!touched.serviceName && !!errors.serviceName}
                helperText={touched.serviceName && errors.serviceName}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Service Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.serviceDesc}
                name="serviceDesc"
                error={!!touched.serviceDesc && !!errors.serviceDesc}
                helperText={touched.serviceDesc && errors.serviceDesc}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Duration"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.duration}
                name="duration"
                error={!!touched.duration && !!errors.duration}
                helperText={touched.duration && errors.duration}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add Service
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const validationSchema = yup.object().shape({
  serviceType: yup.string().required("Service type is required"),
  serviceName: yup.string().required("Service name is required"),
  serviceDesc: yup.string().required("Service description is required"),
  price: yup.string().required("Price is required"),
  duration: yup.string().required("Duration is required"),
});

const initialValues = {
  serviceType: "",
  serviceName: "",
  serviceDesc: "",
  price: "",
  duration: "",
};

export default ServiceAddForm;
