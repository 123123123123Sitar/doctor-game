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

        // Append row to match headers: Name, Time, Errors, Case, Difficulty, Handbook, Timestamp
        sheet.appendRow([
            data.name,
            data.time,
            data.errors,
            data.caseName || 'Unknown',
            data.difficulty || 'medium',
            data.handbookUsed ? 'Yes' : 'No',
            timestamp
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

        // If empty or just header
        if (data.length <= 1) {
            return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
        }

        // Header is row 0. Data starts row 1.
        // Columns: 0=Name, 1=Time, 2=Errors, 3=Case, 4=Difficulty, 5=Handbook, 6=Timestamp
        const rows = data.slice(1);

        const scores = rows.map(row => ({
            name: row[0],
            time: parseInt(row[1]),
            errors: parseInt(row[2]),
            caseName: row[3],
            difficulty: row[4],
            handbookUsed: row[5] === 'Yes',
            timestamp: row[6]
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
        // Return detailed error for debugging
        return ContentService.createTextOutput(JSON.stringify({ 'error': err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
}

function setupSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        // Add Headers
        sheet.appendRow(['Name', 'Time (s)', 'Errors', 'Case', 'Difficulty', 'Handbook', 'Timestamp']);
        sheet.setFrozenRows(1);
    }
    return sheet;
}

function getSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
        sheet = setupSheet();
    }
    return sheet;
}
