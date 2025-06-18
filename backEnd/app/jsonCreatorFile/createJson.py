from pathlib import Path
import json, emoji


class CreateJsonFile:
    def __init__(self, path):
        self.path = Path(path, 'data/information_videos.json')

    def readJson(self):
        with open(self.path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            
            if isinstance(data, list):
                return data
            else:
                return []
    
    def writeJson(self, data):
        with open(self.path, 'w', encoding="utf-8") as file:
            json.dump(data, file, indent=4)     

    def dataFile(self, url, title, relativePathFile):
        JSON_FILE_PATH = self.path

        if '=' in url:
            id = url.split('=')[1]
        elif '/shorts/' in url:
            id = url.split('shorts/')[1]

       
        
        jsonFile = {
            "title": title,
            "path": relativePathFile,
            'url': url,
            'video_Id': id 
        }
        
        if JSON_FILE_PATH.exists():
            data_exist = self.readJson()
            
            if jsonFile['url'] in [unpack['url'] for unpack in data_exist]:
                pass
            else:
                data_exist.append(jsonFile)     
                self.writeJson(data_exist)
        else:
            self.writeJson(jsonFile)

    
  