import _ from 'lodash'

import { Teaser } from '@/types/components'

export const isTextValid = (obj: Teaser): boolean => {
    return !_.isEmpty(obj.heading)
}

export const teaserReferenceIncludes = [
    'cta.link'
]


