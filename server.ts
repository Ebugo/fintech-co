import express from 'express';
import { records } from './core/app';

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const { invitees, parsedCustomerRecords } = records;

    res.render('index', {
        invitees, 
        count: parsedCustomerRecords.length
    })
});

app.listen(port, () => {
  return console.log(`http://localhost:${port}`);
});