## PCC Scraper
#### A web scraper I wrote for a project at work. It finds the e-mail addresses of all instructors teaching courses at the Southeast Library and writes them to a csv file.
* requires NodeJS
* run "npm install"
* update uri in app.js--this requires setting up your parameters on the pcc website
* run "node app.js"
* if it exists delete "payload.csv"
* run "node scrub.js"
* emails and phone numbers will be in payload csv
