import { Footer } from '@/types/app'

export const includefooterRefUids = [
    'sections.link',
    'sections.links.link'
]

export const isFooterValid = (footer:Footer) => {
    return footer && Object.keys(footer)?.length > 0
}