
difference(){
    union(){
        translate([-55/2,-30/2,0])cube([55,30,3]);

        hull(){
            translate([-14/2+10,-14/2,0])cube([14,14,13]);
            translate([-30/2+10,-30/2,0])cube([30,30,3]);
        }

        hull(){
            translate([-14/2-10,-14/2,0])cube([14,14,13]);
            translate([-30/2-10,-30/2,0])cube([30,30,3]);
        }
    }

    translate([-10.3/2-10,-10.3/2,-1])cube([10.3,10.3,25]);
    translate([-10.3/2+10,-10.3/2,-1])cube([10.3,10.3,25]);

    translate([24,-5,-1])cylinder(r=1.5,h=100,$fn=30);
    translate([24,5,-1])cylinder(r=1.5,h=100,$fn=30);

    translate([-24,-5,-1])cylinder(r=1.5,h=100,$fn=30);
    translate([-24,5,-1])cylinder(r=1.5,h=100,$fn=30);
    
    translate([-24,-5,3])cylinder(r=4,h=100,$fn=30);
    translate([+24,-5,3])cylinder(r=4,h=100,$fn=30);
    translate([-24,+5,3])cylinder(r=4,h=100,$fn=30);
    translate([+24,+5,3])cylinder(r=4,h=100,$fn=30);
}

