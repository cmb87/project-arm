import sys, os
import numpy as np
import matplotlib.pyplot as plt
import random
from matplotlib import pyplot as plt
from matplotlib import animation
import tensorflow as tf
from keras.layers import Input, Conv2DTranspose, BatchNormalization, ReLU, Conv2D, Lambda, MaxPooling2D, Dropout, Add, Dense

from train import fowardKinematics, buildModel, thetaMin, thetaMax

# Numpy
jointLength = np.asarray([0.5,0.6,0.3])
jointStates = np.asarray([np.deg2rad(40.0), np.deg2rad(-30.0), np.deg2rad(10.0)])
nJoints = jointLength.shape[0]


nTraj = 20 
# =============================================
r = 1.3
phi = np.linspace(-np.pi/2,np.pi,nTraj)
trajectory = np.stack([r*np.cos(phi), r*np.sin(phi), np.zeros((nTraj))]).T
#trajectory = np.stack([r*np.cos(phi), r*np.sin(phi), np.deg2rad(-30)*np.ones((nTraj))]).T
#trajectory = np.stack([r*np.cos(phi), r*np.sin(phi), phi]).T
#print(trajectory)


# =============================================
model = buildModel(nJoints)

model.load_weights("robot.h5")




# =============================================
thetaPred = model.predict(trajectory)
theta =  thetaMin + (thetaMax-thetaMin)*thetaPred

xPred = fowardKinematics(theta, jointLength, squeezeBatchDim=False, expand=False)


for i in range(nTraj):


    plt.plot([0,xPred[i,0,0]],[0,xPred[i,0,1]],'bo-')
    plt.plot(xPred[i,:,0],xPred[i,:,1],'bo-')


    plt.plot(trajectory[i,0],trajectory[i,1],'gs')



    # x2 = simulation2(jointLength, jointStates)

    # x,y,theta = simulation1(jointLength, jointStates)



plt.axis("equal")
plt.grid(True)
plt.show()