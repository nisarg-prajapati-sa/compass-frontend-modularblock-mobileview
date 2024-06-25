import { CSSProperties } from 'react'
import { classNames, resolveAssetPreset } from '@/utils'
import { ImageComponent } from '@/types/components'


const ImagePreset: React.FC<ImageComponent> = (props: ImageComponent) => {
    const { image, image_alt_text, className, id } = props

    const renderImage = () => {
        if (image?.asset && image?.metadata?.extension_uid) {
            const { asset } = image

            const resolvedImg = resolveAssetPreset({
                ...image
            })
            if (resolvedImg && resolvedImg?.url) {
                return resolvedImg
            } else {
                return asset
            }
        } else {
            console.debug('Asset could not be resolved')
        }

    }
    const newImage = renderImage() as ImageComponent['image'] & { styles?: CSSProperties }

    return <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image?.asset?.url && <img
            id={id?.toString()}
            data-id='image-preset-component'
            src={newImage?.url}
            alt={(image_alt_text !== undefined && image_alt_text !== '') ? image_alt_text : image?.asset?.title}
            className={classNames(className ? className : '')}
            style={newImage?.styles ? newImage?.styles : undefined}
        />}
    </>
}

export { ImagePreset }