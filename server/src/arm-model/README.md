# Packages to install

    sudo apt install ros-foxy-joint-state-publisher-gui
    sudo apt install ros-foxy-robot-state-publisher
    sudo apt install ros-foxy-xacro
    sudo apt install ros-foxy-teleop-twist-joy
    sudo apt install ros-foxy-gazebo-ros-pkgs
    sudo apt install ros-foxy-teleop-twist-joy
    sudo apt install python3-pip
    sudo apt-get install usbutils
    pip3 install xacro

    


apt install ros-foxy-teleop-twist-joy ros-foxy-joint-state-publisher-gui ros-foxy-robot-state-publisher ros-foxy-xacro ros-foxy-gazebo-ros-pkgs python3-pip usbutils -y && pip3 install xacro && curl -sSL http://get.gazebosim.org | sh

## Install Gazebo

https://classic.gazebosim.org/tutorials?tut=install_ubuntu&cat=install

    curl -sSL http://get.gazebosim.org | sh


# Convert XACRO to URDF

    xacro arm.xacro > arm.xacro.urdf