from flask import Flask, jsonify,request
from flask_cors import CORS
import os
from easy_model import *
from easy_user import *
from PIL import Image
import json
import sqlite3
from colorama import Back,init
from google.cloud import storage
import uuid
import mimetypes
from datetime import timedelta
import shutil
from tempfile import NamedTemporaryFile,TemporaryDirectory

storage_client = storage.Client.from_service_account_json("storage_key.json")
bucket = storage_client.get_bucket("test-bucket-qew")
init(autoreset=True)
app = Flask(__name__)
CORS(app,supports_credentials=True) # Becuase React is not the same domain as flask, this enable react to send requests to flask. Make sure of this later


conn = sqlite3.connect('keyData.db')
cursor = conn.cursor()
cursor.execute("DELETE FROM keyData")
conn.commit()
conn.close()

@app.route('/')
def index():
    return "Started"


def is_auth(func):
    def wrapper():
        key = request.headers.get("authkey")
        isKey = Easy_User.CheckKey(key)
    
        if(isKey == False): 
            return {"Message": "Token is not authenticated"},401
        else:
            return func()

    wrapper.__name__ = func.__name__
    return wrapper





def verify_input(*args):
    for i in args:
        if "/" in i or "\\" in i:
            return False
    
    return True

@app.route('/auth')
@is_auth
def auth():
    return {},200
        



# -------------- Models ------------------
@app.route('/models',methods=['GET'])
@is_auth
def get_models(): 
    user_models = {}
    key = request.headers.get("authkey")
    user_id = Easy_User.GetID(key)

    sub = bucket.list_blobs(prefix=f"{user_id}/",delimiter="/")
    list(sub)
    for i in sub.prefixes:
        model = i.rstrip("/").split("/")[-1]
        cls = bucket.list_blobs(prefix=f"{user_id}/{model}/",delimiter="/")
        list(cls)
        print(cls.prefixes)
        num = len(cls.prefixes)
        user_models.update({model:num})


    return user_models,200 # 200 means success >= 400 means error


@app.route('/models',methods=['POST'])
@is_auth
def add_models():
    model_name = request.headers.get("name")
    key = request.headers.get("authkey")
    user_id = Easy_User.GetID(key)  

    if not verify_input(model_name):
        return {"Result": False}
          
        
    blob = bucket.blob(f"{user_id}/{model_name}/")
    if(blob.exists()):
        return {"Result": False}

    blob.upload_from_string("")
    return {"Result": True}



@app.route('/models',methods=['DELETE'])
@is_auth
def remove_models():
    model_name = request.headers.get("name")    
    key = request.headers.get("authkey")
    user_id = Easy_User.GetID(key)  

    if not verify_input(model_name):
        return {"Result": False}          
        
    blob = list(bucket.list_blobs(prefix=f"{user_id}/{model_name}/"))
    if not blob:
        return {"Result": False}

    bucket.delete_blobs(blob)
    return {"Result": True}




# -------------- Classes ------------------
@app.route('/classes',methods=['GET'])
@is_auth
def get_classes():
    user_classes = {}
    model_name = request.headers.get("model")
    key = request.headers.get("authkey")
    user_id = Easy_User.GetID(key)

    if not verify_input(model_name):
        return {"Result": False}


    sub = bucket.list_blobs(prefix=f"{user_id}/{model_name}/",delimiter="/")
    list(sub)
    for i in sub.prefixes:
        cls = i.rstrip("/").split("/")[-1]
        allowed = (".png", ".jpg", ".jpeg")
        num = sum(
            1 for b in bucket.list_blobs(prefix=f"{user_id}/{model_name}/{cls}/")
            if b.name.lower().endswith(allowed)
        )
        user_classes.update({cls:num})


    return user_classes,200 # 200 means success >= 400 means error
    

    
@app.route('/classes',methods=['POST'])
@is_auth
def add_classes():
    model_name = request.headers.get("model")
    key = request.headers.get("authkey")
    class_name = request.headers.get("className")
    user_id = Easy_User.GetID(key)      

    if not verify_input(model_name,class_name):
        return {"Result": False}      

    print(Back.YELLOW + model_name)
    print(Back.YELLOW + user_id)
    print(Back.YELLOW + class_name)



    if "/" in model_name:
        return {"Result": False}
    
        
    blob = bucket.blob(f"{user_id}/{model_name}/{class_name}/")
    if(blob.exists()):
        return {"Result": False}

    blob.upload_from_string("")
    return {"Result": True}



@app.route('/classes',methods=['DELETE'])
@is_auth
def remove_classes():
    model_name = request.headers.get("model")
    key = request.headers.get("authkey")
    class_name = request.headers.get("className")
    user_id = Easy_User.GetID(key)      

    if not verify_input(model_name,class_name):
        return {"Result": False}

        
    blob = list(bucket.list_blobs(prefix=f"{user_id}/{model_name}/{class_name}/"))
    if not blob:
        return {"Result": False}

    bucket.delete_blobs(blob)
    return {"Result": True}



# -------------- Others ------------------
@app.route('/signed-upload-url',methods=['POST'])
@is_auth
def signed_upload_url():

    model_name = request.json.get("model")
    key = request.headers.get("authkey")
    class_name = request.json.get("className")
    content_type = request.json.get("contentType")
    extension = mimetypes.guess_extension(content_type)

    if not verify_input(model_name,class_name):
        return {"Result": False}

    if extension == ".jpe":
        extension = ".jpg"

    if not extension:
        if content_type == "image/jpeg":
            extension = ".jpg"
        elif content_type == "image/png":
            extension = ".png"
        else:
            return {"Result": False}, 400

    print(Back.YELLOW + model_name)
    print(Back.YELLOW + class_name)
    print(Back.YELLOW + extension)

    if not content_type or not content_type.startswith("image/"):
        return {"Result": False}

    user_id = Easy_User.GetID(key)  
    print(Back.YELLOW + user_id)
    filename = uuid.uuid4().hex + extension

    object_name = f"{user_id}/{model_name}/{class_name}/{filename}"
    blob = bucket.blob(object_name)

    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(minutes=10),
        method="PUT",
        content_type=content_type,
    )

    # return both url and where it will end up
    return {
        "signed_url": url,
        "object_name": object_name
    }, 200
    


@app.route('/generate',methods=['POST'])
@is_auth
def generate():
    key = request.headers.get("authkey")
    user_id = Easy_User.GetID(key)  
    model_name = request.headers.get("model")

    if not verify_input(model_name):
        return {"Result": False}
    
    with TemporaryDirectory() as temp:
        model_dir = os.path.join(temp, model_name)
        os.makedirs(model_dir,exist_ok=True)
        print(Back.YELLOW + model_name)
        blobs = bucket.list_blobs(prefix=f"{user_id}/{model_name}/",delimiter="/")
        list(blobs)
        for i in blobs.prefixes:
            cls = i.rstrip("/").split("/")[-1]
            f = bucket.list_blobs(prefix=f"{user_id}/{model_name}/{cls}/")
            os.makedirs(f"{model_dir}/{cls}",exist_ok=True)
            count = 0
            for im in f:
                if im.name.endswith("/"): # Becuase it might right the directory exactly the same
                    continue
                filename = os.path.basename(im.name)
                im.download_to_filename(f"{model_dir}/{cls}/{filename}")
                count+=1
            
            if count <=1:
                return { "Result": False}



        model = Easy_Model(model_dir,10,32,model_name,model_dir)
        blob = bucket.blob(f"{user_id}/{model_name}/{model_name}.keras")
        keras_path = os.path.join(model_dir, f"{model_name}.keras")
        blob.upload_from_filename(keras_path)


    return { "Result": True}






@app.route('/predict',methods=['POST'])
@is_auth
def predict():
    user_classes = []
    model_name = request.headers.get("model")
    key = request.headers.get("authkey")
    data = request.files['file']
    user_id = Easy_User.GetID(key)

    if not verify_input(model_name):
        return {"Result": False}
    
    with TemporaryDirectory() as temp:
        model_dir = os.path.join(temp, model_name)
        os.makedirs(model_dir,exist_ok=True)
        sub = bucket.list_blobs(prefix=f"{user_id}/{model_name}/",delimiter="/")
        list(sub)
        for i in sub.prefixes:
            cls = i.rstrip("/").split("/")[-1]
            user_classes.append(cls)


        img = Image.open(data).convert("RGB") # remove the Alpha
        name = uuid.uuid4().hex + ".jpg"
        print(Back.YELLOW + name)
        img.save(os.path.join(model_dir,name))

        mod = bucket.blob(f"{user_id}/{model_name}/{model_name}.keras")
        mod.download_to_filename(f"{model_dir}/{model_name}.keras")

        result = Easy_Model.Predict(f"{model_dir}/{model_name}.keras",f"{model_dir}/{name}",user_classes)

    
    return {"Result" : result}







# -------------- Users ------------------
@app.route('/user',methods=['POST'])
def add_user():
    # Sign In
    username = request.headers.get("username")
    password = request.headers.get("password")
    if(Easy_User.CheckUser(username,password) == False):
        Easy_User.Create(username,password)
        print(Back.GREEN + 'Success')
        return {'Result': True}
    else:
        print(Back.RED + 'Fail')
        return {'Result': False}


@app.route('/user',methods=['GET'])
def get_user():
    # Log In
    username = request.headers.get("username")
    password = request.headers.get("password")
    if(Easy_User.CheckUser(username,password) == True):
        key = Easy_User.Login(username,password)
        if key == False:
            print(Back.RED + 'Fail')
            return {'Result': False}

        print(Back.GREEN + 'Success')
        return {'Result': key}
    else:
        print(Back.RED + 'Fail')
        return {'Result': False}




@app.route('/key')
def remove_key():
    key = request.headers.get("authkey")
    Easy_User.RemoveKey(key)
    print(Back.GREEN + key)
    return {'Result': True}
    


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
