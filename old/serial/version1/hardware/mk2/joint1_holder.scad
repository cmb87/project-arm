

module motorholderSide() {
    module motorholder() {
      translate([0,0,-15-2.5])cylinder(r=24/2,5, h=50);
      translate([+15.5,-15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      translate([-15.5,-15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      translate([+15.5,+15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      translate([-15.5,+15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
    };


    color("red")translate([41,00,11+41.5/2])rotate([0,-90,0])import("./motor_nema17.stl");

    difference(){
    hull(){
      translate([-15/2+58/2,-80/2,0])cube([15,80,10.75]);
      translate([-15/2+58/2,-(41.5)/2,42+10.75+20])cube([15,41.5,15]); 
    }
      translate([-15/2+58/2+3,-42/2,10.75])cube([30,42,42]); 
      translate([+58/2,+58/2,-20])cylinder(r=2,h=90, $fn=30);
      translate([+58/2,-58/2,-20])cylinder(r=2,h=90, $fn=30);

      translate([+58/2,-58/2,+5])cylinder(r=5,h=90, $fn=30);
      translate([+58/2-10/2,-42/2-8-42,+5])cube([10,42,82]); 


      translate([+58/2,+58/2,+5])cylinder(r=5,h=90, $fn=30);
      translate([+58/2-10/2,+42/2+8,+5])cube([10,42,82]); 

      translate([+20,0,10.75+42/2])rotate([0,90,0])motorholder();

    translate([21.5-0.01,0,42+10.75+20])rotate([0,90,0])cylinder(r=6,h=10.01, $fn=30);

    translate([0,0,42+10.75+20])rotate([0,90,0])cylinder(r=3,h=50, $fn=30);
    }
}
//42+10.75+20

module motorholderPassive() {

    difference(){
    hull(){
      translate([-15/2+58/2,-80/2,0])cube([15,80,10.75]);
      translate([-15/2+58/2,-(41.5)/2,42+10.75+20])cube([15,41.5,15]); 
    }

      translate([+58/2,+58/2,-20])cylinder(r=2,h=90, $fn=30);
      translate([+58/2,-58/2,-20])cylinder(r=2,h=90, $fn=30);

      translate([+58/2,-58/2,+5])cylinder(r=5,h=90, $fn=30);
      translate([+58/2-10/2,-42/2-8-42,+5])cube([10,42,82]); 

      translate([+58/2,+58/2,+5])cylinder(r=5,h=90, $fn=30);
      translate([+58/2-10/2,+42/2+8,+5])cube([10,42,82]); 


    translate([21.5-0.01,0,42+10.75+20])rotate([0,90,0])cylinder(r=6,h=10.01, $fn=30);
    translate([0,0,42+10.75+20])rotate([0,90,0])cylinder(r=3,h=50, $fn=30);
    
hull(){
translate([-50,-18,15])rotate([0,90,0])cylinder(r=5,h=90, $fn=30);
translate([-50,+18,15])rotate([0,90,0])cylinder(r=5,h=90, $fn=30);
translate([-50,0,45])rotate([0,90,0])cylinder(r=15,h=90, $fn=30);
}
    
    }
}

translate([-58,0,0])motorholderPassive();
motorholderSide();

