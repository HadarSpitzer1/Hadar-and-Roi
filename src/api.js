import axios from 'axios';

const API_URL = "https://ts1vtu17l7.execute-api.us-east-1.amazonaws.com/api-gateway-stage1"; // Your API Gateway URL.
const GOOGLE_FUNCTION_URL = "https://us-east1-matchbox-443614.cloudfunctions.net/function-1"; // Your Google Cloud Function URL.

// Save user data to DynamoDB
export const saveUserData = async (userId, tables, employees, getAccessTokenSilently, employeeData) => {
    try {
        console.log("Data being sent:", { tables, employees, employeeData });
        const token = await getAccessTokenSilently();
        
        await axios.post(
            `${API_URL}/save`,
            {
                userId: userId,
                data: { tables, employees, employeeData },
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    } catch (error) {
        console.error("Error saving user data:", error);
    }
};
export const fetchUserData = async (username, getAccessTokenSilently) => {
    try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${API_URL}/load`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId: username, dataType: "Map" },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};
export const createEmployeeData = async (rootUsername, newEmployee, tableName, getAccessTokenSilently) => {
    if (!newEmployee.trim()) {
        throw new Error("Name is required");
    }
    try {
        console.log("Calling API with:", { rootUsername,newEmployee, tableName });

        // Fetch the token
        const token = await getAccessTokenSilently();

        // Make the API request
        const response = await axios.post(
            `${API_URL}/employeeCode`, // Replace with your actual endpoint path
            { name: newEmployee, tableName: tableName, rootUsername: rootUsername}, // Include tableName in the payload
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );
        console.log("API response:", response.data);
        return response.data.employee;
    } catch (error) {
        console.error("Failed to create employee:", error);
        throw error;
    }
};
