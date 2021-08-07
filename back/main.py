from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import  json
from typing import List
import shutil
import zipfile



app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Dataset(BaseModel):
    name: str
    id: str
    kind: str
    problem: str
    count: dict = {"Original":0, "train":0, "test":0, "valid":0}


@app.get("/")
async def root():
    return {"message": "World"}

@app.post("/api/upload/images/")
async def upload_image( datasetName: str, images: List[UploadFile] = File(...)):
    print(images, datasetName)
    dirpath = "./datasets/"+datasetName+"/data/"
    for image in images:
        with open("./datasets/temp/"+datasetName+".zip", "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        

@app.post("/api/dataset")
async def create_dataset(dataset: Dataset):
    print(dataset)
    root_path = "./datasets/" + dataset.name + "/"
    data_path = root_path + "data/"

    if not os.path.exists(root_path):
        os.makedirs(root_path)
        os.mkdir(data_path)
        os.mkdir(data_path+"train/")
        os.mkdir(data_path+"valid/")
        os.mkdir(data_path+"test/")
        os.mkdir(data_path+"original/")
        properties = {}
        properties["name"] = dataset.name
        properties["id"] = dataset.id
        properties["kind"] = dataset.kind
        properties["data_path"] = data_path
        properties["problem"] = dataset.problem  
        properties["count"] = dataset.count      
        with open(root_path + "properties.json", "w") as f:
            json.dump(properties, f)
    if os.path.exists("./datasets/temp/"+dataset.name+".zip"):
        with zipfile.ZipFile("./datasets/temp/"+dataset.name+".zip", 'r') as zip_ref:
            zip_ref.extractall(data_path+"/original/")
    #delte mac metadata -- not needed
    if os.path.exists(data_path+"/original/__MACOSX"):
        shutil.rmtree(data_path+"/original/__MACOSX")

@app.get("/api/allDatasets")
async def get_all_datasets():
    datasets = []
    for dataset in os.listdir("./datasets/"):
        if dataset == "temp":
            continue
        if os.path.isdir("./datasets/"+dataset):
            with open("./datasets/"+dataset+"/properties.json", "r") as f:
                properties = json.load(f)
                datasets.append(properties)
    return datasets