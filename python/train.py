import sys, os
import numpy as np
import matplotlib.pyplot as plt
import random
from matplotlib import pyplot as plt
from matplotlib import animation
import tensorflow as tf
from keras.layers import Input, Conv2DTranspose, BatchNormalization, ReLU, Conv2D, Lambda, MaxPooling2D, Dropout, Add, Dense

# Numpy
jointLength = np.asarray([0.5,0.6,0.3])
jointStates = np.asarray([np.deg2rad(40.0), np.deg2rad(-30.0), np.deg2rad(10.0)])
nJoints = jointLength.shape[0]

PI = 3.14159
thetaMin = tf.constant([0, -PI, -PI/2], dtype=tf.float32)
thetaMax = tf.constant([PI, 0,  PI/2], dtype=tf.float32)


class NormalizationLayer(tf.keras.Model):
    def __init__(self, **kwargs):
        super(NormalizationLayer, self).__init__(**kwargs)

    def get_config(self):
        return {}
    #
    def call(self, x, training=False):
        """

        :type training: object
        """
        norm = tf.constant([1.4, 1.4, PI], dtype=tf.float32)

        return (x )/norm






def createRandomAngle(i):
    theta = thetaMin + (thetaMax-thetaMin)*tf.random.uniform(shape=[nJoints], minval=0, maxval=1, dtype=tf.dtypes.float32, seed=None)
    return theta


def fowardKinematics(jointStates, jointLength, squeezeBatchDim=True, expand=True):

    nJoints = jointLength.shape[0]
    jointLength = tf.expand_dims(tf.constant(jointLength, dtype=tf.float32),0)  # [1,J]

    if expand:
        jointStates = tf.expand_dims(jointStates,0)  # [1,J]

    #tf.linalg.band_part(input, 0, -1) ==> Upper triangular part.
    #tf.linalg.band_part(input, -1, 0) ==> Lower triangular part.
    #tf.linalg.band_part(input, 0, 0) ==> Diagonal.

    tri = tf.expand_dims(tf.linalg.band_part(tf.ones((nJoints, nJoints)), -1, 0),0)               # [1,J,J]

    jointSum = tf.matmul(tri, tf.expand_dims(jointStates,-1)) # [1,J,1]
    x = tf.matmul(tri, tf.math.cos(jointSum)*tf.expand_dims(jointLength,-1)) # [1,J,1]
    y = tf.matmul(tri, tf.math.sin(jointSum)*tf.expand_dims(jointLength,-1)) # [1,J,1]

    if squeezeBatchDim:
        return tf.squeeze(tf.concat([x,y,jointSum], axis=2),0)

    return tf.concat([x,y,jointSum], axis=2)


def onlyEndeffector(x, theta):
    return x[-1,:], x[-1,:] #, theta/3.14159


def buildModel(nJoints):
    # Le model
    i = Input(shape=(3)) # Input 3 endeffector coord [xe,ye,theta]
    x = NormalizationLayer()(i)
    x = Dense(120, activation="relu")(x)

  #  x = Dropout(0.1)(x)
    y = Dense(nJoints, activation="tanh")(x)

    model = tf.keras.Model(inputs=i, outputs=y)

    print(model.summary())
    return model


def kinematicLoss(xeTrue, thetaPred, jointLength=jointLength):
    theta =  thetaMin + (thetaMax-thetaMin)*thetaPred

    xPred = fowardKinematics(theta, jointLength, squeezeBatchDim=False, expand=False)
    xePred = xPred[:,-1,:] # only Endeffector

    loss = tf.reduce_mean(tf.math.square(xePred[:,:]-xeTrue[:,:]))

    #loss2 = tf.reduce_mean(tf.math.square(tf.reduce_sum(thetaPred, axis=1) - xeTrue[:,-1]))


    return loss #+ loss2

if __name__ == "__main__":

    ds = tf.data.Dataset.range(10000)
    ds = ds.map(createRandomAngle)
    ds = ds.shuffle(10000)
    ds = ds.map(lambda theta: (fowardKinematics(theta, jointLength), theta))
    ds = ds.map(lambda x,theta: onlyEndeffector(x,theta))
    ds = ds.batch(32)

    dsVal = tf.data.Dataset.range(100)
    dsVal = dsVal.map(createRandomAngle)
    dsVal = dsVal.shuffle(100)
    dsVal = dsVal.map(lambda theta: (fowardKinematics(theta, jointLength), theta))
    dsVal = dsVal.map(lambda x,theta: onlyEndeffector(x,theta))
    dsVal = dsVal.batch(32)


    model = buildModel(nJoints)

    for (x,y) in ds.take(120):
        plt.plot(x[:,0], x[:,1], 'ro', markersize=4)

        [plt.plot(x[b,0], x[b,1], 'k', marker=(1, 1, np.rad2deg(x[b,2])), markersize=8, mew=2) for b in range(x.shape[0])]

    plt.axis("equal")
    plt.grid(True)
    plt.show()
        




    # compile the keras model
    opti = tf.keras.optimizers.Adam(1e-3)

    model.compile(loss=kinematicLoss, optimizer=opti, metrics=['mae'])
   # model.compile(loss='mse', optimizer=opti, metrics=['mae'])


    estcb = tf.keras.callbacks.EarlyStopping(
        monitor='val_loss', min_delta=0, patience=16, verbose=0,
        mode='auto', baseline=None, restore_best_weights=True
    )

    model.fit(
        ds, epochs=50,
        callbacks = [estcb],
        validation_data=dsVal,
        #steps_per_epoch=NTRAIN//batchSize,
        #validation_steps=NTEST//batchSize,
    )

    model.save_weights("robot.h5")







    # x2 = simulation2(jointLength, jointStates)

    # x,y,theta = simulation1(jointLength, jointStates)

    # plt.plot([0,x[0]],[0,y[0]],'bo-')
    # plt.plot(x,y,'bo-')


    # plt.plot([0,x2[0,0,0]],[0,x2[0,0,1]],'go--')
    # plt.plot(x2[0,:,0],x2[0,:,1],'go--')

    # plt.axis("equal")
    # plt.show()