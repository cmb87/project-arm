# CMake generated Testfile for 
# Source directory: /server_ws/src/moveit2/moveit_core/constraint_samplers
# Build directory: /server_ws/build/moveit_core/constraint_samplers
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
add_test(test_constraint_samplers "/usr/bin/python3" "-u" "/opt/ros/foxy/share/ament_cmake_test/cmake/run_test.py" "/server_ws/build/moveit_core/test_results/moveit_core/test_constraint_samplers.gtest.xml" "--package-name" "moveit_core" "--output-file" "/server_ws/build/moveit_core/ament_cmake_gtest/test_constraint_samplers.txt" "--command" "/server_ws/build/moveit_core/constraint_samplers/test_constraint_samplers" "--gtest_output=xml:/server_ws/build/moveit_core/test_results/moveit_core/test_constraint_samplers.gtest.xml")
set_tests_properties(test_constraint_samplers PROPERTIES  LABELS "gtest" REQUIRED_FILES "/server_ws/build/moveit_core/constraint_samplers/test_constraint_samplers" TIMEOUT "60" WORKING_DIRECTORY "/server_ws/build/moveit_core/constraint_samplers" _BACKTRACE_TRIPLES "/opt/ros/foxy/share/ament_cmake_test/cmake/ament_add_test.cmake;118;add_test;/opt/ros/foxy/share/ament_cmake_gtest/cmake/ament_add_gtest_test.cmake;86;ament_add_test;/opt/ros/foxy/share/ament_cmake_gtest/cmake/ament_add_gtest.cmake;93;ament_add_gtest_test;/server_ws/src/moveit2/moveit_core/constraint_samplers/CMakeLists.txt;40;ament_add_gtest;/server_ws/src/moveit2/moveit_core/constraint_samplers/CMakeLists.txt;0;")
