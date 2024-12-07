import axios from 'axios';

const API_URL = "https://ts1vtu17l7.execute-api.us-east-1.amazonaws.com/api-gateway-stage1"; // Your API Gateway URL.
const GOOGLE_FUNCTION_URL = "https://us-east1-matchbox-443614.cloudfunctions.net/function-1"; // Your Google Cloud Function URL.

// Save user data to DynamoDB
export const saveUserData = async (userId, tables, employees, getAccessTokenSilently) => {
    try {
        const token = await getAccessTokenSilently();
        await axios.post(
            `${API_URL}/save`,
            {
                userId: userId,
                data: { tables, employees },
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Data saved successfully!");
    } catch (error) {
        console.error("Error saving user data:", error);
        alert("Failed to save data. Please try again.");
    }
};

// Fetch user data from DynamoDB
export const fetchUserData = async (username, getAccessTokenSilently) => {
    try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(`${API_URL}/load`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId: username, dataType: "Map" }, // Pass userId and dataType as query parameters
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

// Send workers' constraints to the Google Cloud Function
export const sendWorkersConstraints = async (workers, unavailableConstraints, getAccessTokenSilently) => {
    try {
        const token = await getAccessTokenSilently();
        const payload = {
            workers: workers,
            unavailable_constraints: unavailableConstraints,
        };

        const response = await axios.post(GOOGLE_FUNCTION_URL, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        alert("Constraints sent successfully!");
        return response.data;
    } catch (error) {
        console.error("Error sending workers' constraints:", error);
        alert("Failed to send constraints. Please try again.");
        return null;
    }
};
