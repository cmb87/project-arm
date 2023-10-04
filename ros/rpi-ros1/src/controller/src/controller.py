#!/usr/bin/env python3

import sys, time
import numpy as np
import cv2
import roslib
import rospy
from sensor_msgs.msg import Range, JointState
from pySerialTransfer import pySerialTransfer as txfer

RAD2DEG = 180.0/3.14159

# =========================
class CommandStruct(object):
    angle1 = 90
    angle2 = 90
    angle3 = 90
    angle4 = 90
    angle5 = 90


class SensorStruct(object):
    range1 = 0.0
    range2 = 0.0
    angle1 = 90
    angle2 = 90
    angle3 = 90
    angle4 = 90
    angle5 = 90

# =========================
cmdStruct = CommandStruct
sensorStruct = SensorStruct

# =========================
def callback(data):
    # cmdStruct.angle1 = int(90 + data.position[0]*RAD2DEG)
    # cmdStruct.angle2 = int(90 + data.position[1]*RAD2DEG)
    # cmdStruct.angle3 = int(90 + data.position[2]*RAD2DEG)
    # cmdStruct.angle4 = int(90 - data.position[3]*RAD2DEG)
    # cmdStruct.angle5 = int(90 - data.position[4]*RAD2DEG)
    cmdStruct.angle1 = int(1500 + 600*data.position[0]*2/3.14159)
    cmdStruct.angle2 = int(1500 + 600*data.position[1]*2/3.14159)
    cmdStruct.angle3 = int(1500 + 600*data.position[2]*2/3.14159)
    cmdStruct.angle4 = int(1500 - 600*data.position[3]*2/3.14159)
    cmdStruct.angle5 = int(1500 - 600*data.position[4]*2/3.14159)


   # rospy.loginfo(f"{cmdStruct.angle1} {cmdStruct.angle2} {cmdStruct.angle3} {cmdStruct.angle4} {cmdStruct.angle5}")


# =========================
def main():
    '''Initializes and cleanup ros node'''
    rospy.init_node('arm_controller', anonymous=True)

    rangePub = rospy.Publisher("/arm/range", Range, queue_size=10)
    jointPub = rospy.Publisher("/arm/joints", JointState, queue_size=10)
    jointSub = rospy.Subscriber("/joint_states", JointState, callback)


    rangeMsg = Range()
    rangeMsg.radiation_type = 1
    rangeMsg.header.frame_id = "ir_ranger"
    rangeMsg.field_of_view = 0.44 # 25 degrees
    rangeMsg.min_range = 0.03 #
    rangeMsg.max_range = 2.0 #

    jointMsg = JointState()
    jointMsg.header.frame_id =  "world"


    # Serial Transfer           '/dev/ttyUSB0'
    link = txfer.SerialTransfer('/dev/ttyUSB0')
    link.open()
    time.sleep(5)

    print("starting")


    rate = rospy.Rate(10)

    # ================
    while not rospy.is_shutdown():


        # Send joing angles to arduino
        sendSize = 0
        sendSize += link.tx_obj([
            cmdStruct.angle1,
            cmdStruct.angle2,
            cmdStruct.angle3,
            cmdStruct.angle4,
            cmdStruct.angle5
            ], start_pos=sendSize)
        link.send(sendSize)


        ###################################################################
        # Wait for a response and report any errors while receiving packets
        ##################################################################
        while not link.available():
            if link.status < 0:
                if link.status == txfer.CRC_ERROR:
                    print('ERROR: CRC_ERROR')
                elif link.status == txfer.PAYLOAD_ERROR:
                    print('ERROR: PAYLOAD_ERROR')
                elif link.status == txfer.STOP_BYTE_ERROR:
                    print('ERROR: STOP_BYTE_ERROR')
                else:
                    print('ERROR: {}'.format(link.status))


        recSize = 0

        sensorStruct.range1 = link.rx_obj(obj_type='f', start_pos=recSize)
        recSize += txfer.STRUCT_FORMAT_LENGTHS['f']
        
        sensorStruct.range2 = link.rx_obj(obj_type='f', start_pos=recSize)
        recSize += txfer.STRUCT_FORMAT_LENGTHS['f']
        
        sensorStruct.angle1 = link.rx_obj(obj_type='i', start_pos=recSize)
        recSize += txfer.STRUCT_FORMAT_LENGTHS['i']

        sensorStruct.angle2 = link.rx_obj(obj_type='i', start_pos=recSize)
        recSize += txfer.STRUCT_FORMAT_LENGTHS['i']

        sensorStruct.angle3 = link.rx_obj(obj_type='i', start_pos=recSize)
        recSize += txfer.STRUCT_FORMAT_LENGTHS['i']

        sensorStruct.angle4 = link.rx_obj(obj_type='i', start_pos=recSize)
        recSize += txfer.STRUCT_FORMAT_LENGTHS['i']

        sensorStruct.angle5 = link.rx_obj(obj_type='i', start_pos=recSize)
        recSize += txfer.STRUCT_FORMAT_LENGTHS['i']


        # Publish range Message
        rangeMsg.header.stamp = rospy.Time.now()
        rangeMsg.range = SensorStruct.range1 
        rangePub.publish(rangeMsg)


        rate.sleep()
    return



if __name__ == '__main__':
    try:
        main()
    except rospy.ROSInterruptException:
        pass