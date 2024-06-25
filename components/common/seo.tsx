import { Page } from '@/types'
import { useLocaleContext } from '@/context/localeContext'

export const SEO: React.FC<Page.SeoProps> = (props: Page.SeoProps) => {

    const { seo: {no_follow, no_index, description, canonical_url} = {}, locale, summary, url, entryLocales} = props
    const {currentLocale} = useLocaleContext()

    const alternateMetaLinks = entryLocales?.map((lang: { code: string }) => ({
        hrefLang: lang?.code,
        href: `/${lang?.code}${url}`
    }))

    let robots
    if (no_follow && no_index) {
        robots = 'noindex,nofollow'
    } else if (no_follow) {
        robots = 'index,nofollow'
    } else if (no_index) {
        robots = 'noindex,follow'
    } else {
        robots = 'index,follow'
    }

    return (
        <>
            {props?.seo?.title ? <title>{props?.seo?.title}</title> : <title>{props?.title}</title>}
            <meta
                name='application-name'
                content='Universal Demo'
            />
            <meta charSet='utf-8' />
            <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
            <meta
                name='viewport'
                content='width=device-width,initial-scale=1,minimum-scale=1'
            />
            <meta
                name='description'
                content={summary ? summary : description ? description : ''}
            />
            <meta
                name='robots'
                content={robots} key='robots'
            />
            <meta
                property='og:locale'
                content={locale || 'en'}
            />
            <meta
                httpEquiv='content-language'
                content={locale}
            />

            {alternateMetaLinks && (alternateMetaLinks?.length > 0) && alternateMetaLinks?.map((li: { hrefLang: string, href: string }) => li?.href && li?.hrefLang && li?.hrefLang !== currentLocale && <link
                rel='alternate'
                hrefLang={li.hrefLang}
                href={li.href}
            />)}
            <link
                rel='canonical'
                href={canonical_url ? canonical_url : url}
            />
            <link
                rel='icon'
                href='/favicon.ico'
            />
        </>
    )
}
