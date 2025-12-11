// Google Apps Script Code
// 1. Create a new Google Sheet
// 2. Extensions > Apps Script
// 3. Paste this code
// 4. Deploy > New Deployment > Type: Web App > Who has access: Anyone
// 5. Copy the URL

const SHEET_NAME = 'Leaderboard';

function doPost(e) {
    try {
        const sheet = getSheet();
        const data = JSON.parse(e.postData.contents);

        // Validate data
        if (!data.name || data.time === undefined || data.errors === undefined) {
            return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': 'Invalid data' })).setMimeType(ContentService.MimeType.JSON);
        }

        const timestamp = new Date();

        // Append row: [Timestamp, Name, Time(s), Errors, Case, Date String]
        sheet.appendRow([
            timestamp,
            data.name,
            data.time,
            data.errors,
            data.caseName || 'Unknown',
            timestamp.toLocaleDateString()
        ]);

        return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' })).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'message': err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
}

function doGet(e) {
    try {
        const sheet = getSheet();
        const data = sheet.getDataRange().getValues();

        // Assume header is row 1, data starts row 2
        // If empty or just header
        if (data.length <= 1) {
            return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
        }

        // Indices: 0=Timestamp, 1=Name, 2=Time, 3=Errors, 4=Case
        const rows = data.slice(1);

        const scores = rows.map(row => ({
            name: row[1],
            time: parseInt(row[2]),
            errors: parseInt(row[3]),
            caseName: row[4],
            date: row[5]
        }));

        // Sort: Primary = Errors (Low to High), Secondary = Time (Low to High)
        scores.sort((a, b) => {
            if (a.errors !== b.errors) {
                return a.errors - b.errors;
            }
            return a.time - b.time;
        });

        // Return top 10
        return ContentService.createTextOutput(JSON.stringify(scores.slice(0, 10))).setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ 'error': err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
}

function getSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        // Add Headers
        sheet.appendRow(['Timestamp', 'Name', 'Time (Seconds)', 'Errors', 'Case Name', 'Date']);
    }
    return sheet;
}
