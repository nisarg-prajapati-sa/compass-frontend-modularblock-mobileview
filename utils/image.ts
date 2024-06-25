import { AssetPreset, presetOptionEffects, presetOptions, resolvePresetParams, resolvedStyles } from '@/types/extensions'

const filterBGColor = (color:string) => {
    return color[0] === '#' ? color.slice(1) :color
}
const alignColumn:any = {
    start: 'left',
    end: 'right',
    center: 'center'
}
const alignRow:any = {
    start: 'top',
    end: 'bottom',
    center: 'center'
}
const getImageURL = (src:string, options:presetOptions) => {
    let newsrc = src
    let queryParams = ''
    if (options.transform) {
        queryParams += getTranformParams(options.transform)
    }
    if (options['image-type']) {
        queryParams += `&format=${options['image-type']}`
    }
    if (options.quality) {
        queryParams += `&quality=${options.quality}`
    }
    if (options.effects) {
        queryParams += getEffectsParams(options.effects)
    }
    if (options.overlay) {
        if(options.overlay.overlay){
            const pathName = new URL(options.overlay.overlay).pathname
            queryParams+= `&overlay=${pathName}`
        }
        if(options.overlay?.['overlay-align']){
            const alignPosition:string[] = options.overlay?.['overlay-align'].split(',')
            const align = `${alignColumn[alignPosition[0]]},${alignRow[alignPosition[1]]}`
            queryParams+= `&overlay-align=${align}`
        }
        if(options.overlay?.['overlay-repeat'] && options.overlay?.['overlay-repeat'] !== 'none'){
            queryParams+= `&overlay-repeat=${options.overlay?.['overlay-repeat']}`
        }
        if(options.overlay?.['overlay-height']){
            queryParams+= `&overlay-height=${options.overlay?.['overlay-height']}`
        }
        if(options.overlay?.['overlay-width']){
            queryParams+= `&overlay-width=${options.overlay?.['overlay-width']}`
        }
    }
    if(options.crop){
        queryParams+= `&crop=${options.crop.width},${options.crop.height},x${options.crop.x},y${options.crop.y}`
    }
    if(options.frame){
        let padQuery = ''
        if(options?.frame?.padding){
            if(typeof options?.frame?.padding === 'string'){
                padQuery = `&pad=${options?.frame?.padding}`
            }else{
                padQuery = `&pad=${options?.frame?.padding?.top},${options?.frame?.padding?.right},${options?.frame?.padding?.bottom},${options?.frame?.padding?.left}`
            }
        }
        if(options?.frame?.colorCode){
            padQuery += `&bg-color=${filterBGColor(options?.frame?.colorCode)}`
        }
        queryParams+= padQuery
    }
    if (queryParams) {
        if (newsrc.indexOf('?') > -1) {
            newsrc = newsrc + queryParams
        } else {
            newsrc = `${src}?${queryParams.slice(1)}`
        }
    }
    return newsrc
}
const getImageStyles = (options:presetOptions) => {
    const styles:resolvedStyles = {}
    if (options?.transform?.rotate) {
        styles.transform = `scale(0.75) rotate(${options?.transform?.rotate || 0}deg)`
        // styles.transform = `scale(${1 + (Math.abs(Math.ceil((options?.transform?.rotate || 0) / 10))) / 10}) rotate(${options?.transform?.rotate || 0}deg)`
    }
    return styles
}
const getEffectsParams = (effects:presetOptionEffects) => {
    let params = ''
    if (!(effects && (typeof effects === 'object') && Object.keys(effects).length > 0)) {
        return params
    }
    if (effects.brightness) {
        params += `&brightness=${effects.brightness}`
    }
    if (effects.contrast) {
        params += `&contrast=${effects.contrast}`
    }
    if (effects.saturate) {
        params += `&saturation=${effects.saturate}`
    }
    if (effects.blur) {
        params += `&blur=${effects.blur}`
    }
    if (effects.sharpen) {
        params += `&sharpen=a${effects.sharpen?.amount || 0},r${effects.sharpen?.radius || 1},t${effects.sharpen?.threshold || 0}`
    }
    return params
}

const getTranformParams = (transformVal:resolvedStyles) => {
    let params = ''
    if (transformVal.height) {
        params += `&height=${transformVal.height}`
    }
    if (transformVal.width) {
        params += `&width=${transformVal.width}`
    }
    if (transformVal['flip-mode']) {
        if (transformVal['flip-mode'] === 'both') {
            params += `&orient=${3}`
        }
        if (transformVal['flip-mode'] === 'horiz') {
            params += `&orient=${2}`
        }
        if (transformVal['flip-mode'] === 'verti') {
            params += `&orient=${4}`
        }
    }
    return params
}

// const resolvePresetName = ( metadata: AssetPresetMetadata) => {
//     return metadata?.preset?.name || ''
// }

/**
 * @param {object} asset
 * @param {string} presetName
 * @param {string} extension_uid
 * @returns {object}
 * @description This function will resolve the preset for the asset and update url
 *  @example const newAsset = resolvePresetByPresetName({asset:asset, presetName:"Blog Preset", extension_uid:"*****************"})
 * 
 */
export const resolveAssetPreset = ({ asset, metadata }:AssetPreset) => {
    // const {extension_uid} = metadata
    // const preset = fetchPresetByPresetName({
    //     asset,
    //     presetName: resolvePresetName( metadata ),
    //     extension_uid
    // })
    const preset = metadata.preset
    if(!preset?.name) return undefined

    if (preset && preset.options) {
        asset.url = getImageURL(asset.url, preset.options)
        return {...asset, styles: getImageStyles(preset.options)}
    }
    return undefined
}

/**
 * @param {object} asset
 * @param {string} presetName
 * @param {string} extension_uid
 * @returns {object}
 * @description This function find and return the preset for the asset
 *  @example const preset = fetchPresetByPresetName({asset:asset, presetName:"Blog Preset", extension_uid:"*****************"})
 */
export const fetchPresetByPresetName = ({ asset, extension_uid, presetName }:resolvePresetParams) => {
    let allPresets: any[] = []
    if (!presetName) {
        return {}
    }
    if (!extension_uid) {
        return {}
    }
    if (asset && asset._metadata && asset._metadata.extensions && asset._metadata.extensions[extension_uid]) {
        const metadatas = asset._metadata.extensions[extension_uid]
        const local_metadata = metadatas.find((metadata) => metadata.scope === 'local') || {}
        if (local_metadata.presets) {
            allPresets = [...allPresets, ...local_metadata.presets]
        }
        const global_metadata = metadatas.find((metadata) => metadata.scope === 'content_type') || {}
        if (global_metadata.presets) {
            allPresets = [...allPresets, ...global_metadata.presets]
        }
    }
    const preset = allPresets.find((elem: {name:string}) => elem.name === presetName)
    return preset
}

/**
 * @param {object} asset
 * @param {string} presetName
 * @param {string} extension_uid
 * @returns {object}
 * @description This function will resolve the preset for the asset and return styles 
 * 
 *  @example const imgStyles = resolvePresetStylesByPresetName({asset:asset, presetName:"Blog Preset", extension_uid:"*****************"})
 */
export const resolvePresetStylesByPresetName = ({ asset, presetName, extension_uid }:resolvePresetParams) => {
    let options = {}
    const preset = fetchPresetByPresetName({
        asset,
        presetName,
        extension_uid
    })
    if (preset.options) {
        options = getImageStyles(preset.options)
    }
    return options
}

/**
 * @param {object} asset
 * @param {string} presetUID
 * @param {string} extension_uid
 * @returns {object}
 * @description This function will resolve the preset for the asset and update url
 *  @example const newAsset = resolvePresetByPresetUID({asset:asset, presetUID:"*****************", extension_uid:"*****************"})
 */
export const resolvePresetByPresetUID = ({ asset, presetUID, extension_uid }:resolvePresetParams) => {
    const preset = fetchPresetByPresetUID({
        asset,
        presetUID,
        extension_uid
    })
    if (preset && preset.options) {
        asset.url = getImageURL(asset.url, preset.options)
    }
    return asset
}

/**
 * @param {object} asset
 * @param {string} presetUID
 * @param {string} extension_uid
 * @returns {object}
 * @description This function find and return the preset for the asset
 *  @example const presets = fetchPresetByPresetUID({asset:asset, presetUID:"*****************", extension_uid:"*****************"})
 */
export const fetchPresetByPresetUID = ({ asset, extension_uid, presetUID }:resolvePresetParams) => {
    let allPresets:any[] = []
    if (!presetUID) {
        return {}
    }
    if (!extension_uid) {
        return {}
    }
    if (asset && asset._metadata && asset._metadata.extensions && asset._metadata.extensions[extension_uid]) {
        const metadatas = asset._metadata.extensions[extension_uid]
        const local_metadata = metadatas.find((metadata:any) => metadata.scope === 'local') || {}
        if (local_metadata.presets) {
            allPresets = [...allPresets, ...local_metadata.presets]
        }
        const global_metadata = metadatas.find((metadata:any) => metadata.scope === 'content_type') || {}
        if (global_metadata.presets) {
            allPresets = [...allPresets, ...global_metadata.presets]
        }
    }
    const preset = allPresets.find((elem:{uid:string}) => elem.uid === presetUID)
    return preset
}


/**
 * @param {object} asset
 * @param {string} presetName
 * @param {string} extension_uid
 * @returns {object}
 * @description This function will resolve the preset for the asset and return styles 
 * 
 *  @example const imgStyles = resolvePresetStylesByPresetUID({asset:asset, presetUID:"*****************", extension_uid:"*****************"})
 */
export const resolvePresetStylesByPresetUID = ({ asset, presetUID, extension_uid }:resolvePresetParams) => {
    let options = {}
    const preset = fetchPresetByPresetUID({
        asset,
        presetUID,
        extension_uid
    })
    if (preset.options) {
        options = getImageStyles(preset.options)
    }
    return options
}