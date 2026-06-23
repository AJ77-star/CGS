const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const initDb = require('./initDb');

const app = express();
const PORT = process.env.PORT || 4000;
const frontendPath = path.join(__dirname, '../frontend');

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const profileRoutes = require('./routes/profile');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const counsellorAuth = require('./routes/counsellor-auth');
const counsellorRoutes = require('./routes/counsellor');

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/counsellor-auth', counsellorAuth);
app.use('/api/counsellor', counsellorRoutes);

app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GROQ_API_KEY loaded: ${process.env.GROQ_API_KEY ? 'YES' : 'NO'}`);
    console.log(`DATABASE_URL loaded: ${process.env.DATABASE_URL ? 'YES' : 'NO - using local config'}`);
    await initDb();
});