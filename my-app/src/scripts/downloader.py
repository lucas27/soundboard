from pytubefix import YouTube, Buffer
from sys import stdin, stdout, stderr
import io
import time
import json
# url = 'https://www.youtube.com/watch?v=fQ7GMBIDric'

buffer = Buffer()

def getInfo(yt, mimetype):
    info = {
        '"title"': f'"{yt.title}"',
        '"url"': f'"{yt.watch_url}"',  
        '"thumbnail"': f'"{yt.thumbnail_url}"',
        '"mimetype"': f'"{mimetype}"'
    }
    return info

def redirectBuffer(streamToBuffer):
    buffer.download_in_buffer(streamToBuffer)
    fileBuffer = buffer.read()

    stdout.buffer.write(fileBuffer)
    buffer.clear()

url = stdin.readline()
yt = YouTube(url)


stream = yt.streams.get_audio_only()



redirectBuffer(stream)
file = getInfo(yt, stream.mime_type)

stderr.write(str(file))
