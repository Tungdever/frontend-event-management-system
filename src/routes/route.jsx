import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// Hàm helper để thêm header Authorization
const getHeaders = (token) => ({
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMUBleGFtcGxlLmNvbSIsImlhdCI6MTczMjcxODkzMSwiZXhwIjoxNzMzMzIzNzMxLCJyb2xlcyI6WyJST0xFX0FETUlOIl19.QKa3-so9KdZL831Z-YKTrJN7y5bLAdtQp0yYujzgsHMIkkUVyn3D7yHRr3epij3vC9TPLJYi5GwnOPj_1bh2OQ `,
},
});

// Fetch tasks theo eventId
export const fetchTasks = async (eventId, token) => {
  const response = await axios.get(`${BASE_URL}/man/event/${eventId}/tasks`, getHeaders(token));
  return response.data.data; // Trả về dữ liệu JSON
};

// Cập nhật task
export const updateTask = async (task, token) => {
    console.log(task)
  const response = await axios.put(`${BASE_URL}/man/task`, task, getHeaders(token));
  return response.data; // Trả về dữ liệu JSON
};

// Xóa task
export const deleteTask = async (taskId, token) => {
  await axios.delete(`${BASE_URL}/man/task/${taskId}`, getHeaders(token));
};

// Tạo task mới
export const createTask = async (task, token) => {
  const response = await axios.post(`${BASE_URL}/man/task`, task, getHeaders(token));
  return response.data; // Trả về dữ liệu JSON
};
