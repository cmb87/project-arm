from distutils.core import setup
from setuptools import find_packages

package_name = 'imagepubsub'

setup(
    name=package_name,
    version='0.0.0',
    packages=find_packages(),
    data_files=[
        ('share/ament_index/resource_index/packages',
            ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    maintainer='root',
    maintainer_email='christian.peeren@fraunhofer.iais.de',
    description='Minimalistic example for an image pubsub with openCV bridge',
    license='TODO: License declaration',
    tests_require=['pytest'],
    package_data={pkg: ['*'] for pkg in find_packages()},
    entry_points={
        'console_scripts': [
            'pub = imagepubsub.pub:main',
            'sub = imagepubsub.sub:main',
            'socketiobridge = imagepubsub.socketiobridge:main',
            'camera = imagepubsub.camera:main',
        ],
    },
)
