// File settings
var fs = require('fs');
var today = new Date();
var fileName = process.argv[2] || ""
  + today.getFullYear()
  + today.getMonth()
  + today.getUTCDate() 
  + today.getHours()
  + today.getMinutes()
  + today.getSeconds()
  + ".csv";


// Pond object
function Pond(vol, conc, reducedPerHourInPercent)  {
    this.vol = vol;
    this.ammount = conc * vol;
    this.reducedPerHour = reducedPerHourInPercent/100.0;
    this.flows = [];
}
Pond.prototype.addFlow = function(connectedPond, flowInCbcM) {
  this.flows.push(new Flow(this, connectedPond, flowInCbcM))
}
Pond.prototype.getConc = function() {
  if (this.vol === 0) { return 0; }
  return this.ammount / this.vol;
};
Pond.prototype.pour = function(flowToPond, flowInCbcM) {
  if (this.vol - flowInCbcM <= 0) { return; }
  if (!flowToPond) { return; }
  var ammount = flowInCbcM * this.getConc();
  this.ammount -= ammount
  this.vol -= flowInCbcM;
  flowToPond.ammount += ammount;
  flowToPond.vol += flowInCbcM;
}
Pond.prototype.reduce = function() {
  if (this.ammount <= 0) { return; }
  this.ammount -= this.ammount * this.reducedPerHour;
}
Pond.prototype.flow = function() {
  for (var i=0; i < this.flows.length; i++) {
    this.flows[i].tick();
  }
}
Pond.prototype.tick = function() {
  this.reduce();
  this.flow();
};

// Flow object
function Flow(flowFromPond, flowToPond, flowInCbcM) {
  this.flowFromPond = flowFromPond;
  this.flowToPond = flowToPond;
  this.flowInCbcM = flowInCbcM;
};
Flow.prototype.tick = function() { 
  this.flowFromPond.pour(this.flowToPond,this.flowInCbcM);
};

// Execute and save to file
function exec(ponds, numberOfHours) {
  var i = 1;
  var fd = fs.openSync(fileName,'ax');
  while(i <= numberOfHours) {
    for(var j=0; j < ponds.length; j++) {
      ponds[j].tick(); 
    }
    var row = Buffer((
           ponds[0].getConc() + ";" 
         + ponds[1].getConc() + ";" 
         + ponds[2].getConc() + ";" 
         + ponds[3].getConc()
         ).replace(/\./g,",") 
         + "\r\n");
    fs.writeSync(fd, row,0,row.length,5);
    i++;
  }
  fs.closeSync(fd);
}

module.exports = { Pond: Pond, exec: exec};