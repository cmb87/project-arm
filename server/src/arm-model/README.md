# Packages to install

    apt-get install libgazebo6-dev
    sudo apt install ros-foxy-joint-state-publisher-gui
    sudo apt install ros-foxy-robot-state-publisher
    sudo apt install ros-foxy-xacro
    pip3 install xacro

    sudo apt install ros-foxy-gazebo-ros-pkgs

## Install Gazebo

https://classic.gazebosim.org/tutorials?tut=install_ubuntu&cat=install

    curl -sSL http://get.gazebosim.org | sh


# Convert XACRO to URDF

    xacro arm.xacro > arm.xacro.urdf