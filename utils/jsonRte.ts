/* eslint-disable @typescript-eslint/no-unused-vars */
export const renderOption = {
    img: (asset: any) => {
        return (
            `<img src=${asset?.attrs?.url} alt=${asset?.alt} />`
        )
    },
    'code': (asset: any, metadata: any) => {
        return (
            `<div className="code">${asset.children[0].text}</div>`
        )
    },
    span: (node: any, next: any) => next(node?.children),
    a: (asset: any) => {
        return `<a href=${asset?.attrs?.url} target=${asset?.attrs?.target}
            style='text-align:${asset?.attrs?.style?.['text-align'] ? asset.attrs.style?.['text-align'] : 'left' }'>
                ${asset?.children?.[0]?.text}
            </a>`
    }
    
}

