import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const ProviderServiceDetail = () => {
  const { serviceId } = useParams(); // Lấy các tham số từ URL

  // Tạo instance Axios
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/man/proService', // Base URL của Spring Boot
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });

  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        console.log("Fetching providerId from URL:", serviceId);
        const response = await axiosInstance.get(`/${serviceId}`);

        console.log(response.data); // Kiểm tra dữ liệu trả về từ API
        setServiceData(response.data.data); // Lưu dữ liệu thực tế vào state (truy cập vào data)
      } catch (err) {
        console.error('Error fetching service data: ', err); // In lỗi ra console để debug
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId]);


  // Khi đang tải dữ liệu, hiển thị vòng tròn loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Nếu có lỗi khi tải dữ liệu, hiển thị thông báo lỗi
  if (error) {
    return (
      <Box sx={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <Typography variant="h6">Error: {error}</Typography>
      </Box>
    );
  }

  // Hiển thị thông tin dịch vụ khi đã tải thành công
  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
        {serviceData?.serviceName}
      </Typography>

      <Paper sx={{ padding: '20px', boxShadow: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Service Type:
        </Typography>
        <Typography sx={{ marginBottom: '10px' }}>
          {serviceData?.serviceType}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Description:
        </Typography>
        <Typography sx={{ marginBottom: '10px' }}>
          {serviceData?.serviceDesc}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Price:
        </Typography>
        <Typography sx={{ marginBottom: '10px' }}>
          {serviceData?.price}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Duration:
        </Typography>
        <Typography sx={{ marginBottom: '20px' }}>
          {serviceData?.duration}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="primary" sx={{ marginRight: '10px' }} onClick={() => window.history.back()}>
            Back to Services
          </Button>

          {/* Nếu cần chỉnh sửa dịch vụ */}
          <Button variant="contained" color="primary">
            Edit Service
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProviderServiceDetail;
