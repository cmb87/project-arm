
include <Getriebe.scad>


bearingOuter= 65.1;
bearingInner = 50.0;
bearingHeight = 7.3;
shaftWidth = 25.3;

baseWidth0 = 115;
baseWidth1 = 70;

neam17HolderWidth=80;
widthNema17HolderBlock=15;

zGear = 6;
zGearRitzelOffset = 36;
zMast = 30.0;

showBearings = 0;

// ================================================
module bearing(di,da,h){
    difference(){
        cylinder(r=da/2,h=h,$fn=30);
        translate([0,0,-0.1])
        cylinder(r=di/2,h=h+0.2,$fn=30);
    }
    
    
    }
    
// ================================================
module mastHolder(){
    
    difference(){
        cylinder(r=bearingOuter/2-5,h=zMast,$fn=30);
        
        translate([0,0,-0.0001])
        bearing(bearingInner,bearingOuter+0.001,bearingHeight+0.05);
        
        translate([0,0,zMast-bearingHeight])   
        bearing(bearingInner,bearingOuter+0.001,bearingHeight+0.05);
        
        cube([shaftWidth,shaftWidth,80],center=true);
        
        translate([-70/2,10,zMast/2])
        rotate([0,90,0])
        cylinder(r=3/2,h=70,$fn=30);
        translate([-70/2,-10,zMast/2])
        rotate([0,90,0])
        cylinder(r=3/2,h=70,$fn=30);
        
        translate([35/2,-10,zMast/2])
        rotate([0,90,0])
        cylinder(r=5.6/2,h=70,$fn=30);
        translate([35/2,+10,zMast/2])
        rotate([0,90,0])
        cylinder(r=5.6/2,h=70,$fn=30);
        
        translate([-70 -35/2 ,-10,zMast/2])
        rotate([0,90,0])
        cylinder(r=6.2/2,h=70,$fn=6);
        translate([-70 -35/2 ,+10,zMast/2])
        rotate([0,90,0])
        cylinder(r=6.2/2,h=70,$fn=6);
        
        translate([0 ,18,-35])
        cylinder(r=2.5/2,h=70,$fn=30);
        translate([18 ,0,-35])
        cylinder(r=2.5/2,h=70,$fn=30);
        
        translate([0 ,-18,-35])
        cylinder(r=2.5/2,h=70,$fn=30);
        translate([-18 ,0,-35])
        cylinder(r=2.5/2,h=70,$fn=30);
        
    }

}
    
// ================================================


module base() {
    difference(){
        hull(){
          translate([0,0,+0.5])
          cube([baseWidth0,baseWidth0,1],center=true);
          translate([0,0,zMast-0.5])
          cube([baseWidth1,baseWidth1,1],center=true);
        } 
        
        translate([0,0,-1])
        cylinder(r=bearingInner/2+5,h=70,$fn=30);
        
        translate([0,0,-0.0001])
        bearing(bearingInner,bearingOuter+0.001,bearingHeight+0.05);
        
        translate([0,0,zMast-bearingHeight])   
        bearing(bearingInner,bearingOuter+0.001,bearingHeight+0.05);
        
        // Nema welle
        translate([zGearRitzelOffset,0,-1])
        cylinder(r=5.5/2,h=20,$fn=30);
        
        // Sensor holders
        b = 26;
        translate([b ,b,-35])
        cylinder(r=2.8/2,h=70,$fn=30);
        translate([-b ,b,-35])
        cylinder(r=2.8/2,h=70,$fn=30);
        translate([b ,-b,-35])
        cylinder(r=2.8/2,h=70,$fn=30);
        translate([-b ,-b,-35])
        cylinder(r=2.8/2,h=70,$fn=30);
        
        b1 = 30;
        translate([b1 ,b1,-35])
        cylinder(r=4/2,h=70,$fn=30);
        translate([-b1 ,b1,-35])
        cylinder(r=4/2,h=70,$fn=30);
        translate([b1 ,-b1,-35])
        cylinder(r=4/2,h=70,$fn=30);
        translate([-b1 ,-b1,-35])
        cylinder(r=4/2,h=70,$fn=30);
        
        // Main attachment drillings
        c = 47;
        d = 5;
        translate([c ,c,-35])
        cylinder(r=d/2,h=70,$fn=30);
        translate([-c ,c,-35])
        cylinder(r=d/2,h=70,$fn=30);
        translate([c ,-c,-35])
        cylinder(r=d/2,h=70,$fn=30);
        translate([-c ,-c,-35])
        cylinder(r=d/2,h=70,$fn=30);
        
        translate([c ,c,7])
        cylinder(r=8.6/2,h=70,$fn=30);
        translate([-c ,c,7])
        cylinder(r=8.6/2,h=70,$fn=30);
        translate([c ,-c,7])
        cylinder(r=8.6/2,h=70,$fn=30);
        translate([-c ,-c,7])
        cylinder(r=8.6/2,h=70,$fn=30);
        
        
        // Nema holder
        translate([zGearRitzelOffset,0,-0.1])
        translate([10/2,neam17HolderWidth/2-widthNema17HolderBlock/2,0])
        cylinder(r=2.5/2,h=20,$fn=30);
      
        translate([zGearRitzelOffset,0,-0.1])
        translate([-31/2,neam17HolderWidth/2-widthNema17HolderBlock/2,0])
        cylinder(r=2.5/2,h=20,$fn=30);
      
        translate([zGearRitzelOffset,0,-0.1])
        translate([10/2,-neam17HolderWidth/2+widthNema17HolderBlock/2,0])
        cylinder(r=2.5/2,h=20,$fn=30);
        
        translate([zGearRitzelOffset,0,-0.1])
        translate([-31/2,-neam17HolderWidth/2+widthNema17HolderBlock/2,0])
        cylinder(r=2.5/2,h=20,$fn=30);
        
    }


        
}
// ================================================

module mastGear(){
    difference(){
        rotate([0,0,45])
        rotate([180,0,0])
        translate([0,0,1])
         stirnrad (modul=1, zahnzahl=52, breite=zGear, bohrung=4, eingriffswinkel=20, schraegungswinkel=10, optimiert=false);
        
        cube([shaftWidth,shaftWidth,80],center=true);
        
        translate([0 ,18,-35])
        cylinder(r=3.1/2,h=70,$fn=30);
        translate([18 ,0,-35])
        cylinder(r=3.1/2,h=70,$fn=30);
        translate([0 ,-18,-35])
        cylinder(r=3.1/2,h=70,$fn=30);
        translate([-18 ,0,-35])
        cylinder(r=3.1/2,h=70,$fn=30);
        
        translate([0 ,18,-1-3.5+0.01])
        cylinder(r=5.55/2,h=3.5,$fn=30);
        translate([18 ,0,-1-3.5+0.01])
        cylinder(r=5.55/2,h=3.5,$fn=30);
        translate([0 ,-18,-1-3.5+0.01])
        cylinder(r=5.55/2,h=3.5,$fn=30);
        translate([-18 ,0,-1-3.5+0.01])
        cylinder(r=5.55/2,h=3.5,$fn=30);
        
    }
    

    
}

// ================================================
module ritzel(){
    translate([zGearRitzelOffset,0,-zGear-1])
    rotate([0,0,45])
    stirnrad (modul=1, zahnzahl=20, breite=zGear, bohrung=4.6, eingriffswinkel=20, schraegungswinkel=-10, optimiert=true);
}

//stirnrad (modul=1, zahnzahl=52, breite=5, bohrung=4, eingriffswinkel=20, schraegungswinkel=10, optimiert=false);
// ================================================
module nema17(h=37.5,dz=9) {
    
    translate([zGearRitzelOffset,0,-h-zGear-1-dz])
    translate([0,0,h/2])
    
    difference(){
      union(){
        cube([42.2,42.2,h],center=true);
          
        translate([0 ,0,-h/2])
        cylinder(r=5/2,h=h+10,$fn=30);
        translate([0 ,0,-h/2])
        cylinder(r=22.4/2,h=h+2,$fn=30);
          
      }
        translate([31/2 ,31/2,-h/2])
        cylinder(r=3.1/2,h=h+10,$fn=30);
        translate([-31/2 ,31/2,-h/2])
        cylinder(r=3.1/2,h=h+10,$fn=30);
        translate([31/2 ,-31/2,-h/2])
        cylinder(r=3.1/2,h=h+10,$fn=30);
        translate([-31/2 ,-31/2,-h/2])
        cylinder(r=3.1/2,h=h+10,$fn=30);
    }
    
    
}
// ================================================
module nema17Holder(h=8,dz=9) {
    
    translate([zGearRitzelOffset,0,-zGear-1-dz])
    translate([0,0,h/2])
    
    difference(){
      union(){
        cube([42.2,neam17HolderWidth,h],center=true);
          
        translate([0,neam17HolderWidth/2-widthNema17HolderBlock/2,h/2+0.5])
        cube([42.2,widthNema17HolderBlock,h+zGear+1],center=true); 
        
        mirror([0,1,0])
        translate([0,neam17HolderWidth/2-widthNema17HolderBlock/2,h/2+0.5])
        cube([42.2,widthNema17HolderBlock,h+zGear+1],center=true); 

          
      }
        translate([0 ,0,-(h+2)/2])
        cylinder(r=26/2,h=h+2,$fn=30);
      
        translate([31/2 ,31/2,-h/2])
        cylinder(r=3.1/2,h=h+10,$fn=30);
        translate([-31/2 ,31/2,-h/2])
        cylinder(r=3.1/2,h=h+10,$fn=30);
        translate([31/2 ,-31/2,-h/2])
        cylinder(r=3.1/2,h=h+10,$fn=30);
        translate([-31/2 ,-31/2,-h/2])
        cylinder(r=3.1/2,h=h+10,$fn=30);
      
      
        translate([31/2 ,31/2,0])
        cylinder(r=5.55/2,h=h,$fn=30);
        translate([-31/2 ,31/2,0])
        cylinder(r=5.55/2,h=h,$fn=30);
        translate([31/2 ,-31/2,0])
        cylinder(r=5.55/2,h=h,$fn=30);
        translate([-31/2 ,-31/2,0])
        cylinder(r=5.55/2,h=h,$fn=30);
      
      
        translate([10/2,neam17HolderWidth/2-widthNema17HolderBlock/2,-h/2-5])
        cylinder(r=3.1/2,h=h+30,$fn=30);
      
        translate([-31/2,neam17HolderWidth/2-widthNema17HolderBlock/2,-h/2-5])
        cylinder(r=3.1/2,h=h+30,$fn=30);
      
        translate([10/2,-neam17HolderWidth/2+widthNema17HolderBlock/2,-h/2-5])
        cylinder(r=3.1/2,h=h+30,$fn=30);
      
        translate([-31/2,-neam17HolderWidth/2+widthNema17HolderBlock/2,-h/2-5])
        cylinder(r=3.1/2,h=h+30,$fn=30);
      
    }
 
        
}
// ================================================



//color("red")   
mastHolder();
base();
mastGear();
ritzel();

//color("yellow")nema17();

color("green")translate([0,0,0])nema17Holder();


if (showBearings==1){
    translate([0,0,0])
    bearing(bearingInner,bearingOuter,bearingHeight);

    translate([0,0,zMast-bearingHeight])   
    bearing(bearingInner,bearingOuter,bearingHeight);
}