
# Build

    colcon build --packages-select arm_model

# Packages to install

    sudo apt install ros-foxy-joint-state-publisher-gui
    sudo apt install ros-foxy-robot-state-publisher
    sudo apt install ros-foxy-xacro
    sudo apt install ros-foxy-teleop-twist-joy
    sudo apt install ros-foxy-gazebo-ros-pkgs
    sudo apt install ros-foxy-teleop-twist-joy
    sudo apt install ros-foxy-rmw-cyclonedds-cpp
     	
    sudo apt install ros-foxy-moveit_configs_utils
    sudo apt install python3-pip
    sudo apt-get install usbutils
    pip3 install xacro


apt install ros-foxy-teleop-twist-joy ros-foxy-joint-state-publisher-gui ros-foxy-robot-state-publisher ros-foxy-xacro ros-foxy-gazebo-ros-pkgs python3-pip usbutils -y && pip3 install xacro && curl -sSL http://get.gazebosim.org | sh

## Install MoveIT2

https://moveit.ros.org/install-moveit2/source/

    export COLCON_WS=~/ws_moveit2/
    mkdir -p $COLCON_WS/src
    cd $COLCON_WS/src

    git clone https://github.com/ros-planning/moveit2.git -b $ROS_DISTRO
    for repo in moveit2/moveit2.repos $(f="moveit2/moveit2_$ROS_DISTRO.repos"; test -r $f && echo $f); do vcs import < "$repo"; done
    rosdep install -r --from-paths . --ignore-src --rosdistro $ROS_DISTRO -y

    colcon build --event-handlers desktop_notification- status- --cmake-args -DCMAKE_BUILD_TYPE=Release


## Install Gazebo

https://classic.gazebosim.org/tutorials?tut=install_ubuntu&cat=install

    curl -sSL http://get.gazebosim.org | sh

# On Host computer

    sudo xhost +

# Convert XACRO to URDF

    xacro arm.xacro > arm.xacro.urdf



# Black Screen in Humble vs Foxy
In the fovy container, OpenGL 3.1 is used:
from the humble one, it is OpenGL 4.5:

When using docker adding ---ipc=host to the run command or adding ipc: host to the docker-compose file fixes this for me.
From here: Stack overflow


docker run -ti --ipc=host -e DISPLAY=":1" -v /tmp/.X11-unix:/tmp/.X11-unix -v $(pwd)/server:/server_ws moveit/moveit2:humble-release bash
