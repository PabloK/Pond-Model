var m = require('./main');

// Ponds
var East = new m.Pond(600000, 62, 0);
var Ref  = new m.Pond(1500,  62, 0);
var Conf = new m.Pond(1500,  62, 1);
var Out  = new m.Pond(72000, 0,  0);

// Hours
var numberOfHours = 3000;

// Pumps
East.addFlow(Ref,34);
Ref.addFlow(Conf,34);
Conf.addFlow(Out,34);

// Leakage
Ref.addFlow(Out,10);
Conf.addFlow(Out,10);
Out.addFlow(Ref,10);
Out.addFlow(Conf,10);

ponds = [];
ponds.push(East); // East
ponds.push(Ref); // Ref
ponds.push(Conf); // Conf (Tove)
ponds.push(Out); // Out

m.exec(ponds, numberOfHours) ;