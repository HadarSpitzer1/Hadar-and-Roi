// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import Table from './components/MainScreen';

function App() {
    const [result, setResult] = useState(null);

    // Your API Gateway endpoint
    const API_URL = 'https://<api-id>.execute-api.<region>.amazonaws.com/dev/increment'; // Replace with your API Gateway URL

    // Function to call Lambda
    const callIncrementLambda = async (number) => {
        try {
            const response = await axios.post(API_URL, { number });
            setResult(response.data.result); // Store the result in the state
            console.log("Result from Lambda:", response.data.result);
        } catch (error) {
            console.error("Error calling Lambda:", error);
        }
    };

    return (
        <div className="App">
            <h1>מערכת שיבוץ</h1>
            <Table />
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={() => callIncrementLambda(10)}>Increment Number</button>
                {result !== null && <p>Incremented Result: {result}</p>}
            </div>
        </div>
    );
}

export default App;
