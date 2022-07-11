const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = (process.env.CORS_HOSTS || 'http://127.0.0.1:5500').split(' ');
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));
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
                user: req.body.username || process.env.EMAIL,
                pass: req.body.userpass || process.env.PASSWORD
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
