const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    const filePath = path.join(__dirname, 'uploads', 'resumes', 'resume_1_1773212534010.pdf');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    try {
        const response = await axios.post('http://localhost:8000/api/analyze', formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        console.log("Success:", response.data);
    } catch (error) {
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
            console.error("Headers:", error.response.headers);
        } else {
            console.error("Message:", error.message);
        }
    }
}

testUpload();
