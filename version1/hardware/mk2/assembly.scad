
use <Getriebe.scad> 
use <Pulley_T-MXL-XL-HTD-GT2_N-tooth.scad>
// =============================================
module motor(t,r) {
   translate(t)rotate(r)import("motor_nema17.stl");
}

// =============================================
module drehteller(t=[0,0,0],r=[0,0,0], alpha=0.0) {
    
  module platte() {
    difference() {
      translate([-70/2,-70/2,-1])cube([70,70,2]);
      translate([0,0,-15])rotate([0,0,0])cylinder(r=38/2,h=30);  
      translate([+56/2,+56/2,-10])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);
      translate([+56/2,-56/2,-10])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);
      translate([-56/2,+56/2,-10])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);  
      translate([-56/2,-56/2,-10])rotate([0,0,0])cylinder(r=2,h=20, $fn=30); 
    }
  }
    
  module middle() {
    difference() {
      translate([0,0,-5.5])rotate([0,0,0])cylinder(r=30, h=11);
      translate([0,0,-15])rotate([0,0,0])cylinder(r=38/2,h=30); 
    }
  }

  translate(t)rotate(r)union(){
    translate([0,0,+5])rotate([0,0,alpha])platte();
    translate([0,0,0])middle();
    translate([0,0,-5])rotate([0,0,0])platte();  
  };

}
// =============================================


// =============================================
module gehauseUnten(t=[0,0,0],r=[0,0,0], ex=9.9) {
    translate(t)rotate(r)difference(){
      union(){
        translate([-70/2,-70/2,-0])cube([70,70,3]);
        translate([ex-42/2,-42/2,-0-2])cube([42,42,2]);
      }
      translate([ex,0,-15-2.5])cylinder(r=24/2,5, h=30);
        
      translate([ex+15.5,-15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      translate([ex-15.5,-15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      translate([ex+15.5,+15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      translate([ex-15.5,+15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      
      translate([ex+15.5,+15.5,-0])cylinder(r=6/2,5, h=4, $fn=30);
      translate([ex+15.5,-15.5,-0])cylinder(r=6/2,5, h=4, $fn=30);
      translate([ex-15.5,+15.5,-0])cylinder(r=6/2,5, h=4, $fn=30);
      translate([ex-15.5,-15.5,-0])cylinder(r=6/2,5, h=4, $fn=30);
      
      translate([-15,0,-15-2.5])cylinder(r=8, h=30);
      
      translate([+56/2,+56/2,-10-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);
      translate([+56/2,-56/2,-10-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);
      translate([-56/2,+56/2,-10-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);  
      translate([-56/2,-56/2,-10-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30); 
    }
}
// =============================================

if (false) {
color("blue")translate([0,0,+0])rotate([0,0,0])union(){
    pfeilhohlrad(modul=1, zahnzahl=40, breite=7, randbreite=3, eingriffswinkel=20, schraegungswinkel=20);
    
}

color("true")translate([0,0,+0])rotate([0,0,0])union(){
    pfeilhohlrad(modul=1, zahnzahl=40, breite=7, randbreite=3, eingriffswinkel=20, schraegungswinkel=20);
    
}


color("blue")difference(){
 union(){
   translate([-70/2,-70/2,-0])cube([70,70,3]);
   hull(){
     translate([0,0,0]) cylinder(r=33,h=3);
     translate([0,0,0])cylinder(r=24,h=7);
   }
 }
 translate([0,0,-1])cylinder(r=24,h=10);
 
 translate([+56/2,+56/2,-10-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);
 translate([+56/2,-56/2,-10-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);
 translate([-56/2,+56/2,-10-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);  
 translate([-56/2,-56/2,-10-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30); 
}
};




if (false) {
color("grey")drehteller(t=[0,0,-6],r=[0,0,0],alpha=0.0);
}


if (true) {
translate([12.4,0,0])union(){
if (false) color("red")motor(t=[0,0,-34],r=[0,0,0]);
if (false) color("green")translate([0,0,+0])rotate([0,0,0])pfeilrad (modul=1, zahnzahl=15, breite=7, bohrung=5, eingriffswinkel=20, schraegungswinkel=20, optimiert=true);
}

if (true) gehauseUnten(t=[0,0,-15],r=[0,0,0], ex=12.4);
}


