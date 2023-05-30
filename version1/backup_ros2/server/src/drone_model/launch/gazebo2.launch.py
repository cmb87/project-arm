import os
from ament_index_python.packages import get_package_share_directory
from launch import LaunchDescription
from launch.actions import IncludeLaunchDescription
from launch.launch_description_sources import PythonLaunchDescriptionSource
from launch.substitutions import LaunchConfiguration
 
from launch_ros.actions import Node
import xacro
 
 
def generate_launch_description():
 
    # Specify the name of the package and path to xacro file within the package

    use_sim_time = LaunchConfiguration('use_sim_time', default='true')
    xacro_file = os.path.join(get_package_share_directory('drone_model'), "urdf", "bicopter.xacro")
 
    # Use xacro to process the file
    robot_description_raw = xacro.process_file(xacro_file).toxml()
 
 
    # Configure the node
    node_robot_state_publisher = Node(
        package='robot_state_publisher',
        executable='robot_state_publisher',
        output='screen',
        parameters=[{'robot_description': robot_description_raw, 'use_sim_time': True}] # add other parameters here if required
    )
 
 
    gazebo = IncludeLaunchDescription(
        PythonLaunchDescriptionSource([os.path.join(get_package_share_directory('gazebo_ros'), 'launch'), '/gazebo.launch.py']),
    )
 
    spawn_entity = Node(package='gazebo_ros', executable='spawn_entity.py',
        arguments=['-topic', 'robot_description','-entity', 'bicopter'], output='screen'
    )
 
 
    propellerRight = Node(
        package='drone_model',
        executable='propellerSingle',
        output='screen',
        parameters=[{'topicPropellerForce': '/force/prop_right', 'topicPropellerCmd': '/cmd/prop_right', 'use_sim_time': True}] # add other parameters here if required
    )

    propellerLeft = Node(
        package='drone_model',
        executable='propellerSingle',
        output='screen',
        parameters=[{'topicPropellerForce': '/force/prop_left', 'topicPropellerCmd': '/cmd/prop_left', 'use_sim_time': True}] # add other parameters here if required
    )

    propellerLeft = Node(
        package='drone_model',
        executable='propellerSingle',
        output='screen',
        parameters=[{'topicPropellerForce': '/force/prop_left', 'topicPropellerCmd': '/cmd/prop_left', 'use_sim_time': True}] # add other parameters here if required
    )

    controller = Node(
        package='drone_model',
        executable='controller',
        output='screen',
        parameters=[{'use_sim_time': True}] # add other parameters here if required
    )

    # Run the node
    return LaunchDescription([
        gazebo,
        node_robot_state_publisher,
        spawn_entity,
        propellerRight,
        propellerLeft,
        controller
    ])