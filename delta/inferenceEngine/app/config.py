import os
import logging

_loggingLevels = {
    "INFO": logging.INFO, "DEBUG": logging.DEBUG,
    "CRITICAL": logging.CRITICAL, "ERROR": logging.ERROR,
}

server = {
    "logginglevel": _loggingLevels[os.getenv('LOGGING', 'CRITICAL').upper()],
    "hostname": os.getenv('ENV_SOCKETIOSERVER', 'localhost'),
    "port": int(os.getenv('ENV_SOCKETIOPORT', 5001)),
}