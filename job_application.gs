function JobApplication(jobberator, applicationParams) {
  Logger.log(jobberator);
  this.jobberator = jobberator;
  this.companyName = applicationParams[COLUMNMAP['companyName']];
  this.contactEmail = applicationParams[COLUMNMAP['contactEmail']];
  this.jobTitle = applicationParams[COLUMNMAP['jobTitle']];
  this.companyCity = applicationParams[COLUMNMAP['companyCity']];
  this.companyBlurb = applicationParams[COLUMNMAP['companyBlurb']];
  this.applyByEmail = applicationParams[COLUMNMAP['applyByEmail']];
  this.emailWasSent = applicationParams[COLUMNMAP['emailWasSent']];
  this.email = null;
}

JobApplication.prototype.createEmail = function() {
  this.email = new ApplicationEmail(this.contactEmail, this.jobTitle,
                                    this.companyCity, this.companyName, this.companyBlurb);

  this.email.initCoverLetter(this.jobberator);
  this.email.populateCoverLetter();
}

JobApplication.prototype.fire = function() {
  this.email.send(this.jobberator);
  Logger.log("email sent to: " + this.contactEmail + " for company " + this.companyName);
}

function ApplicationEmail(contactEmail, jobTitle, companyCity, companyName, companyBlurb) {
  this.contactEmail = contactEmail;
  this.subject = (jobTitle || "Software Developer") + " - " + (companyCity || "Application");
  this.companyName = companyName;
  this.companyBlurb = companyBlurb;
  this.coverLetter = null;
}

ApplicationEmail.prototype.initCoverLetter = function (jobberator) {
  var coverTemplate = DocsList.getFileById(jobberator.coverTemplateGUID), // Open Document as File
      coverLetterFile = coverTemplate.makeCopy(this.companyName), // to make a copy of it.
      coverLetterFolderID = jobberator.getFolderGUID(),
      folder = DocsList.getFolderById(coverLetterFolderID);

  coverLetterFile.addToFolder(folder);
  this.coverLetter = DocumentApp.openById(coverLetterFile.getId()); // Memo-ize as Document to use text for email
}

ApplicationEmail.prototype.populateCoverLetter = function() {
  this.coverLetter.getBody()
                    .replaceText('{ date }', createPrettyDate())
                    .replaceText('{ companyName }', this.companyName)
                    .replaceText('{ companyBlurb }', this.companyBlurb);
}

ApplicationEmail.prototype.send = function (jobberator) {    
  var resume = DriveApp.getFileById(jobberator.resumeGUID);

    MailApp.sendEmail({
      to: this.contactEmail,
      subject: this.subject,
      body: this.coverLetter.getBody().getText(),
      attachments: [resume.getAs(MimeType.PDF)]
    });
}

