import { isString } from 'lodash'
import { Cta } from '@/types/components'

export const resolveCardCta = (cta?: string | Cta) => {
    if(!cta) return
    if(isString(cta) ) return cta
    if(cta?.link && cta?.link?.length >= 0) return cta.link
}

// export const resolveCtaText = (cta?: string | Cta) => {
//     return !isString(cta) && cta?.text ? cta.text : 'More'
// }
