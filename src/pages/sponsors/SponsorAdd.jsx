import { Box, Button, TextField, Select, MenuItem, FormHelperText, FormControl } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect } from "react";

const SponsorAddForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [sponsorshipLevels, setSponsorshipLevels] = useState([]);

  // Fetch sponsorship levels from API
  useEffect(() => {
    const fetchSponsorshipLevels = async () => {
      try {
        const response = await axios.get("http://localhost:8080/man/sponsorship",  {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`, // Thêm JWT token từ localStorage
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
      const sponsorDTO = {
        name: values.name,
        contact: values.contact,
        email: values.email,
        phone: values.phone,
        address: values.address,
        website: values.website,
        sponsorshipId: values.sponsorshipId, // Gửi sponsorshipId
        sponsorshipLevel: values.sponsorshipLevel, // Gửi tên cấp độ
      };

      const response = await axios.post("http://localhost:8080/man/sponsor", sponsorDTO, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjI5MTUzOCwiZXhwIjoxNzMyODk2MzM4LCJyb2xlcyI6WyJST0xFX0FETUlOIl19.nur9f7xHbpDJy_gNtwZPJ8AOINfalsIIU30oEu8s2GwDvo5UWBKtiur7tmWYnGhLVBA__e2TSpxE7b6HB9uxgw`, // Thêm JWT token từ localStorage
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
  sponsorshipId: yup.number().required("Sponsorship level is required"),
});

const initialValues = {
  name: "",
  contact: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  sponsorshipId: "",
  sponsorshipLevel: "",
};

export default SponsorAddForm;
