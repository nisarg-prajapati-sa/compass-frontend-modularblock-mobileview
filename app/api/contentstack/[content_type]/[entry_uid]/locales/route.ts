import { NextRequest, NextResponse } from 'next/server'
import { createManagmentHeaders } from '@/config/contentstack/managementSDK'

export async function GET (req: NextRequest, { params }: {
     params: {
        entry_uid: string;
        content_type: string 
} }) {
    const contentType = params.content_type
    const entryUid = params.entry_uid
    const requestOptions = createManagmentHeaders('GET')
    const url = `https://${process.env.CONTENTSTACK_API_HOST}/v3/content_types/${contentType}/entries/${entryUid}/locales`

    const res = await fetch(url, requestOptions)
    const data = await res.json()
    return NextResponse.json({...data})
}