import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  Typography,
  IconButton
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useState, useEffect } from "react";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useNavigate } from "react-router-dom";

const SponsorAdd = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [sponsorshipLevels, setSponsorshipLevels] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // Fetch sponsorship levels from API
  useEffect(() => {
    const fetchSponsorshipLevels = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/man/sponsorship",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        setSponsorshipLevels(response.data.data);
      } catch (error) {
        console.error("Error fetching sponsorship levels:", error);
      }
    };
    fetchSponsorshipLevels();
  }, []);
  const onBack = async () => {
    navigate(`/sponsors`);
  };
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
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

      const response = await axios.post(
        "http://localhost:8080/man/sponsor",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert("Sponsor added successfully!");
      console.log("Response:", response.data);
      resetForm();
      setPreviewImage(null); // Reset preview image
    } catch (error) {
      console.error("Error adding sponsor:", error);
      alert("Failed to add sponsor. Please try again.");
    }
  };

  return (
    <Box m="20px">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onBack}>
          <ArrowBackOutlinedIcon style={{ color: '#3f51b5' }} />
        </IconButton>
        <Typography variant="h4" gutterBottom style={{ color: '#3f51b5', fontWeight: 'bold', marginLeft: '10px' }}>
          Thêm Sponsors
        </Typography>
      </div>

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
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start" // Căn trái đúng
                sx={{ gridColumn: "span 4" }}
              >
                {previewImage ? (
                  <Box
                    component="img"
                    src={previewImage}
                    alt="Preview"
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      objectFit: "cover",
                      mb: 2,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      backgroundColor: "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      No Image
                    </Typography>
                  </Box>
                )}
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    textTransform: "none",
                    width: "fit-content", // Giới hạn chiều rộng
                    padding: "6px 16px", // Giữ kích thước đẹp
                  }}
                >
                  Choose Logo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFieldValue("sponsorLogo", file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setPreviewImage(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Button>
                {touched.sponsorLogo && errors.sponsorLogo && (
                  <FormHelperText error>{errors.sponsorLogo}</FormHelperText>
                )}
              </Box>

              {/* Các trường input khác */}
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
                    <MenuItem
                      key={level.sponsorShipID}
                      value={level.sponsorShipID}
                    >
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
  sponsorshipId: yup.string().required("Sponsorship level is required"),
  sponsorLogo: yup.mixed(),
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
  sponsorLogo: null,
};

export default SponsorAdd;
