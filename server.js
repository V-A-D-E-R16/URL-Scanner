import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import axios from 'axios';
import cheerio from 'cheerio';
import { dirname } from "path";
import { fileURLToPath } from "url";

var result = 'Hello';
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;


const creds = {
    username: 'vader6914',
    password: 'VAscanner@123'
}

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.urlencoded({ extended: true }));

async function scanURL(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const vulnerabilities = [];

        // Implement vulnerability detection logic here
        // Example: Check for insecure HTTP content
        if (html.includes('http:')) {
            vulnerabilities.push('Insecure HTTP content found');
        }

        // Example: Check for outdated JavaScript libraries
        const $ = cheerio.load(html);
        $('script').each((index, element) => {
            const src = $(element).attr('src');
            if (src && src.includes('jquery')) {
                vulnerabilities.push('Outdated jQuery library found');
            }
        });

        return vulnerabilities;
    } catch (error) {
        console.error('Error scanning URL:', error);
        return ['Error scanning URL'];
    }
}


app.get('/', (req, res) => {
    res.render('login.ejs');
});

app.post('/submit', (req, res) => {
    if(req.body.username == creds.username && req.body.password == creds.password) {
        console.log('Login Success');
        res.render('app.ejs', {
            textContent: result
        });
    }
});

app.post('/submitScan', async (req, res) => {
    const url = req.body.url;
    
    scanURL(url)
    .then(vulnerabilities => {
        if (vulnerabilities.length > 0) {
            result = 'Vulnerabilities found: ' + vulnerabilities;
            console.log(result)
            vulnerabilities.forEach(vulnerability => console.log('-', vulnerability));
        } else {
            result = 'No vulnerabilities found.';
            console.log(result);
        }
        res.render('results.ejs', {
            outputText: result,
        });
        
    })
    .catch(error => console.error('Error:', error));
})


app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
});