from zipfile import ZipFile, ZIP_DEFLATED
# from io import BytesIO
import os

CURRENT_PATH = os.getcwd()
ABSOLUTE_PATH = os.path.join(CURRENT_PATH, 'backEnd\\app\\storage\\sounds')

class Zip:
    def __init__(self):
        pass

    def zipAudio(self):
        
        with ZipFile(f'{ABSOLUTE_PATH}\\sounds.zip', 'a', ZIP_DEFLATED) as zip_file:
            for folder, subfolder, filenames in os.walk(ABSOLUTE_PATH):
                for filename in filenames:
                    if(filename == 'sounds.zip'):
                        pass

                    else:
                        filepath = os.path.join(folder, filename)
                        zip_file.write(filepath, os.path.basename(filepath))
                        self.removeFile(filename)  
        
        return os.path.join(ABSOLUTE_PATH, 'sounds.zip')

    def removeFile(self,files):
        os.remove(os.path.join(ABSOLUTE_PATH, files))

