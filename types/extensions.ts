import { Asset } from './common'

export interface AssetMetadata {
    uid: number
    scope: string
    _version:number
    presets :  Preset[]
}

export interface Preset {
    uid: number
    name: string
    options:presetOptions
    'query-params': string
}

export interface AssetPresetMetadata {
    extension_uid:string
    preset?: Preset
}
export interface AssetPreset {
    asset: Asset
    metadata: AssetPresetMetadata
}
export interface presetOptionEffects {
    saturate:number
    brightness:number
    contrast:number
    blur:number
    sharpen: {
        amount:number
        radius:number
        threshold:number
    }
}
export interface presetOptions  {
    transform?: {
        height?: string,
        width?: string,
        rotate?:number
    },
    crop?: {
        height?: string,
        width?: string,
        x?: string,
        y?: string
    },
    effects?:presetOptionEffects
    'image-type'?:string
    quality?:string
    overlay?: {
        overlay?:string
        'overlay-align'?:string
        'overlay-repeat'?:string
        'overlay-height'?:string
        'overlay-width'?:string
    }
    frame?:{
        colorCode?:string
        padding?: {
            top?:string
            right?:string
            left?:string
            bottom?:string
        }
    }
}

export interface resolvedStyles {
    transform?:string
    height?:string
    width?:string
    'flip-mode'?:string
}

export interface resolvePresetParams {
    asset:Asset
    presetName?:string
    extension_uid?:string
    presetUID?:string
}
