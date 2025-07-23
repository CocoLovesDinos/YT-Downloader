import yt_dlp
import os
import sys

download_path = os.path.join('.', 'downloads')

def download_audio(youtube_url, codec):
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': codec,
            'preferredquality': '192',
        }],
        'outtmpl': os.path.join(download_path, '%(title)s.%(ext)s'),
        'quiet': False,
        'progress_hooks': [lambda d: print(d)]
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])



def download_video(youtube_url, codec):
    ydl_opts = {
        'format': 'bestvideo+bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegVideoConvertor',
            'preferedformat': codec,
        }],
        'outtmpl': os.path.join(download_path, '%(title)s.%(ext)s'),
        'quiet': False,
        'progress_hooks': [lambda d: print(d)]
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([youtube_url])


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python Downloader.py <YouTube_URL> <codec>")
        sys.exit(1)

    url = sys.argv[1]
    codecIn = sys.argv[2]

    audio = ['mp3', 'wav', 'aac', 'flac', 'm4a', 'opus', 'vorbis']
    video = ['mp4', 'avi', 'mkv', 'flv', 'webm']

    if codecIn in audio:
        download_audio(url, codecIn)
    elif codecIn in video:
        download_video(url, codecIn)
    else:
        print("Invalid codec. Please enter a valid audio or video codec.\nAvailable audio codecs: " + str(audio) + "\nAvailable video codecs: " + str(video))
        sys.exit(1)