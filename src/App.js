// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import Table from './components/MainScreen';

function App() {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Your API Gateway endpoint
    const API_URL = 'https://kt06ijxgal.execute-api.us-east-1.amazonaws.com/dev/double';

    // Function to call Lambda
    const callIncrementLambda = async (number) => {
        try {
            const response = await axios({
                method: 'post',
                url: API_URL,
                data: { number },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            setResult(response.data.result);
            setError(null);
            console.log("Result from Lambda:", response.data.result);
        } catch (error) {
            setError(error.message);
            console.error("Error calling Lambda:", error);
        }
    };

    return (
        <div className="App">
            <h1>מערכת שיבוץ</h1>
            <Table />
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button onClick={() => callIncrementLambda(10)}>
                    Increment Number
                </button>
                {result !== null && <p>Incremented Result: {result}</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            </div>
        </div>
    );
}

export default App;