import express from 'express';
import cors from 'cors';
import reportRoutes from './routes/reportRoutes.js'; 

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/report', reportRoutes);

app.get('/', (req,res) => {
    res.end('API is running');
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})