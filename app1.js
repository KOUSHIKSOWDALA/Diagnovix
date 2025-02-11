import express from 'express';
import axios from 'axios';
import gmailTransfer from './smtp.js';
import {report_gen,compareReport} from './open1.js';
import cors from 'cors';
import {insertRow,isExist,updateRow} from './sql.js';

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', async (req, res) => {
    const { name, email, text } = req.body;

    try {
        
        const cleanResponse = await axios.post('https://nlpapi-gq1y.onrender.com', { text: text });
        const clean_text = cleanResponse.data.text;

        const resp = await axios.post('https://text-correction-ccu9.onrender.com/correct', { text: text });
        const correctedText = resp.data.text;


        let data = await report_gen(correctedText);

        isExist(email,data, async (err, exists, res) => {
            if (err) {
                console.error('Error occurred:', err);
                return;
            }
        
            if (exists) {
                const { sno,no_of_visits, report } = res;

                data = await compareReport(report,data) 
                await updateRow(data,no_of_visits)
            } else {

                await insertRow(name,email,data)
            }
        });

        await gmailTransfer(email, name, data);

        res.status(200).json({data:data})

        
    } catch (error) {
        console.error('Error details:', error.message);

        if (error.response) {
            
            console.error('Response data:', error.response.data);
            
            res.status(error.response.status).send({
                error: 'Failed to process the request',
                details: error.response.data,
            });
        } else {
            
            res.status(500).send({
                error: 'An unexpected error occurred',
                details: error.message,
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
