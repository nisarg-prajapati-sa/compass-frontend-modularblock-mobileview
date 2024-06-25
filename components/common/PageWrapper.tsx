'use client'
import React, { useEffect, useState } from 'react'
import { SEO } from '@/components'
import { SeoProps } from '@/types/pages'
import { entryLocales as entryLocalesType } from '@/types/common'

const PageWrapper:React.FC<SeoProps & React.PropsWithChildren> = ({ locale, title, uid, summary, url, seo, children, contentType}: SeoProps & React.PropsWithChildren) => {
    const [entryLocales, setEntryLocales] = useState<entryLocalesType[]|[]>([])
    
    const fetchEntryLanguages = async () => {
        try {
            const res = await fetch(`/api/contentstack/${contentType}/${uid}/locales`)
            const { locales } = await res.json()
            setEntryLocales(locales)
        } catch (err) {
            console.error('Error while fetching entry languages', err)
        }
    }

    useEffect(() => {
        fetchEntryLanguages()
    }, [])

    return <>
        <SEO
            url={url}
            locale={locale}
            title={title}
            seo={seo}
            summary={summary}
            entryLocales={entryLocales}
        />
        {children}
    </>
}

export {PageWrapper}