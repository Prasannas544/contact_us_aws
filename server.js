const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Set up body parser middleware to parse JSON from POST requests
app.use(bodyParser.json());

// Set up Google Sheets API credentials and client
const credentials = {
    "type": "service_account",
    "project_id": "focused-bridge-385118",
    "private_key_id": "06be510fd2ad0278dfb92fed5fc06512688006ff",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCa6KQPrJZJYRRE\ndkOtPtg9iMEzqFUcm7uE2N7nTpBvOD3uN5prgiyeP32PDDUHFGiVBnJYfJQAO2wa\n/XxGFaOYOZZHX15VpyNX5MuUKBFP8tshhjAWsxgURuIl8pnAmoveYCm7TZATwnn1\n/DchM3Ct/tYuYysEHfhYmQon4BEX/wLSVRY3rGXQTi2Gt5UUNQ4hWSVoIKDwmx4u\nWNtl49wurs/eSlMevZP4rRJPIZz+b2Lw1MQHx6VlwDYzhXVI0WKXTl35d9bK2pfO\nqTGamHpfUMEB7WiKmYyYsRJPUDaoZzQ94+HY1yYFct7w4sj9Bw2WuhDcKU3V/hpO\njeeQWAz3AgMBAAECggEAAP54Ni0a/q1U8enBQ/L8upwyxr+4adIkKaMjXj+HSscZ\nJt9NbfxVtWltQiz5uvVNPnWag1pvVZfAulrdU/rcXwI2kl7FrU1SY2oL5UfZNNOH\nnu8HX5hs+wWpibOGgLcPW/Eha5SIbsPKt6y7ni7un3lmomHmqUhO0Ch0a+emxk+u\n/b4KLeOYW8aW8Sld38a0m6niA2O/XkdCACBh1BzV5US0R1zZ54Ach/ldEAlLnl1b\nHc8Jnz8mh7FYFts5JCQv5Il9wneFZC/F9+FwPOcb8At2YUI+yIjvWraA/gCJMXx3\nqpxf7j6sSvFnWAEE8g1x2GbDWTkpntfaUatoba32fQKBgQDW4Trmgz/9keP23Xk8\nFOWeoKHstCtYm2aD/gTMKfddHWKNTy7wywsBtdRUDiqGbRt9hPgsqBeSJjiuEbaL\n1LWkPyUwIQoKMmtg5TMb22rjV6WSvoPYktBGlO4D/NWmYUNDRxQf3AXrLP4mZM8o\nGHMYuN0qay0PYWZWwOiCJwZgbQKBgQC4jXuDcz8PdT0/tgAVwfhG3kzphRrzfK9e\nYCyUC2Yph50Xsos2VMk8mOL8Y3gsK41NciRNyyfmjBxRIjuUdI8fCKQ0AAd5O4NP\nZpQrXskZ8//Dn2ZEKH1u4iukBwHoXvThM9oIi/tRUPgCwzQVbeRtKDZxJ0LVdLFQ\n3QbAzogscwKBgD+PBXYTkoT1d0GZBvgvki/Wga7bKAsghDU8mLyvGRzwySrVJiRR\nWqMZ3oEyY3+5nC0HfMTwv3AaYB+U27MGque3Sc+vpiGYAkz53qE5yKcQUMhUE/mm\ni3alLLX/Pk7lbBjlWF2IHjQO7en7XY8VlE3WuIyIgR6Qh83XZ66/zlINAoGAUPAL\nyTyT3W2nbPee1ev5vOrlhEyR41M9fgBjzJGrPm9xX+E32J4am27ZraLaI1T+ZYa3\nkT6VwzCTgqmmw5bS5eNeUEfq/yowjnQIa3TocW9nLh4MNbwkNqsORKOmHIj4kIOz\nDaiGkcUW3+9IOlW1poHKTpnPX9oLodEtkwWBBy0CgYBe9N2RTavHQeWrW1ifFHVp\nRjRuHVFr71or4rHrC6OMg+iRxvy6oyWnSFdoQT6qiz/kkehjxmh8JoTbs+dXD9XH\nD66sRVq66LvHPBNEJerZFibT5CJwi8yofx17w3qMaMlddKT0AxQU8vT/WZkzWXHZ\nodh73HJqBrygkWC5OBTcAw==\n-----END PRIVATE KEY-----\n",
    "client_email": "prasanna@focused-bridge-385118.iam.gserviceaccount.com",
    "client_id": "110450447581004176082",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/prasanna%40focused-bridge-385118.iam.gserviceaccount.com"
}


const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize((err) => {
    if (err) throw err;
    console.log('Google Sheets API authorized.');
});

// Set up endpoint to handle POST requests
app.post('/submit-form-data', (req, res) => {
    // Extract form data from the request body
    const { name, email, topic, message } = req.body;

    // Define spreadsheet ID and range to write to
    const spreadsheetId = 'your-spreadsheet-id';
    const range = 'Sheet1!A1:D1';

    // Set up values to write to spreadsheet
    const values = [[name, email, topic, message]];

    // Write values to spreadsheet using the Google Sheets API
    const sheets = google.sheets({ version: 'v4', auth: client });
    sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
    }, (err, response) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error writing to spreadsheet.');
        } else {
            console.log(`${response.updates.updatedCells} cells updated.`);
            res.send('Form data submitted successfully.');
        }
    });
});

// Start server listening on specified port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});