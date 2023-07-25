import sys, os
import numpy as np
import matplotlib.pyplot as plt
import random
from matplotlib import pyplot as plt
from matplotlib import animation

from train import buildModel


class Manipulator:
    def __init__(self, jointLength, theta, thetaMin, thetaMax, name=""):
        self.jointLength = jointLength
        self.nJoints = len(jointLength)
        self.name = name
        self.timeElapsed = 0

        self.thetaMax = np.asarray(thetaMax)
        self.thetaMin = np.asarray(thetaMin)

        
        self.thetaCurrent = np.asarray(theta)
        self.xcurrent = self.forwardKinematic(np.asarray(theta))

        self.ikModel = None


    def forwardKinematic(self, theta):

        tri = np.tril(np.ones((self.nJoints,self.nJoints)), 0)

        jointSum = np.matmul(tri, theta)
        x = np.matmul(tri, np.cos(jointSum)*self.jointLength)
        y = np.matmul(tri, np.sin(jointSum)*self.jointLength)

        return np.stack((x,y,jointSum)).T


    def pathPlanning(self, xtarget, dt=3, nsteps=50):
        
        thetaTarget = self.thetaMin + (self.thetaMax-self.thetaMin) * self.ikModel.predict(xtarget)

        tt = thetaTarget
        t0 = np.expand_dims(self.thetaCurrent,0)

        # Cubic trajectory planing
        a0 = t0
        a1 = 0.0
        a2 = 3.0/dt**2*(tt-t0)
        a3 = -2.0/dt**3*(tt-t0)

        t = np.expand_dims(dt*np.linspace(0,1,nsteps),-1)

        tp = a0 + a1*t + a2*t**2 + a3*t**3


        xtrans = [self.forwardKinematic(t) for t in tp]


        # for x in xtrans:
        #     plt.plot([0,x[0,0]],[0,x[0,1]],'ko--')
        #     plt.plot(x[:,0],x[:,1],'ko--')

        # plt.plot(xtarget[0,0], xtarget[0,1],'rs')
        # plt.plot(self.xcurrent[-1,0], self.xcurrent[-1,1],'go')

        # plt.axis("equal")
        # plt.grid(True)
        # plt.show()


        return xtrans, tp

    def animate(self, xtrans):

        # set up figure and animation
        fig = plt.figure()
        ax = fig.add_subplot(111, aspect='equal', autoscale_on=False,
                            xlim=(-2, 2), ylim=(-2, 2))
        ax.grid()

        line, = ax.plot([], [], 'ko--', lw=2)

        def init():
            """initialize animation"""
            print("Initialized")
            line.set_data([], [])
            return line,

        def animate(i):
            """perform animation step"""    
            print(i)
            if i >= len(xtrans):
                line.set_data( 
                    np.concatenate([[0.0],xtrans[-1][:,0]]),
                    np.concatenate([[0.0],xtrans[-1][:,1]])
                )
            else:
                line.set_data( 
                    np.concatenate([[0.0],xtrans[i][:,0]]),
                    np.concatenate([[0.0],xtrans[i][:,1]])
                )
            return line,

        # choose the interval based on dt and the time to animate one step
        interval = len(xtrans)

        ani = animation.FuncAnimation(fig, animate, frames=len(xtrans),
                                    interval=interval, blit=True, init_func=init)

        ani.save('./animation.gif', writer='imagemagick', fps=60)
        plt.show()

if __name__ == "__main__":


    m = Manipulator(
        jointLength=[0.5,0.6,0.3], 
        theta=[np.deg2rad(40.0), np.deg2rad(-30.0), np.deg2rad(10.0)],
        thetaMin = [0, -np.pi, -np.pi/2],
        thetaMax = [np.pi, 0,  np.pi/2]
    )

    # Assign DL model
    model = buildModel(m.nJoints)
    model.load_weights("robot.h5")
    m.ikModel = model

    xt1 =  np.asarray([[0.0,0.8,0.0]])
    xt2 =  np.asarray([[0.8,0.0,0.0]])
    xt3 =  np.asarray([[0.5,0.6,np.pi/2]])
    xt4 =  np.asarray([[-0.8,0.5,np.deg2rad(30)]])

    xtransAll = []

    for xt in [xt1, xt2, xt3, xt4, xt1, xt3]:
        xtrans, thetaTrans = m.pathPlanning(xt)
        m.xcurrent = xtrans[-1]
        m.thetaCurrent = thetaTrans[-1]

        xtransAll.extend(xtrans)



    m.animate(xtransAll)



