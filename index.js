const nodemailer = require('nodemailer');
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => res.send({ message: 'ON' }));

app.post('/email', (req, res) => {

    try {
        const email = {
            from: req.body.from,
            to: req.body.to,
            subject: req.body.subject,
            content: req.body.content
        };

        const transporter = nodemailer.createTransport({
            service: req.body.provider || 'gmail',
            auth: {
                user: req.body.username,
                pass: req.body.userpass
            }
        });

        const emailMessage = {
            from: req.body.from,
            to: req.body.to,
            subject: req.body.subject,
            html: req.body.content
        }

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
});

const PORT = process.env.PORT || '5010';
app.listen(PORT, () => console.log('Server on port ' + PORT));