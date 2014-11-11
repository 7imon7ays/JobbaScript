function ApplicationEmail(contactEmail, jobTitle, companyCity, companyName, companyBlurb) {
  this.contactEmail = contactEmail;
  this.subject = (jobTitle || "Software Developer") + " - " + (companyCity || "Application");
  this.companyName = companyName;
  this.companyBlurb = companyBlurb;
  this.coverLetter = null;
}

ApplicationEmail.prototype.initCoverLetter = function (jobberator) {
  // Open Document as File to make a copy of it.
  var coverTemplate = DocsList.getFileById(jobberator.coverTemplateGUID),
      coverLetterFile = coverTemplate.makeCopy(this.companyName),
      coverLetterFolderID = jobberator.getFolderGUID(),
      folder = DocsList.getFolderById(coverLetterFolderID);

  coverLetterFile.addToFolder(folder);
  coverLetterFile.removeFromFolder(DocsList.getRootFolder());
  // Memo-ize as Document for use in email body.
  this.coverLetter = DocumentApp.openById(coverLetterFile.getId());
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

