const xRay = require('x-ray');
const request = require('request');
// setup custom filters for xray
const x = xRay({
  filters: {
    // remove the damn tab and newline characters!!!
    trim: (value) =>{
      return typeof value === "string" ? value.trim() : value
    }
  }
});

// const jQuery = require('jQuery');


const uri = 'https://www.pcc.edu/schedule/default.cfm?fa=doadvquery&BrowseType=ADVANced&frmType=ADV&thisTerm=201801&queryText=&queryTextType=AND&SubjectCode=*&Site=SE&coursetype=typeX&Instructor=&QuickSearch=Show+Me+Classes';
// dl dd a@href = link
// dl dt = course title

x(uri, "dl", [{
  // apply trim filter to dd
  course: "dd | trim",
  link: "dd a@href"
}])
.write('./courses-links.json');
