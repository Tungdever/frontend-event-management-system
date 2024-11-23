import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";

const ProviderServiceAddForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Giả sử bạn có một danh sách các nhà cung cấp để hiển thị trong dropdown
  const providerOptions = [
    { id: 101, name: "Provider 1" },
    { id: 102, name: "Provider 2" },
    { id: 103, name: "Provider 3" },
  ];

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post("http://localhost:8080/man/proService/add", values, {
        headers: {
          "Content-Type": "application/json",
        },
      });
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
      <Header title="ADD PROVIDER SERVICE" subtitle="Add a New Service for Provider" />

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
                type="number"
                label="Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.price}
                name="price"
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                sx={{ gridColumn: "span 4" }}
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
                sx={{ gridColumn: "span 4" }}
              />
              
              {/* Dropdown menu for Provider ID */}
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 4" }}>
                <InputLabel>Provider ID</InputLabel>
                <Select
                  label="Provider ID"
                  name="providerId"
                  value={values.providerId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.providerId && !!errors.providerId}
                >
                  {providerOptions.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.providerId && errors.providerId && (
                  <div style={{ color: 'red' }}>{errors.providerId}</div>
                )}
              </FormControl>
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
  price: yup.number().required("Price is required").positive("Price must be a positive number"),
  duration: yup.string().required("Duration is required"),
  providerId: yup.number().required("Provider ID is required").positive("Provider ID must be a positive number"),
});

const initialValues = {
  serviceType: "",
  serviceName: "",
  serviceDesc: "",
  price: "",
  duration: "",
  providerId: "",
};

export default ProviderServiceAddForm;
