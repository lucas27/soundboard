from pytubefix import YouTube
from pathlib import Path
from pytubefix.cli import on_progress
import os, emoji

class Downloader: 
    def __init__(self):
        pass

    def downloaderAudioFile(self, url, relativePath):
        
        SOUND_PATH = str(relativePath / Path('sounds'))
        # # # Obter o objeto YouTube
        yt = YouTube(url, on_progress_callback=on_progress)
        
        FILE_NAME = self.removerEmoji(yt.title)

        # # # Escolher a stream (qualidade do vídeo)
        stream = yt.streams.get_audio_only()

        # stream = yt.streams.get_by_itag(248)
        
        # # # Fazer o download
        downloadVideo = stream.download(SOUND_PATH, filename= f'{FILE_NAME}.m4a')

        return FILE_NAME, downloadVideo
   
    def timeVideoBlock(self, url):
            time = YouTube(url).length
    
            if time >= 120:
                return "denied file"
            else:
                return "released file"
            
    def removerEmoji(self, texto):
        return emoji.replace_emoji(texto, replace='').replace('"', '')