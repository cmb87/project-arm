"""Simple example showing how to get gamepad events."""
import time
import logging
import socketio
import json
import config
import numpy as np
from pySerialTransfer import pySerialTransfer as txfer


NAME = "DeltaController"

# =============================================
# Set logging formats
logging.basicConfig(
    level=config.server["logginglevel"],
    format=("[%(filename)8s] [%(levelname)4s] :  %(funcName)s - %(message)s"),
)

# =========================
deltaRobot = Delta(e=0.138,f=0.474,re=0.384,rf=0.18)

# =========================
class JointStruct(object):
    theta1 = 0
    theta2 = 0
    theta3 = 0


class PositionStruct(object):
    theta1 = 1500
    theta2 = 1500
    theta3 = 1500


class SerialLink(object):
    def __init__(self, serialPort="COM4"):
        self.link = txfer.SerialTransfer(serialPort)
        self.link.open()
        logging.info(f"starting serial connection to {serialPort}")
        sleep(5)
        
    def send(self, theta1, theta2, theta3):

        if not self.link.available():
            if self.link.status < 0:
                if self.link.status == txfer.CRC_ERROR:
                    logging.error('ERROR: CRC_ERROR')
                elif self.link.status == txfer.PAYLOAD_ERROR:
                    logging.error('ERROR: PAYLOAD_ERROR')
                elif self.link.status == txfer.STOP_BYTE_ERROR:
                    logging.error('ERROR: STOP_BYTE_ERROR')
                else:
                    logging.error('ERROR: {}'.format(self.link.status))


        sendSize = 0
        sendSize += self.link.tx_obj([theta1, theta2, theta3], start_pos=sendSize)
        self.link.send(sendSize)



# =========================
jointStruct = JointStruct
positionStruct = PositionStruct
serial = SerialLink()


# standard Python
sio = socketio.Client()


@sio.on('connect', namespace='/delta')
def connect():
    print("I'm connected!")
    #sio.emit('newUser', {'userName': NAME, "socketID": "1234"}, namespace="/delta")


@sio.on('disconnect', namespace='/delta')
def disconnect():
    print("I'm disconnected!")
    #sio.emit('disconnect', {'userName': NAME, "socketID": "1234"}, namespace="/camera")


@sio.on('control', namespace="/delta")
def on_message(data):

    serial.send()



if __name__ == "__main__":


    print("Starting inferenceEngine")
    sio.connect(f"http://{config.server['hostname']}:{config.server['port']}", namespaces=['/inference', "/camera"])

