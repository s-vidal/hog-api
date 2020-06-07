import base64
import os
from cryptography.fernet import Fernet


class BaseDBLayer:
    # generates a random a base64 key
    __key = b'pRmgMa8T0INjEAfksaq2aafzoZXEuwKI7wDe4c1F8AY='

    def __init__(self):
        # __cipher_suite is provided by the library use key to encrypt
        self.__cipher_suite = Fernet(self.__key)

    def encrypt(self, password):
        # library required to convert to bytes
        password_bytes = bytes(password, "ascii")
        ciphered_password = self.__cipher_suite.encrypt(password_bytes)  # required to be bytes
        # return it as a string to save it in db
        return ciphered_password.decode("utf-8")

    def decrypt(self, encryptedpwd):
        password_bytes = bytes(encryptedpwd, "ascii")
        uncipher_text = (self.__cipher_suite.decrypt(password_bytes))
        password_str = bytes(uncipher_text).decode("utf-8")  # convert to string
        return password_str

