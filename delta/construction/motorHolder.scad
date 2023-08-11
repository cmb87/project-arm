
//translate([50,0,+20])rotate([0,180,0])color("red")import("motor_nema17.stl");

difference(){
hull(){
translate([0,0,0])cylinder(r=40/2, h=20, $fn=40);
translate([30,-58/2,0])cube([58,58,6]);
}
translate([-20.1/2,-20.1/2,-1])cube([20.1,20.1,42]);  

translate([25,-42.5/2,4])cube([57,42.5,20]);

translate([50,0,-5])cylinder(r=22.5/2, h=15, $fn=40);
translate([60,0,-5])cylinder(r=22.5/2, h=15, $fn=40);
translate([55-10/2,-22.5/2,-5])cube([10,22.5,20]);


translate([50+31/2,+31/2,-5])cylinder(r=3/2, h=15, $fn=40);
translate([50-31/2,+31/2,-5])cylinder(r=3/2, h=15, $fn=40);
translate([50-31/2,-31/2,-5])cylinder(r=3/2, h=15, $fn=40);
translate([50+31/2,-31/2,-5])cylinder(r=3/2, h=15, $fn=40);

translate([60+31/2,+31/2,-5])cylinder(r=3/2, h=15, $fn=40);
translate([60-31/2,+31/2,-5])cylinder(r=3/2, h=15, $fn=40);
translate([60-31/2,-31/2,-5])cylinder(r=3/2, h=15, $fn=40);
translate([60+31/2,-31/2,-5])cylinder(r=3/2, h=15, $fn=40);

translate([55-10/2+31/2,-3/2+31/2,-5])cube([10,3,20]);
translate([55-10/2+31/2,-3/2-31/2,-5])cube([10,3,20]);
translate([55-10/2-31/2,-3/2-31/2,-5])cube([10,3,20]);
translate([55-10/2-31/2,-3/2+31/2,-5])cube([10,3,20]);

}


