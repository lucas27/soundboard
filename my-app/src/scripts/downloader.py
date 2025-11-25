from pytubefix import YouTube, Buffer
from sys import stdin
from os import path
import json, tempfile
# url = 'https://www.youtube.com/watch?v=Om_VWBua0_M'

TEMP_PATH = tempfile.gettempdir()

def getInfo(yt, mimetype):
    info = {
        "title": yt.title,
        "url": yt.watch_url,  
        "thumbnail": yt.thumbnail_url,
        "mimetype": mimetype
    }
    return info

# def redirectBuffer(streamToBuffer):
#     buffer.download_in_buffer(streamToBuffer)
#     fileBuffer = buffer.read()

#     stdout.buffer.write(fileBuffer)
#     buffer.clear()

url = stdin.readline()
yt = YouTube(url)

try:
    stream = yt.streams.get_audio_only()
    
    file = getInfo(yt, stream.mime_type)
    
    # with open(path.join(TEMP_PATH, 'data', 'temp.json'), 'w', encoding='utf-8') as jsonFile:
    with open('./data/temp.json', 'w', encoding='utf-8') as jsonFile:
        json.dump(file, jsonFile, indent=4, ensure_ascii=False)

    # stream.download(path.join(TEMP_PATH, 'data'),'temp.mp4')
    stream.download('./data','temp.mp4')

except Exception :
    file = {
        "ERRO": f"{Exception}"
    }
    # with open(path.join(TEMP_PATH, 'data', 'temp.json'), 'w', encoding='utf-8') as jsonFile:
    with open('./data/temp.json', 'w', encoding='utf-8') as jsonFile:
        json.dump(file, jsonFile, indent=4, ensure_ascii=False)

# redirectBuffer(stream)



