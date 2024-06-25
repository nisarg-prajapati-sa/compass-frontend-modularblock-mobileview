import _ from 'lodash'
import { imageCardsReferenceIncludes, includefooterRefUids, includeheaderRefUids, teaserReferenceIncludes, textAndImageReferenceIncludes } from '@/components'
import { prefixReferenceIncludes } from '@/utils'
import { getEntries,getEntryByUrl } from '@/services'
import { Taxonomy } from '@/types/pages'

export const getHomePage = ( cmsUrlPath: string | undefined, locale: string | undefined) => {
    const newRefUids = prefixReferenceIncludes('components',
        ...prefixReferenceIncludes('text_and_image', ...textAndImageReferenceIncludes),
        ...prefixReferenceIncludes('teaser', ...teaserReferenceIncludes),
        ...prefixReferenceIncludes('card_collection', ...imageCardsReferenceIncludes)
    )

    newRefUids.push(...prefixReferenceIncludes('featured_articles', 'articles'))

    return getEntryByUrl('home_page',locale, '/', newRefUids, [])
}

export const getLandingPage = (cmsUrlPath: string | undefined, locale: string | undefined) => {
    const newRefUids = prefixReferenceIncludes('components',
        ...prefixReferenceIncludes('text_and_image', ...textAndImageReferenceIncludes),
        ...prefixReferenceIncludes('teaser', ...teaserReferenceIncludes),
        ...prefixReferenceIncludes('card_collection', ...imageCardsReferenceIncludes)
    )
    return getEntryByUrl('landing_page',locale, `${cmsUrlPath}`, newRefUids, ['components.text.content'])  
}

export const getArticle = (cmsUrlPath: string | undefined, locale: string | undefined) => {
    const jsonRtePaths = ['content']
    return getEntryByUrl('article', locale, `${cmsUrlPath}`, [], jsonRtePaths)  
}

export const getArticleListingPage = (cmsUrlPath: string | undefined, locale: string | undefined) => {
    const newRefUids = prefixReferenceIncludes('components',
        ...prefixReferenceIncludes('text_and_image', ...textAndImageReferenceIncludes),
        ...prefixReferenceIncludes('teaser', ...teaserReferenceIncludes),
        ...prefixReferenceIncludes('card_collection', ...imageCardsReferenceIncludes)
    )
    return getEntryByUrl('article_listing_page', locale, cmsUrlPath, newRefUids, ['components.text.content'])  
}

export const getArticles = (locale?: string , taxonomies?:Taxonomy[], limit?: number) => {

    const groupedData = _.groupBy(taxonomies, 'taxonomy_uid')
    const outputData:any = _.map(groupedData, (terms:string, taxonomy_uid:string) : {taxonomy_uid:string, term_uids:string[]}=> ({
        'taxonomy_uid': taxonomy_uid,
        'term_uids': _.map(terms, 'term_uid')
    }))

    const filterQuery = outputData?.length && outputData?.map((dt :  {taxonomy_uid:string, term_uids:string[]}) => ({[`taxonomies.${dt.taxonomy_uid}`]: dt.term_uids }))

    return getEntries('article', locale, [], [], {
        queryOperator: 'or',
        filterQuery
    },limit)  
}

export const getArticlesByTaxonomy = async (taxonomyPath: string , locale?: string) => {
    const pathArray = taxonomyPath.split('/')
    const uid = pathArray?.[2]
    const term = pathArray?.[3]?.replaceAll('-', '_')

    if (!term) { //check if term exist in url
        throw new Error('Invalid parameters. Valid pageUrl format is /articles/taxonomy_uid/term')
    }

    const filterQuery = { key: `taxonomies.${uid}`, value: term }
    return getEntries('article', locale, [], [], { filterQuery })

}

export const getArticleListingPageByTaxonomy = (locale?: string , taxonomies?:Taxonomy[]) => {
    const filterQuery = taxonomies?.map((elem) => ( {
        url: `/articles/${elem.taxonomy_uid}/${elem.term_uid.replaceAll('_', '-')}`
    }) )
    
    return getEntries('article_listing_page', locale, [], [], {
        queryOperator: 'or',
        filterQuery
    })  
}

export const getAppConfigData = async (locale:string|undefined) => {
    const webConf=await getEntries('web_configuration', locale, ['footer_navigation',...prefixReferenceIncludes('footer_navigation', ...includefooterRefUids),
        'main_navigation', ...prefixReferenceIncludes('main_navigation', ...includeheaderRefUids)], ['footer_navigation.copyright_info', 'footer_navigation.built_by'], {})

    if (!webConf || webConf === null) {
        return null
    }
    
    return webConf

}