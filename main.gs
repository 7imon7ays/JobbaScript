function main() {
  if (nowIsBusinessHours()) {
    iterateAndApply();
  }
}

function iterateAndApply () {
  var sheet = SpreadsheetApp.getActiveSheet(),
      data = sheet.getDataRange().getValues(),
      currentDate = new Date(),
      length = data.length,
      i;

  for (i = 1; i < length; i++) {
    
    var emailWasSent = data[i][COLUMNMAP['emailWasSent']];
    if (!emailWasSent) {
      var applicationHash = hashifyRow(data[i]);

      if (applicationHash['applyByEmail']) {
        sendCompanyEmail(applicationHash);

        Logger.log("email sent to: " + applicationHash['contactEmail'] + " for company " + applicationHash['companyName']);
        
        // Set emailWasSent to true.
        var rowIdx = i + 1,
            emailWasSentColumn = COLUMNLETTERS[COLUMNMAP['emailWasSent']],
            cell = SpreadsheetApp.getActiveSheet().getRange(emailWasSentColumn + rowIdx);
        
        cell.setValue(true);
      }

      saveCoverLetter(applicationHash);        
    }

  }
}

function sendCompanyEmail(applicationHash) {
  var subject = createEmailSubject(applicationHash),
      body = createEmailBody(applicationHash),
      resume = DriveApp.getFileById(RESUME_GUID);

  MailApp.sendEmail({
    to: applicationHash['contactEmail'], 
    subject: createEmailSubject(applicationHash),
    htmlBody: body,
    attachments: [resume.getAs(MimeType.PDF)]
  });
}
