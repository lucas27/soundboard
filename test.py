# import sqlite3

# file_name = 'BARA BARA BERE BERE  BASS BOOSTED  MEME  EL PRIMO  GREEN SCREEN  FREE DOWNLOAD  NEW  2023.m4a'

# # with open(file_name, 'br') as file :
# #     blob = file.read() 

# with sqlite3.connect('meu_aplicativo.db') as conn:
#     cursor = conn.cursor()
#     cursor.execute('''
#         CREATE TABLE IF NOT EXISTS usuarios (
#             id INTEGER PRIMARY KEY,
#             nome TEXT NOT NULL,
#             file BLOB 
#         )
#     ''')
#     print("Tabela 'usuarios' verificada/criada.")
#     # cursor.execute("INSERT INTO usuarios (nome, file) VALUES (?, ?)", (file_name, blob))
#     # conn.commit()


#     cursor.execute("SELECT id,nome, file FROM usuarios")
#     nome = cursor.fetchone()
    
#     with open('new_file.m4a', 'wb') as file:
#         file.write(nome[2])

from pathlib import Path
import os


c = Path(os.getcwd() ,'backEnd/app/storage/sounds/sounds.zip')

with open(c, 'r') as file:
    for r in file:
        print(r)