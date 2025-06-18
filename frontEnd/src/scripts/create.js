const main = document.querySelector('main')

async function insert(data, zipFile) {
    const zipFileBlob = await JSZip.loadAsync(zipFile)
    data.forEach( (item, index) => {
        const title = item.title
        const path = item.path
        const id = item.video_Id
        
        const div = document.createElement('div')
        const img1 = document.createElement('img')
        const img2 = document.createElement('img')
        const h1 = document.createElement('h1')
        const audio = document.createElement('audio') 
        const source = document.createElement('source') 
        
        
        
        div.classList.add('container', `btn-${index}`)
        img1.classList.add('item')
        img2.classList.add('item', 'play')
        h1.classList.add('item')
        
        
        h1.innerText = title
        img1.src = `https://img.youtube.com/vi/${id}/0.jpg`
        img2.src = 'https://cdn-icons-png.flaticon.com/512/0/375.png'
        audio.volume = 0.5
        
        for (const relativePath in zipFileBlob.files){
            const zipEntry = zipFileBlob.files[relativePath]
            
            if (path.endsWith(relativePath)) {
                zipEntry.async('blob')
                .then(contentBlob => {
                const audioUrl = URL.createObjectURL(contentBlob)  
                
                source.src = audioUrl
                source.type = 'audio/mp3'
                })
        
            }
        }    
            
        
        
        div.appendChild(h1)
        div.insertBefore(img1, div.children[0])
        div.insertBefore(img2, div.children[1])
        audio.appendChild(source)
        div.insertBefore(audio, div.children[2])
        main.appendChild(div)
        
        const div_index = document.querySelector(`.btn-${index}`)
        const valor = function() {
            this.addEventListener('click', () => {
                // console.log('click', this.classList)
                audio.autoplay =true
                audio.load()
            })
        }
        valor.bind(div_index)();
    })       
}


