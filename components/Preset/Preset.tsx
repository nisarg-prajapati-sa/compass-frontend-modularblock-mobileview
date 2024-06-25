'use client'
import { useEffect, useRef, useState } from 'react'
import { Image } from '@/types/components'
import { ImagePreset } from '../common/Image/ImagePreset'

/**
 * Image Preset Section Component 
 * @param props: ImagePresetType 
 */ 
const Preset: React.FC<Image> = (props: Image) => {

    const { image, image_alt_text, id } = props
    const [height,  setHeight] = useState<string|number|undefined>('auto')
    const imgRef = useRef<null| HTMLDivElement>(null)
    const isRotate = image?.metadata?.preset?.options?.transform?.rotate !== 0 && image?.metadata?.preset?.options?.transform?.rotate !== undefined

    useEffect(() => {
        if(isRotate) {
            setTimeout(()=>{
                setHeight(imgRef?.current?.children?.[0]?.clientWidth)
            },500)
            window.addEventListener('resize', () => {
                setHeight(imgRef?.current?.children?.[0]?.clientWidth)
            })
        }
        return () => window.removeEventListener('resize', () => {})
    }, [image?.metadata?.preset?.name])
    
    return(
        
        image?.asset?.url ? <div
            className={'relative my-8 px-8 max-w-7xl mx-auto bg-white dark:bg-black flex flex-col items-center text-center justify-center'}
            {...image?.$?.uid}
            ref={imgRef}
            style={{ height: height || 'auto' }}
        >   
            <ImagePreset
                id={id}
                image={image}
                image_alt_text={image_alt_text}  
            />
        </div>: <></>
    )

}

export { Preset }