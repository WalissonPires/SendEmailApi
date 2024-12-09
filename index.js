require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send({ message: 'v1.0.0' }));

app.post('/', handleSendEmail);
app.post('/email', handleSendEmail);

function handleSendEmail(req, res) {

    try {
        const transporter = nodemailer.createTransport({
            service: req.body.provider || 'gmail',
            auth: {
                user: req.body.username || process.env.EMAIL,
                pass: req.body.userpass || process.env.PASSWORD
            }
        });

        const emailMessage = {
            from: req.body.from,
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.content
        };

        transporter.sendMail(emailMessage, (error) => {

            if (error) {

                console.error(error);
                res.status(422).send({ message: 'Fail send email' });
            }
            else {

                res.send({ message: 'Email sended' });
            }
        });
    }
    catch(error) {

        console.error(error);
        res.status(422).send({ message: 'Fail send email' })
    }
}

const PORT = process.env.PORT || '5010';
app.listen(PORT, () => console.log('Server on port ' + PORT));
