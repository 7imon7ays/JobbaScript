# JobbaScript

A Google Drive script to automate the job hunt. Build a spreadsheet with
companies you want to apply to and the relevant info for each. Then let this
script fire an email to each company with a customized cover letter and your
resume as an attachment. Google allows you to set the interval between each email.
The generated cover letters will be saved in a dedicated folder.

## Setup

0. Upload "data/master.xlsx" to a single Google spreadsheet. Make sure the
  companies table is in the "Companies" sheet and the configuration table is in
  the "Config" spreadsheet.
0. Make sure cell A2 in “Config” is blank. The script fills it when it creates
  the folder where your populated cover letters will be saved.
0. Fill cells B2 and C2 with the Global Unique IDs of your resume and cover letter
  template. Read this [blog post] for instructions on finding a file's global
  unique ID.
0. Upload your resume as a PDF and write your cover letter template as a Google doc.
  * Use { date }, { companyName } and { companyBlurb } as placeholders for the
    script to populate when generating cover letters.
0. Copy the scripts in the .gs files stored on this repo to a Google script
  associated with the Master spreadsheet.
    * From the spreadsheet, click "Tools" > "Script Editor" > "Blank Project".
    * Create one file ("File" > "New" > "Script file") for each .gs file in this
      repo and copy over the code. (The names don't matter but we'll refer back
      to 'jobberator.gs' at the end.)
0. For the test run, put your own email address in cell B2 in the “Companies”
  sheet and make sure the "applyByEmail" column is set to TRUE.
0. To fire it up, open the spreadsheet, click “Tools” > “Script Editor”, then
  “jobberator.gs”, then “Run” > “main”.
0. Once you've tested it, fill one row in the "Companies" sheet for each company
  you're applying to.
0. To set the script to run every half hour, click the clock icon and set “main”
  to run every 30 minutes.

## Credit

Built in collaboration with [Joe Combs][joe combs].

[joe combs]: https://twitter.com/josephcombs
[blog post]: http://www.alicekeeler.com/teachertech/2013/08/03/google-docs-unique-id/

## Warning

This fires live emails from your Google Mail account. Use at your own risk!

