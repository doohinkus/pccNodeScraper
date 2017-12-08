const xRay = require('x-ray');
const makeDriver = require('request-x-ray');
const fs = require('fs');

const options = {
	method: "GET", 						//Set HTTP method
	jar: true, 							//Enable cookies
	headers: {							//Set headers
		"User-Agent": "Firefox/48.0"
	}
}

const driver = makeDriver(options);

// setup custom filters for xray
const x = xRay({
  filters: {
    // remove the damn tab and newline characters!!!
    trim: (value) =>{
      return typeof value === "string" ? value.trim() : value
    }
  }
});

x.driver(driver);

let instructorUrls = [];
let cleanUrls = [];
let content;

const uri = 'https://www.pcc.edu/schedule/default.cfm?fa=doadvquery&BrowseType=ADVANced&frmType=ADV&thisTerm=201801&queryText=&queryTextType=AND&SubjectCode=*&Site=SE&coursetype=typeX&Instructor=&QuickSearch=Show+Me+Classes';

// first crawl site for instructor urls
x(uri, "dl", [{
  instructorUrl: x("dd a@href", ["tr.info-row a:first-child@href"]),
  }])((err, obj) => {
  // handle error
  if (err) throw err
  // process the urls
  instructorUrls = obj.filter((urls)=>{
    // remove all empty arrays
    return urls.instructorUrl.length > 0;
  });
  //add to urls to big array
  instructorUrls.forEach((value)=>{
    value.instructorUrl.forEach((item)=>{
      cleanUrls.push(item);
    });
  });
  // remove duplicate urls
  cleanUrls = cleanUrls.filter((el, pos, url)=>{
    return url.indexOf(el) == pos;
  });
  // write clean urls to urls.json
  content =  '{ "data":' + JSON.stringify(cleanUrls) + '}';
  fs.writeFile("./data/urls.json", content, 'utf8', (err)=>{
    if (err)  throw console.error(err);
    else console.log("success!!!");

  });
});



//  Now use urls.json to crawl for target data
// cleanUrls.forEach((item)=>{
//   console.log(item);
//  x(item, "table.data tbody tr.alt-color", [{
//    name: "td:first-child strong",
//    course:"td:second-child",
//    email:"td:third-child a"
//  }])((err, obj) => {
//    console.log(obj);
//  });
// });
// console.log(cleanUrls);

// .write('./courses-links.json');
