a1 = 32;
a2 =25.5;
a3 = 5;
b1 = 14;

c1 = 9;
c2 = 10;
c3 = 3;


module camera(){
 translate([-a1/2,-a2/2,-3])cube([a1,a2,a3+3]);
 translate([-b1/2,-b1/2,0])cube([b1,b1,10]);
 translate([-c1/2+5,-c2/2+13,-3])cube([c1,c2,c3]);
}



difference(){

union(){
hull(){
  translate([-(a1+3)/2,-(a2+3)/2,-0.01])cube([a1+3,a2+3,a3+4]);
  translate([-25/2,-21,6])cube([25,10,3]);
}

translate([-18,-5,0])cylinder(r=3,h=9,$fn=30);
translate([-18, 5,0])cylinder(r=3,h=9,$fn=30);
translate([+18,-5,0])cylinder(r=3,h=9,$fn=30);
translate([+18, 5,0])cylinder(r=3,h=9,$fn=30);


}
translate([0,0,2.9])camera();
    
translate([+10,-b1/2-9,-1])cylinder(r=1.,h=20,$fn=30);
translate([-10,-b1/2-9,-1])cylinder(r=1.,h=20,$fn=30);
translate([-10,-b1/2-9,-16])cylinder(r=2,h=20,$fn=30);
translate([+10,-b1/2-9,-16])cylinder(r=2,h=20,$fn=30);

translate([-18,-5,-1])cylinder(r=1,h=11,$fn=30);
translate([-18, 5,-1])cylinder(r=1,h=11,$fn=30);
translate([+18,-5,-1])cylinder(r=1,h=11,$fn=30);
translate([+18, 5,-1])cylinder(r=1,h=11,$fn=30);

}

translate([+13,10,5.5])cylinder(r=2,h=3,$fn=30);
translate([-13,10,5.5])cylinder(r=2,h=3,$fn=30);
translate([-13,-10,5.5])cylinder(r=2,h=3,$fn=30);
translate([+13,-10,5.5])cylinder(r=2,h=3,$fn=30);

