# CMake generated Testfile for 
# Source directory: /server_ws/src/moveit2/moveit_ros/planning/rdf_loader
# Build directory: /server_ws/build/moveit_ros_planning/rdf_loader
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
add_test(rdf_loader_test_launch_test_rdf_integration.test.py "/usr/bin/python3" "-u" "/opt/ros/foxy/share/ament_cmake_test/cmake/run_test.py" "/server_ws/build/moveit_ros_planning/test_results/moveit_ros_planning/rdf_loader_test_launch_test_rdf_integration.test.py.xunit.xml" "--package-name" "moveit_ros_planning" "--output-file" "/server_ws/build/moveit_ros_planning/ros_test/CHANGEME.txt" "--command" "ros2" "test" "/server_ws/src/moveit2/moveit_ros/planning/rdf_loader/test/launch/test_rdf_integration.test.py" "--junit-xml=/server_ws/build/moveit_ros_planning/test_results/moveit_ros_planning/rdf_loader_test_launch_test_rdf_integration.test.py.xunit.xml" "--package-name=moveit_ros_planning")
set_tests_properties(rdf_loader_test_launch_test_rdf_integration.test.py PROPERTIES  TIMEOUT "120" WORKING_DIRECTORY "/server_ws/build/moveit_ros_planning/rdf_loader" _BACKTRACE_TRIPLES "/opt/ros/foxy/share/ament_cmake_test/cmake/ament_add_test.cmake;118;add_test;/opt/ros/foxy/share/ros_testing/cmake/add_ros_test.cmake;73;ament_add_test;/server_ws/src/moveit2/moveit_ros/planning/rdf_loader/CMakeLists.txt;28;add_ros_test;/server_ws/src/moveit2/moveit_ros/planning/rdf_loader/CMakeLists.txt;0;")
subdirs("../gtest")
