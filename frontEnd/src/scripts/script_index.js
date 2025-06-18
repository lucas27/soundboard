
async function axi() {
    const getAxios = await axios.get('http://localhost:3000/send')
    const axiosBlob = await axios.get('http://localhost:3000/sounds', {responseType: 'blob'})
    
    insert(getAxios.data, axiosBlob.data)
}
axi()





