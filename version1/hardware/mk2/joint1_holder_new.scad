
difference(){
union(){
translate([0,0,-5])cylinder(r=34-0.5,h=5);
hull(){
translate([0,0,-0])cylinder(r=34-0.5,h=5);

translate([+58/2,+58/2,-0])cylinder(r=6,h=5, $fn=30);
translate([-58/2,+58/2,-0])cylinder(r=6,h=5, $fn=30);
translate([-58/2,-58/2,-0])cylinder(r=6,h=5, $fn=30);
translate([+58/2,-58/2,-0])cylinder(r=6,h=5, $fn=30);
}



hull(){
translate([0,0,-0])cylinder(r=34-0.5,h=5);
translate([-(25+6)/2,-(25+6)/2,-0])cube([25+6,25+6,35]);
    
    
}
}
translate([+58/2,+58/2,-10])cylinder(r=2,h=40, $fn=30);
translate([-58/2,+58/2,-10])cylinder(r=2,h=40, $fn=30);
translate([-58/2,-58/2,-10])cylinder(r=2,h=40, $fn=30);
translate([+58/2,-58/2,-10])cylinder(r=2,h=40, $fn=30);

translate([0,0,-6])cylinder(r=29,h=6);

translate([-(25.2)/2,-(25.2)/2,-10])cube([25.2,25.2,135]);


translate([-45/2,3,-10])cylinder(r=6,h=80, $fn=30);
translate([-45/2-6,-3,-10])cube([12,6,135]);
translate([-45/2,-3,-10])cylinder(r=6,h=80, $fn=30);
}

