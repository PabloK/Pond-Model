var fs = require('fs');
function Pond(name, vol, conc, bacEat, flowOut, prevPond)  {
    this.name = name;
    this.vol = vol;
    this.conc = conc;
    this.bacEat = bacEat;
    this.prevPond = prevPond;
    this.flowOut = flowOut;
}
var out = "";
Pond.prototype.tick = function() {
  if (this.prevPond) {
      flowIn = this.prevPond.flowOut;
      concIn = this.prevPond.conc;
  } else { 
    flowIn = 0;
    concIn = 0;
  }
    
  tempVol = this.vol + flowIn - this.flowOut;
  this.conc = ((this.vol - this.flowOut) * this.conc 
               + flowIn * concIn) / tempVol;
  this.conc = this.conc * (1-this.bacEat);
  this.vol = tempVol;
  
}

ponds = [];
ponds.push(new Pond("östra",1000000,62,0,34.5,null));
ponds.push(new Pond("ref",1500,62,0.01,34.5,ponds[0]));
ponds.push(new Pond("Toves",1500,62,0.015,34.5,ponds[1]));
ponds.push(new Pond("out",72000,25,0,0,ponds[2]));

var i = 0;
var today = new Date();
var fileName = process.argv[2] || ""
  + today.getFullYear()
  + today.getMonth()
  + today.getUTCDate() 
  + today.getHours()
  + today.getMinutes()
  + today.getSeconds()
  + ".csv";
var fd = fs.openSync(fileName,'ax');
while(i <= 3000) {
  for(j=0;j < ponds.length; j++){
      ponds[ponds.length-j-1].tick();
  }
  var row = Buffer((
         ponds[0].conc + ";" 
       + ponds[1].conc + ";" 
       + ponds[2].conc + ";" 
       + ponds[3].conc
       ).replace(".",",") 
       + "\r\n");
  fs.writeSync(fd, row,0,row.length,5);
  i++;
}
fs.closeSync(fd);