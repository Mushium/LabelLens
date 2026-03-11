import tensorflow as tf
from keras import layers, models, utils, optimizers
import numpy as np
import os
import csv
import sqlite3
import random
import string
from colorama import Back,init
import uuid
import secrets
from datetime import datetime,timedelta
init(autoreset=True)

class Easy_User:
    def __init__(self):
        pass

    @staticmethod
    def Create(name, password):
        conn = sqlite3.connect('userData.db')
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS userData(name,password,id)")
        generated_id = uuid.uuid4().hex
        cursor.execute("INSERT INTO userData (name, password, id) VALUES (?, ?, ?)", (name, password,generated_id))
        conn.commit()
        conn.close()


    @staticmethod
    def Login(name, password):
        conn = sqlite3.connect('userData.db')
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS userData(name,password,id)")
        cursor.execute("SELECT * FROM userData WHERE name = ? AND password = ?", (name, password))
        result = cursor.fetchone()
        conn.close()
        if result == None:
            return False

        id = result[2]
        exp_date = datetime.now() + timedelta(minutes=30)
        key = secrets.token_urlsafe(32)
        conn = sqlite3.connect('keyData.db')
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS keyData(authKey,id,expiry)")
        cursor.execute('INSERT INTO keyData (authKey, id,expiry) VALUES (?,?,?)',(key,id,exp_date))
        conn.commit()
        conn.close()
        return key


    @staticmethod
    def CheckUser(name,password):
        conn = sqlite3.connect('userData.db')
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS userData(name,password,id)")
        cursor.execute("SELECT * FROM userData WHERE name = ?", (name,))
        result = cursor.fetchone()
        conn.close()
        if(result is not None):
            return True
        else:
            return False
        

    @staticmethod
    def CheckKey(value):
        if(value is None): return False

        conn = sqlite3.connect('keyData.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM keyData WHERE authKey = ?", (value,))
        result = cursor.fetchone()
        conn.close()
        if result is None:
            return False

        exp_date = datetime.strptime(result[2], "%Y-%m-%d %H:%M:%S.%f")
        if exp_date < datetime.now():
            Easy_User.RemoveKey(value)
            return False
        return result is not None
    


    @staticmethod
    def GetID(value):
        if(value is None): return False

        conn = sqlite3.connect('keyData.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM keyData WHERE authKey = ?", (value,))
        result = cursor.fetchone()
        conn.close()
        if result is not None:
            return result[1]
        else:
            return False

    @staticmethod
    def RemoveKey(key):
        if(key is None): return False

        conn = sqlite3.connect('keyData.db')
        cursor = conn.cursor()
        cursor.execute("DELETE FROM keyData WHERE authKey = ?", (key,))
        conn.commit()
        conn.close()
        return True

        



    