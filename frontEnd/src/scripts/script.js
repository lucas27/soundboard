const div = document.querySelector('div')
const input = document.querySelector('input')
const btnApply = document.createElement('button')
const btnCancel = document.createElement('button')
const img = document.createElement('img')
const p = document.createElement('p')
const audio = document.createElement('audio')
const source = document.createElement('source')

function download() {
    FunctionForBack()
    
}

async function FunctionForBack() {
    try {
        const postAxios = await axios.post('http://localhost:3000/download', {url: input.value}, {
            headers: {'Content-Type': 'application/json'}})
        
        console.log(postAxios.data)
        if(postAxios.data === 'denied file'){
            deniedResponse()
        }else{
            const audioBlob = await axios.get('http://localhost:3000/aFile', {responseType: 'blob'})
            createElement(postAxios.data, audioBlob.data)
        }
        
        
    } catch (error) {
        console.error(error)
    }
}

async function createElement(data, blob) {
    
    data.forEach(item => {
        const title = item.title
        const path = item.path
        const id = item.video_Id
        
        
        btnApply.id = 'applyBtn'
        btnCancel.id = 'cancelBtn'
        img.src = `https://img.youtube.com/vi/${id}/0.jpg`
        p.innerText = title
        btnApply.innerText = 'Apply'
        btnCancel.innerText = 'Cancel'
        audio.controls = true
        
        const audioUrl = URL.createObjectURL(blob)
        source.src = audioUrl;
        source.type = 'audio/mp3'; 
        audio.appendChild(source)
        
        div.insertBefore(img, div.children[0])
        div.insertBefore(p, div.children[1])
        div.insertBefore(audio, div.children[2])
        div.insertBefore(btnCancel, div.children[3])
        div.appendChild(btnApply)
    })
}

btnApply.addEventListener('click', () => {
    window.location.href =  "../../public/index.html"
    console.log('aplicar') 

})

btnCancel.addEventListener('click', () => {
    console.log('cancelar')
})

function deniedResponse(){
    mensage = 'Estou cansado chefe.\n' + 'Coloque um video com menos de dois minutos'
    alert(mensage)
}