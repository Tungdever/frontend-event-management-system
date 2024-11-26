import { Box, Button, TextField, Select, MenuItem, FormHelperText, FormControl } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect } from "react";

const SponsorAdd = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [sponsorshipLevels, setSponsorshipLevels] = useState([]);

  // Fetch sponsorship levels from API
  useEffect(() => {
    const fetchSponsorshipLevels = async () => {
      try {
        const response = await axios.get("http://localhost:8080/man/sponsorship",  {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
            },
          });
        setSponsorshipLevels(response.data.data);
      } catch (error) {
        console.error("Error fetching sponsorship levels:", error);
      }
    };
    fetchSponsorshipLevels();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      // Gửi file logo lên API
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("contact", values.contact);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("website", values.website);
      formData.append("sponsorshipId", values.sponsorshipId);
      formData.append("sponsorshipLevel", values.sponsorshipLevel);

      // Nếu có logo, thêm vào formData
      if (values.sponsorLogo) {
        formData.append("logo", values.sponsorLogo);
      }
      
      const response = await axios.post("http://localhost:8080/man/sponsor", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`,
        },
      });
      alert("Sponsor added successfully!");
      console.log("Response:", response.data);
      resetForm();
    } catch (error) {
      console.error("Error adding sponsor:", error);
      alert("Failed to add sponsor. Please try again.");
    }
  };

  return (
    <Box m="20px">
      <Header title="ADD SPONSOR" subtitle="Add a New Sponsor" />

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
          setFieldValue,
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
              {/* Các trường input */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Sponsor Name"
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
                label="Contact"
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

              {/* Logo File Upload */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFieldValue("sponsorLogo", e.target.files[0])}
                style={{ gridColumn: "span 4", marginTop: "16px" }}
              />
              {touched.sponsorLogo && errors.sponsorLogo && (
                <FormHelperText error>{errors.sponsorLogo}</FormHelperText>
              )}

              {/* Sponsorship Level Select */}
              <FormControl
                fullWidth
                variant="filled"
                error={!!touched.sponsorshipId && !!errors.sponsorshipId}
                sx={{ gridColumn: "span 4" }}
              >
                <Select
                  value={values.sponsorshipId || ""}
                  onChange={(e) => {
                    const selected = sponsorshipLevels.find(
                      (level) => level.sponsorShipID === e.target.value
                    );
                    setFieldValue("sponsorshipId", e.target.value);
                    setFieldValue("sponsorshipLevel", selected?.level || "");
                  }}
                  onBlur={handleBlur}
                  name="sponsorshipId"
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Sponsorship Level
                  </MenuItem>
                  {sponsorshipLevels.map((level) => (
                    <MenuItem key={level.sponsorShipID} value={level.sponsorShipID}>
                      {level.level}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {touched.sponsorshipId && errors.sponsorshipId}
                </FormHelperText>
              </FormControl>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Add Sponsor
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const validationSchema = yup.object().shape({
  name: yup.string().required("Sponsor name is required"),
  contact: yup.string().required("Contact is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  address: yup.string().required("Address is required"),
  website: yup.string().url("Invalid URL").required("Website is required"),
  sponsorLogo: yup.mixed().required("Logo is required"),
  sponsorshipId: yup.string().required("Sponsorship level is required"),
});

const initialValues = {
  name: "",
  contact: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  sponsorLogo: null,
  sponsorshipId: "",
  sponsorshipLevel: "",
};

export default SponsorAdd;
