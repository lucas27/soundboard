import { useEffect,  useReducer,  useState } from "react"
import { SongButton } from "./ButtonMainSong"
import styleMainPageModule from '../../scss/main/mainpage.module.scss'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { DndContext } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const reducer = (state, action) => {
    switch(action.type) {
        case 'saveIds':
            return {...state, ids: action.newIds, oldIds: action.newOldId, idState: action.newIdState}
        default:
            throw Error
    }
}


const MainComponent = () => {
    const [arrayData, setArrayData] = useState([])
    const [state, dispatch] = useReducer(reducer, {
        ids: [],
        oldIds: [],
        idState: false
    })

    const defaultInformationButton = async () => {
        try{
            const file = await window.api.selectFilesFromDB('fromDB', 'id, thumbnail_link, thumbnail_file, video_title, order_id')
            for(let i = 0; i < file.length; i++) {
                let thumbnailLink = file[i].thumbnail_link
                if(thumbnailLink === '0'){
                    const bytesFile = new Blob([file[i].thumbnail_file], {type: 'image/webm'})
                    const url = URL.createObjectURL(bytesFile)
                    file[i].thumbnail_link = url  
                } 
            }
                setArrayData(file)
                dispatch({type: 'saveIds' , newIds: file.map(item => item.order_id), newOldId: file.map(item => item.id)})
        }catch (err) {
            console.log(err.message)
        }
    }


    useEffect(() => {
        defaultInformationButton()
    }, [])

    const {ids, oldIds, idState} = state

    const {
        setNodeRef,
        transform,
        transition,
    } = useSortable({ ids })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }
    
    const onDragEnd = (event) => {
        const {active, over} = event 

        if (!over) return
        const oldIndex = ids.indexOf(active.id)
        const newIndex = ids.indexOf(over.id)

        // 2. Cria o novo array de IDs (Imutável)
        dispatch({type: 'saveIds', newIds: arrayMove(ids, oldIndex, newIndex), newIdState: true, newOldId: oldIds})
        // 3. Cria o novo array de Dados (Imutável)
        setArrayData(arrayMove(arrayData, oldIndex, newIndex))
    }
    
    
    useEffect(() => {
        if(idState) {
            for(let i = 0; i <= ids.length; i++) {
                window.api.changeOrderId('orderId', oldIds[i] , ids[i])    
            }
        }
    }, [ids])

    return (
        <DndContext onDragEnd={onDragEnd}>
            <SortableContext items={ids} strategy={rectSortingStrategy}>
                <main id={styleMainPageModule.main} ref={setNodeRef} style={style}>
                    {arrayData.map(item => (
                        <SongButton
                        key={item.order_id}
                        id={item.id}
                        // index={index}
                        thumbnail={item.thumbnail_link}
                        title={item.video_title}
                        />
                        
                    ))}
                </main>
            </SortableContext>
        </DndContext>
    )
}

export default MainComponent