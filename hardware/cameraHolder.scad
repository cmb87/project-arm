
difference(){
union(){
hull(){
  translate([-40,-5/2+5,5])cube([50,5,5]);
  translate([0,0,0])cube([40,15,3]);
  
}
hull(){
translate([0,-30/2,0])cube([40,15,3]);
translate([-40,-5/2-5,5])cube([50,5,5]);
}
}
translate([-18-18,-5,-10])cylinder(r=0.8,h=51,$fn=30);
translate([-18-18, 5,-10])cylinder(r=0.8,h=51,$fn=30);
translate([-18+18,-5,-10])cylinder(r=0.8,h=51,$fn=30);
translate([-18+18, 5,-10])cylinder(r=0.8,h=51,$fn=30);
}