import { localStorageConfig } from '../config'
import { addToDateNow } from '../utils'

import { CompactWebConfiguration, WebConfiguration } from '../types/generic'

export const setWebConfig = (webConfig: WebConfiguration) => {
    if(!localStorageConfig?.webConfiguration?.key) {
        console.error('TypeError: localStorageConfig.webConfiguration.key is undefined')
        return undefined
    }

    const compactWebConfig: CompactWebConfiguration = {
        markets: webConfig.markets,
        locale: webConfig.locale,
        _version: webConfig._version,
        expires: addToDateNow(Number(localStorageConfig.webConfiguration.ttl))
    }

    localStorage.setItem(localStorageConfig.webConfiguration.key, JSON.stringify(compactWebConfig))
    
}

export const getWebConfig = (): CompactWebConfiguration | undefined => {
    if(!localStorageConfig?.webConfiguration?.key) {
        console.error('TypeError: localStorageConfig.webConfiguration.key is undefined')
        return undefined
    }
    const value = localStorage.getItem(localStorageConfig.webConfiguration.key)
    if (value) {
        return JSON.parse(value) as CompactWebConfiguration
    }
    return undefined
}
export const setJsonCookie = (cname: string, cvalue: object, exdays: number) => {
    setCookie(cname, JSON.stringify(cvalue), exdays)
}

export const setCookie = (cname: string, cvalue: string, exdays: number) => {
    const d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    const expires = 'expires=' + d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

export const getJsonCookie = (cname: string) => {
    const cookieVal = getCookie(cname)
    if (cookieVal) {
        try {
            const jsonBVal = JSON.parse(cookieVal)
            return jsonBVal
        } catch (err: any) {
            console.error('Error parsing cookie value', cname)
        }
    }
    return null
}
export const getCookie = (cname: string) => {
    const name = cname + '='
    const decodedCookie = decodeURIComponent(document.cookie)
    const ca = decodedCookie.split(';')
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return null
}

export const isCookieExist = (cname: string) => {
    if (!document) return false
    return document?.cookie.match(cname) ? true : false
}
