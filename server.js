const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to No-Code AI Platform API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 