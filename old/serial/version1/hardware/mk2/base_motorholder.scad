// =============================================
module gehauseUnten(t=[0,0,0],r=[0,0,0]) {
    translate(t)rotate(r)difference(){
      union(){
        translate([-42/2,-42/2-15,-0-2])cube([42,15,15]);
        translate([-42/2,+42/2,-0-2])cube([42,15,15]);
        translate([-42/2,-42/2,-0-2])cube([42,42,4]);
      }
      translate([0,0,-15-2.5])cylinder(r=24/2,5, h=30);
        
      translate([+15.5,-15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      translate([-15.5,-15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      translate([+15.5,+15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      translate([-15.5,+15.5,-0-2.5])cylinder(r=3/2,5, h=30, $fn=30);
      
      
        translate([-50/2,-42/2-10-2,0.5])cube([50,10.1,10.1]);
        translate([-50/2,+42/2+2.5 ,0.5])cube([50,10.1,10.1]);
      
      translate([+56/2,+56/2,-18-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);
      translate([+56/2,-56/2,-18-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);
      translate([-56/2,+56/2,-18-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30);  
      translate([-56/2,-56/2,-18-0])rotate([0,0,0])cylinder(r=2,h=20, $fn=30); 
      translate([0,-57/2,-18-0])rotate([0,0,0])cylinder(r=1.5,h=20, $fn=30);
      translate([0,+57/2,-18-0])rotate([0,0,0])cylinder(r=1.5,h=20, $fn=30);
    }

}

gehauseUnten(t=[0,0,0],r=[0,0,0], ex=9.9);


