//this function will ensure an email is sent at 8 AM and then every hour until 9 PM 
function isValidTime(hour) {
return true;
  if (hour > 7 && hour < 22) {
  	return true;
  } else {
    //return true;
    return false;
  }
}

// Folder where generated cover letters go,
// résumé to send companies,
// cover letter template to use in email bodies.
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config");

var RESUME_GUID = sheet.getRange(2, 2).getValue(),
    COVERTEMPLATE_GUID = sheet.getRange(2, 3).getValue(),
    FOLDER_GUID = getFolderGUID(sheet.getRange(2, 1));

// Column values for every parameter.
var COLUMNMAP = {
  'companyName': 0,
  'contactEmail': 1,
  'jobTitle': 2,
  'companyCity': 3,
  'companyBlurb': 4,
  'applyByEmail': 5,
  'emailWasSent': 6
  };

var COLUMNLETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function hashifyRow(rowColumns) {
  var applicationHash = {};

  applicationHash['companyName'] = rowColumns[COLUMNMAP['companyName']];
  applicationHash['contactEmail'] = rowColumns[COLUMNMAP['contactEmail']];
  applicationHash['jobTitle'] = rowColumns[COLUMNMAP['jobTitle']];
  applicationHash['companyCity'] = rowColumns[COLUMNMAP['companyCity']];
  applicationHash['companyBlurb'] = rowColumns[COLUMNMAP['companyBlurb']];
  applicationHash['applyByEmail'] = rowColumns[COLUMNMAP['applyByEmail']];
  applicationHash['emailWasSent'] = rowColumns[COLUMNMAP['emailWasSent']];

  return(applicationHash);
}

function getCoverTemplate() {
  var coverTemplate = DriveApp.getFileById(COVERTEMPLATE_GUID).getBlob().getDataAsString();
  return coverTemplate;
}

function createEmailSubject(applicationHash) {
  var jobTitle = applicationHash['jobTitle'] || "Software Developer",
      companyCity = applicationHash['companyCity'] || "Application";

  return(jobTitle + " - " + companyCity);
}

function createEmailBody(applicationHash) {
  var template = getCoverTemplate();

  template = template.replace('{currentdate}', createPrettyDate())
    .replace('{company_name}', applicationHash['companyName'])
    .replace('{blurb_about_company}', applicationHash['companyBlurb']);
  
  return(template);
}

function saveCoverLetter(applicationHash) {
  var folder = DriveApp.getFolderById(FOLDER_GUID);
  folder.createFile(applicationHash['companyName'] + ' ' + applicationHash['jobTitle'] + '.html', createEmailBody(applicationHash));
}

function createPrettyDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  
  if(dd < 10) {
    dd = '0' + dd;
  } 
  
  if(mm < 10) {
    mm = '0' + mm;
  }
  
  prettyDate = mm + '/' + dd + '/' + yyyy;
  return prettyDate;
}

function getFolderGUID(folderCell) {
  var maybeGUID = folderCell.getValue();

  if (maybeGUID) {
    return maybeGUID;
  } else {
    var newFolder = DriveApp.createFolder("Cover Letters"),
        newFolderID = newFolder.getId();

    folderCell.setValue(newFolderID);
    return newFolderID;
  }
}

function nowIsBusinessHours() {
  var hour = new Date().getHours();

  return hour > 7 && hour < 22;
}
