from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import  json
from typing import List
import shutil
import zipfile
import re
import distutils.dir_util as dir_util


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

@app.get("/api/dataset/")
async def get_dataset(dataset_id: str):
    datasets = []
    for dataset in os.listdir("./datasets/"):
        if dataset == "temp":
            continue
        if os.path.isdir("./datasets/"+dataset):
            with open("./datasets/"+dataset+"/properties.json", "r") as f:
                properties = json.load(f)
                if properties["id"] == dataset_id:
                    return (properties)
    return { "message": "dataset not found" }

@app.get("/api/dataset/fetchExample")
async def get_dataset_example(file:str):
    return FileResponse(file)

@app.get("/api/dataset/listdirectory")
async def get_dataset_list_directory(dataset_id: str, directory: str):
    dataset = await get_dataset(dataset_id)
    data_path = dataset["data_path"]
    files = os.listdir(data_path+directory)
    for i, file in enumerate(files):
        files[i] = os.path.join(data_path+directory, file)
    return files

@app.post("/api/dataset/moveExample")
async def get_dataset_example(dataset_id: str, file: str, label: str):
    ds = await get_dataset(dataset_id)
    filestr = re.match(file, "([^\/]+$)").group(0)
    data_path = ds["data_path"]

    shutil.copyfile(file, data_path+"train/"+label+"/"+filestr)
    

@app.post("/api/dataset/moveIncorrectExample")
async def get_dataset_example(dataset_id: str, file: str, src: str, dest: str):
    ds = get_dataset(dataset_id)
    if len(ds) == 0:
        return {"message": "No dataset found"}
    dataset = ds[0]
    data_path = dataset["data_path"]
    if src == "train":
        shutil.move(data_path+"train/"+file, data_path+dest+"/"+file)
        return {"message": "Moved to {dest}"}
    elif src == "valid":
        shutil.move(data_path+"valid/"+file, data_path+dest+"/"+file)
        return {"message": "Moved to {dest}"}
    elif src == "test":
        shutil.move(data_path+"test/"+file, data_path+dest+"/"+file)
        return {"message": "Moved to {dest}"}
    else:
        return {"message": "Invalid type"}

@app.post("/api/dataset/label/add")
async def add_dataset_labels(dataset_id: str, label:str):
    ds = await get_dataset(dataset_id)
    if "label" in ds.keys():
        ds["label"].append(label)
    else:
        ds["label"] = [label]
    with open("./datasets/"+ds["name"]+"/properties.json", "w") as f:
        json.dump(ds, f)
    for label in ds["label"]:
        if not os.path.exists("./datasets/"+ds["name"]+"/train/"+label):
            os.makedirs("./datasets/"+ds["name"]+"/train/"+label)
            os.makedirs("./datasets/"+ds["name"]+"/valid/"+label)
            os.makedirs("./datasets/"+ds["name"]+"/test/"+label)
    return {"message": "Label added"}

@app.post("/api/dataset/label/delete")
async def delete_dataset_labels(dataset_id: str, label:str):
    ds = await get_dataset(dataset_id)
    if "label" in ds.keys():
        ds["label"].remove(label)
    else:
        return {"message": "No labels found"}
    with open("./datasets/"+ds["name"]+"/properties.json", "w") as f:
        json.dump(ds, f)
    
    if os.path.exists("./datasets/"+ds["name"]+"/train/"+label):
        dir_util.copy_tree("./datasets/"+ds["name"]+"/train/"+label, "./datasets/"+ds["name"]+"/original/")
        shutil.rmtree("./datasets/"+ds["name"]+"/train/"+label)
    if os.path.exists("./datasets/"+ds["name"]+"/valid/"+label):
        dir_util.copy_tree("./datasets/"+ds["name"]+"/valid/"+label, "./datasets/"+ds["name"]+"/original/")
        shutil.rmtree("./datasets/"+ds["name"]+"/valid/"+label)
    if os.path.exists("./datasets/"+ds["name"]+"/test/"+label):
        dir_util.copy_tree("./datasets/"+ds["name"]+"/test/"+label, "./datasets/"+ds["name"]+"/original/")
        shutil.rmtree("./datasets/"+ds["name"]+"/test/"+label)
        
    return {"message": "Label deleted"}

@app.post("/api/dataset/label/rename")
async def rename_dataset_labels(dataset_id: str, old_label:str, new_label:str):
    ds = await get_dataset(dataset_id)
    if "label" in ds.keys():
        for i, label in enumerate(ds["label"]):
            if label == old_label:
                ds["label"][i] = new_label
    else:
        return {"message": "No labels found"}
    with open("./datasets/"+ds["name"]+"/properties.json", "w") as f:
        json.dump(ds, f)
    if os.path.exists("./datasets/"+ds["name"]+"/train/"+old_label):
        os.rename("./datasets/"+ds["name"]+"/train/"+old_label, "./datasets/"+ds["name"]+"/train/"+new_label)
    if os.path.exists("./datasets/"+ds["name"]+"/valid/"+old_label):
        os.rename("./datasets/"+ds["name"]+"/valid/"+old_label, "./datasets/"+ds["name"]+"/valid/"+new_label)
    if os.path.exists("./datasets/"+ds["name"]+"/test/"+old_label):
        os.rename("./datasets/"+ds["name"]+"/test/"+old_label, "./datasets/"+ds["name"]+"/test/"+new_label)
    return {"message": "Label renamed"}

@app.get ("/api/label/all")
async def get_all_labels(dataset_id: str):
    ds = get_dataset(dataset_id)
    if "label" in ds.keys():
        return ds["label"]
    else:
        return {"message": "No labels found"}
    
    
@app.get("/api/dataset/export")
async def export_dataset(dataset_id: str):
    ds = get_dataset(dataset_id)
    if len(ds) == 0:
        return {"message": "No dataset found"}
    dataset = ds[0]
    data_path = dataset["data_path"]
    dir_list = ["./datasets/"+dataset["name"]+"/train/", "./datasets/"+dataset["name"]+"/valid/", "./datasets/"+dataset["name"]+"/test/"]
    zipf = zipfile.ZipFile(data_path+"export.zip", 'w', zipfile.ZIP_DEFLATED)
    for dir in dir_list:
        zipdir(dir, zipf)
    zipf.close()

#helper function for export
def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file),
                       os.path.relpath(os.path.join(root, file),
                                       os.path.join(path, '..')))

@app.post("/api/dataset/counter/add/")
async def add_dataset_counter(dataset_id: str, counterName:str):
    ds = await get_dataset(dataset_id)
    if counterName in ds["counter"].keys():
        ds["counter"][counterName] += 1
    else:
        ds["counter"] = {counterName: 1}
    with open("./datasets/"+ds["name"]+"/properties.json", "w") as f:
        json.dump(ds, f)
    return {"message": "Counter added"}

@app.post("/api/dataset/counter/subtract/")
async def subtract_dataset_counter(dataset_id: str, counterName:str):
    ds = await get_dataset(dataset_id)
    if counterName in ds["counter"].keys():
        ds["counter"][counterName] -= 1
    else:
        return {"message": "No counter found"}
    with open("./datasets/"+ds["name"]+"/properties.json", "w") as f:
        json.dump(ds, f)
    return {"message": "Counter subtracted"}

@app.post("/api/dataset/counter/delete/")
async def delete_dataset_counter(dataset_id: str, counterName:str):
    ds = await  get_dataset(dataset_id)
    if "counter" in ds.keys():
        ds["counter"].pop(counterName)
    else:
        return {"message": "No counter found"}
    with open("./datasets/"+ds["name"]+"/properties.json", "w") as f:
        json.dump(ds, f)
    return {"message": "Counter deleted"}

