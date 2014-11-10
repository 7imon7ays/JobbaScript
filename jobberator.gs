function main() {
  if (nowIsBusinessHours) {
    var jobberator = new Jobberator();
    jobberator.iterateAndApply();
  }
}

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

function Jobberator() {
  //  GUIDs are saved in the Config sheet.
  this.configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config");
  this.resumeGUID = this.configSheet.getRange(2, 2).getValue(),
  this.coverTemplateGUID = this.configSheet.getRange(2, 3).getValue(),
  this.folderCellCoords = [2, 1];
}

Jobberator.prototype.iterateAndApply = function() {
  var sheet = SpreadsheetApp.getActiveSheet(),
      data = sheet.getDataRange().getValues(),
      currentDate = new Date(),
      length = data.length,
      i;

  for (i = 1; i < length; i++) {

    var emailWasSent = data[i][COLUMNMAP['emailWasSent']];
    if (!emailWasSent) {

      var jobApplication = new JobApplication(this, data[i]);

      if (jobApplication['applyByEmail']) {
        jobApplication.createEmail();
        jobApplication.fire();
        this.recordEmailSent(i);
      }

      break; // Only send one email when the script is run.
    }

  }
}

Jobberator.prototype.getFolderGUID = function() {
  var folderCell = this.configSheet.getRange(
                    this.folderCellCoords[0],
                    this.folderCellCoords[1]
                    ),
      maybeGUID = folderCell.getValue();

  /*
    If a folder GUID is present, use that.
    Otherwise, create a new folder in the
    current directory, save its ID and use it.
  */
  if (maybeGUID) {
    return maybeGUID;
  } else {
    var currentSpreadsheet = SpreadsheetApp.getActive(),
        spreadsheetFolder = DriveApp.getFileById(currentSpreadsheet.getId()).getParents().next(),
        newFolder = spreadsheetFolder.createFolder("Cover Letters"),
        newFolderID = newFolder.getId();

    folderCell.setValue(newFolderID);
    return newFolderID;
  }
}

Jobberator.prototype.recordEmailSent = function(companyIndex) {
  var rowIdx = companyIndex + 1,
    emailWasSentColumn = COLUMNLETTERS[COLUMNMAP['emailWasSent']],
    cell = SpreadsheetApp.getActiveSheet().getRange(emailWasSentColumn + rowIdx);
  
  cell.setValue(true);
}

createPrettyDate = function() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  
  if (dd < 10) {
    dd = '0' + dd;
  } 
  
  if (mm < 10) {
    mm = '0' + mm;
  }
  
  prettyDate = mm + '/' + dd + '/' + yyyy;
  return prettyDate;
}

nowIsBusinessHours = function() {
  var hour = new Date().getHours();

  return hour > 7 && hour < 22;
}


