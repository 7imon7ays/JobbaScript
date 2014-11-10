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

