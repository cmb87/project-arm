import sys, time
import numpy as np
import cv2
import roslib
import rospy
from sensor_msgs.msg import Range, JointState
from pySerialTransfer import pySerialTransfer as txfer


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
    cmdStruct.angle1 = data.position[0]
    cmdStruct.angle2 = data.position[1]
    cmdStruct.angle3 = data.position[2]
    cmdStruct.angle4 = data.position[3]
    cmdStruct.angle5 = data.position[4]
    rospy.loginfo(rospy.get_caller_id() + "I heard %s", data.position)


# =========================
def main():
    '''Initializes and cleanup ros node'''
    rospy.init_node('arm_controller', anonymous=True)

    rangePub = rospy.Publisher("/arm/range", Range)
    jointPub = rospy.Publisher("/arm/joints", JointState)
    jointSub = rospy.Subscriber("/joint_states", JointState, callback)


    rangeMsg = Range
    rangeMsg.radiation_type = rangeMsg.Range.INFRARED
    rangeMsg.header.frame_id =  "ir_ranger"
    rangeMsg.field_of_view = 0.44 # 25 degrees
    rangeMsg.min_range = 0.03 #
    rangeMsg.max_range = 2.0 #

    jointMsg = JointState
    jointMsg.header.frame_id =  "world"


    # Serial Transfer
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





# =========================

try:

    link = txfer.SerialTransfer('COM5')
    link.open()
    sleep(5)
    print("starting")

    cmdStruct.yaw += (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * vel
    cmdStruct.throttle += (keys[pygame.K_DOWN] - keys[pygame.K_UP]) * vel
        

    sendSize = 0
    sendSize += link.tx_obj([1500,cmdStruct.yaw,1500,cmdStruct.throttle,1500,1500,1500,1500], start_pos=sendSize)

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

    SensorStruct.sonar1 = link.rx_obj(obj_type='f', start_pos=recSize)
    recSize += txfer.STRUCT_FORMAT_LENGTHS['f']
    
    SensorStruct.sonar2 = link.rx_obj(obj_type='f', start_pos=recSize)
    recSize += txfer.STRUCT_FORMAT_LENGTHS['f']
    
    SensorStruct.sonar3 = link.rx_obj(obj_type='f', start_pos=recSize)
    recSize += txfer.STRUCT_FORMAT_LENGTHS['f']

    SensorStruct.heading = link.rx_obj(obj_type='f', start_pos=recSize)
    recSize += txfer.STRUCT_FORMAT_LENGTHS['f']

    SensorStruct.ax = link.rx_obj(obj_type='f', start_pos=recSize)
    recSize += txfer.STRUCT_FORMAT_LENGTHS['f']


    print(f"{cmdStruct.throttle}, {cmdStruct.yaw}, {SensorStruct.sonar1}, {SensorStruct.sonar2}, {SensorStruct.sonar3}, {SensorStruct.heading}, {SensorStruct.ax}")



except KeyboardInterrupt:
    link.close()

