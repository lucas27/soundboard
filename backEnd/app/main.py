from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from jsonCreatorFile.createJson import CreateJsonFile
from downloaderFileAudio.downloaderAudio import Downloader
from pathlib import Path
from time import sleep
from createZipFiles.fileZip import Zip
import os

app = Flask(__name__)
CORS(app)


path = str(os.getcwd() / Path('backEnd/app/storage'))

jsonFile = CreateJsonFile(path)
audioFile = Downloader()

@app.route('/download', methods=['POST'])
def Data():
    data = request.get_json()        
    
    response = audioFile.timeVideoBlock(data['url'])
    
    if(response == 'released file'):
        title, relativePath = audioFile.downloaderAudioFile(data['url'], path)
        jsonFile.dataFile(data['url'], title, relativePath)
    
        loadedFile = jsonFile.readJson()
        return jsonify(loadedFile)
    else:
        return 'denied file'

@app.route('/aFile', methods=['GET'])
def aFile():
    loadedFile = jsonFile.readJson()
    
    i = len(loadedFile)

    return send_file(loadedFile[i-1]['path'], mimetype='audio/m4a')

@app.route('/send', methods=['GET'])
def sendData():
    
    loadedFile = jsonFile.readJson()
    return jsonify(loadedFile)


@app.route('/sounds', methods=['GET'])
def sounds():
    
    zipFile = Zip()
    ZipForBytes = zipFile.zipAudio()
        
    return send_file(ZipForBytes, as_attachment=True, mimetype='application/zip')


# # if __name__ == '__main__':
#     app.run(debug=True, port=3000)

        
    




