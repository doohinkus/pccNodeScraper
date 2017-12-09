// SUPER HACKY WAY TO GET PAST HTTPS ERRORS SENT FROM PCC SITE
process.binding('http_parser').HTTPParser = require('http-parser-js').HTTPParser;
const http = require('http');
// END HACK
const fs = require('fs');
// cheerio for easy dom traversal
const request = require('request');
const cheerio = require('cheerio');
//usethis to parse script to grab obfuscated email variables
const getScriptTagVars = require('get-script-tag-vars');
// urls
const { data } = require('./data/urls.json');



// let uri = "http://www.pcc.edu/scripts/sdquery.pl?all=joseph%2Emann%40pcc%2Eedu";
 data.forEach((url)=>{
  request(url, (error, response, html)=> {
    if (!error && response.statusCode == 200) {
      // #content-area > div > table > tbody > tr > td:nth-child(3) > a
      const $ = cheerio.load(html);
      let name = $('tr.alt-color td:first-child strong').text();

      let course = $('tr.alt-color td:nth-child(2)').html();
      course=course.toString().split("<br>");
      // remove commas from course
      course = course[0].replace(/\,/g, '');
      console.log(course);

      let phone = $('tr.alt-color td:nth-child(3)').text().trim();

      let scriptGuts = $('tr.alt-color td > script').html();
      // Hacky stuff to grab e-mail
      // TRIM THE STRINGS!!!split the string and grab first two items
      scriptGuts = scriptGuts.trim().split(";");
      // get values in variables
      // console.log(email, " ", phone, " ", course);
      let firstQuote = scriptGuts[0].search('\'') + 1;
      let end = scriptGuts[0].length - 1;
      // End hacky stuff to grab email
      let email = scriptGuts[0].substring(firstQuote, end) + "@" + "pcc.edu";

      // console.log(dataToWrite);
      let dataToWrite = `${course},${email},${phone}\n`;
      fs.appendFile("./payload.csv", dataToWrite, (err)=>{
        err ? console.error("error: ", err) : console.log("it's saved!!!");
      });
    }
  });
 });

 // write  csv fix overwriting
 // fs.writeFile('./payload.csv', dataToWrite, 'utf8', (err) =>{
 //   if (err) {
 //     console.log('Some error occured - file either not saved or corrupted file saved.', err);
 //   } else{
 //     console.log('It\'s saved!');
 //   }
 // });
