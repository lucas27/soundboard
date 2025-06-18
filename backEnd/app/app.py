import os
import time
import subprocess
from main import app

p = os.path.join(os.getcwd() , 'frontEnd\\out\\frontend-win32-x64\\frontend.exe')

# subprocess.Popen('cmd /c cd frontEnd && npm start')
subprocess.Popen(p)
# time.sleep(0.5)
# os.system('cmd /k "cd backEnd && venv\\scripts\\activate && py app\\main.py"') 



if __name__ == '__main__':
    app.run(debug=False, port=3000)

    
    