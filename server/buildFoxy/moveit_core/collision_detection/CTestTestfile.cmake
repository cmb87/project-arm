# CMake generated Testfile for 
# Source directory: /server_ws/src/moveit2/moveit_core/collision_detection
# Build directory: /server_ws/build/moveit_core/collision_detection
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
add_test(test_world "/usr/bin/python3" "-u" "/opt/ros/foxy/share/ament_cmake_test/cmake/run_test.py" "/server_ws/build/moveit_core/test_results/moveit_core/test_world.gtest.xml" "--package-name" "moveit_core" "--output-file" "/server_ws/build/moveit_core/ament_cmake_gtest/test_world.txt" "--append-env" "LD_LIBRARY_PATH=/server_ws/build/moveit_core/collision_detection" "LD_LIBRARY_PATH=/server_ws/build/moveit_core/collision_detection/../robot_model" "LD_LIBRARY_PATH=/server_ws/build/moveit_core/collision_detection/../utils" "--command" "/server_ws/build/moveit_core/collision_detection/test_world" "--gtest_output=xml:/server_ws/build/moveit_core/test_results/moveit_core/test_world.gtest.xml")
set_tests_properties(test_world PROPERTIES  LABELS "gtest" REQUIRED_FILES "/server_ws/build/moveit_core/collision_detection/test_world" TIMEOUT "60" WORKING_DIRECTORY "/server_ws/build/moveit_core/collision_detection" _BACKTRACE_TRIPLES "/opt/ros/foxy/share/ament_cmake_test/cmake/ament_add_test.cmake;118;add_test;/opt/ros/foxy/share/ament_cmake_gtest/cmake/ament_add_gtest_test.cmake;86;ament_add_test;/opt/ros/foxy/share/ament_cmake_gtest/cmake/ament_add_gtest.cmake;93;ament_add_gtest_test;/server_ws/src/moveit2/moveit_core/collision_detection/CMakeLists.txt;42;ament_add_gtest;/server_ws/src/moveit2/moveit_core/collision_detection/CMakeLists.txt;0;")
add_test(test_world_diff "/usr/bin/python3" "-u" "/opt/ros/foxy/share/ament_cmake_test/cmake/run_test.py" "/server_ws/build/moveit_core/test_results/moveit_core/test_world_diff.gtest.xml" "--package-name" "moveit_core" "--output-file" "/server_ws/build/moveit_core/ament_cmake_gtest/test_world_diff.txt" "--append-env" "LD_LIBRARY_PATH=/server_ws/build/moveit_core/collision_detection" "LD_LIBRARY_PATH=/server_ws/build/moveit_core/collision_detection/../robot_model" "LD_LIBRARY_PATH=/server_ws/build/moveit_core/collision_detection/../utils" "--command" "/server_ws/build/moveit_core/collision_detection/test_world_diff" "--gtest_output=xml:/server_ws/build/moveit_core/test_results/moveit_core/test_world_diff.gtest.xml")
set_tests_properties(test_world_diff PROPERTIES  LABELS "gtest" REQUIRED_FILES "/server_ws/build/moveit_core/collision_detection/test_world_diff" TIMEOUT "60" WORKING_DIRECTORY "/server_ws/build/moveit_core/collision_detection" _BACKTRACE_TRIPLES "/opt/ros/foxy/share/ament_cmake_test/cmake/ament_add_test.cmake;118;add_test;/opt/ros/foxy/share/ament_cmake_gtest/cmake/ament_add_gtest_test.cmake;86;ament_add_test;/opt/ros/foxy/share/ament_cmake_gtest/cmake/ament_add_gtest.cmake;93;ament_add_gtest_test;/server_ws/src/moveit2/moveit_core/collision_detection/CMakeLists.txt;46;ament_add_gtest;/server_ws/src/moveit2/moveit_core/collision_detection/CMakeLists.txt;0;")
add_test(test_all_valid "/usr/bin/python3" "-u" "/opt/ros/foxy/share/ament_cmake_test/cmake/run_test.py" "/server_ws/build/moveit_core/test_results/moveit_core/test_all_valid.gtest.xml" "--package-name" "moveit_core" "--output-file" "/server_ws/build/moveit_core/ament_cmake_gtest/test_all_valid.txt" "--append-env" "LD_LIBRARY_PATH=/server_ws/build/moveit_core/collision_detection" "LD_LIBRARY_PATH=/server_ws/build/moveit_core/collision_detection/../robot_model" "LD_LIBRARY_PATH=/server_ws/build/moveit_core/collision_detection/../utils" "--command" "/server_ws/build/moveit_core/collision_detection/test_all_valid" "--gtest_output=xml:/server_ws/build/moveit_core/test_results/moveit_core/test_all_valid.gtest.xml")
set_tests_properties(test_all_valid PROPERTIES  LABELS "gtest" REQUIRED_FILES "/server_ws/build/moveit_core/collision_detection/test_all_valid" TIMEOUT "60" WORKING_DIRECTORY "/server_ws/build/moveit_core/collision_detection" _BACKTRACE_TRIPLES "/opt/ros/foxy/share/ament_cmake_test/cmake/ament_add_test.cmake;118;add_test;/opt/ros/foxy/share/ament_cmake_gtest/cmake/ament_add_gtest_test.cmake;86;ament_add_test;/opt/ros/foxy/share/ament_cmake_gtest/cmake/ament_add_gtest.cmake;93;ament_add_gtest_test;/server_ws/src/moveit2/moveit_core/collision_detection/CMakeLists.txt;50;ament_add_gtest;/server_ws/src/moveit2/moveit_core/collision_detection/CMakeLists.txt;0;")