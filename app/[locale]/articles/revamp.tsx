/**
 * !!!!!!!!!!
 * * This is a temporary PAGE/FILE for the purpose of demo for ticket TSOND-153 | Article Listing Page : Visual enhancement
 * * This file will be removed 
 * !!!!!!!!!!
 * **/ 
import { useEffect, useState } from 'react'
import { Dictionary } from 'lodash'
import { NextRouter, useRouter } from 'next/router'
import { getArticleListingPage, getArticles } from '@/loaders'
import {  Page } from '@/types'
import { CardCollection } from '@/components'
import { ImageCardItem } from '@/types/components'
import RenderComponents from '@/RenderComponents'
import { Pagination } from '@/components'
import { Article } from '@/types/pages'
import { onEntryChange } from '@/config'


export default function ArticleListing () { 

    const router: NextRouter = useRouter()

    const [Entry, setEntry] = useState<Page.ArticleListingPage['entry'] | null>(null)
    const [articles, setArticles] = useState<Page.ArticleListingPage['articles'] | null>(null)
    const [cards, setCards] = useState<ImageCardItem[] | []>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    // eslint-disable-next-line
    const [articlesPerPage, setArticlesPerPage] = useState<number>(12)
    const [topicsList, setTopicsList] = useState<string[]>([])
    const [topicFilter, setTopicFiler] = useState<string>('all-articles')
    const [groupedArticles, setGroupedArticles] = useState<Dictionary<Article[]>>()

    type groupedArticlesKey = keyof typeof groupedArticles

    const RenderCardCollection = () => {

        let articlesList: ImageCardItem[] | [] 

        if(cards?.length > 12) {

            const lastIndex = currentPage * articlesPerPage
            const firstIndex = lastIndex - articlesPerPage
            
            articlesList = cards.slice(firstIndex, lastIndex)

        } else {
            
            articlesList = cards

        }


        return(
            <CardCollection
                cards={articlesList}
                totalCount={cards?.length}
            />
        )

    }


    const addPageNumberinURL= (page: string) => {
        router.query.page =  page
        router.push(router, undefined, {scroll: false})
    }

    // * Method to group the articles based on topics
    const groupArticles = () => {

        const groupedObj: any = {}

        const checkKeyExistance = (keyName: string) => {

            if(!groupedObj[keyName]) return false

            return true

        }

        const addToObject = (topic: string, article: Article) => {

            if(!checkKeyExistance(topic)) {

                groupedObj[topic] = [article]

            } else if(checkKeyExistance(topic)) {

                groupedObj[topic]?.push(article)

            }

        }

        articles && articles?.map((article: any) => {

            if(article?.topics?.length === 1) {

                addToObject(article?.topics, article)
                
                return

            } else if(article?.topics?.length > 1) {

                article?.topics && article?.topics?.map((topic: string) => {

                    addToObject(topic, article)

                    return

                })

            }

            return

        })

        return groupedObj

    }

    // Function to convert hypenated text to Regular text
    const textConverter = (string: string): string => {
    
        return string.replace(/-([a-z])/g, (_m, s) =>  ` ${s.toUpperCase()}`)
    
    }

    // Returns number in 2 digits -- Might be used in the future
    const padNumber = (number: number, places: number): string => String(number).padStart(places, '0')

    const renderArticleCount = (count: number | undefined) => {

        if(!count) return padNumber(0, String(cards?.length).length as number)

        return padNumber(count as number, String(cards?.length).length as number)

    }

    const fetchData = async () => {
        try{
            const res = await getArticleListingPage('/articles', router.locale)
            setEntry(res)
        } catch(error) {
            console.error('Error while fetching ArticleListingPage:', error)
        }
    }
    const fetchArticles = async () => {
        try{
            const articleCollection = await getArticles(router.locale)
            setArticles(articleCollection)
        } catch(error) {
            console.error('Error while fetching Articles:', error)
        }
    }

    useEffect(() => {
        fetchArticles()
        onEntryChange(fetchData)
    }, [])

    useEffect(() => {
        const cardsData: ImageCardItem[] | []  =  articles?.map((article) => {

            return ({
                title: article?.title,
                content: article?.summary,
                image: article?.cover_image,
                $: article?.$,
                cta: article?.url
            })
        }) as ImageCardItem[] | [] 

        setCards(cardsData)

        const groupedArticlesList =  groupArticles()
        const topics = Object?.keys(groupedArticlesList)
        
        setGroupedArticles(groupedArticlesList)
        setTopicsList(topics)

    }, [Entry?.url, router?.locale, articles])

    useEffect(() => {

        const filteredTopic: string = topicFilter

        let cardsData: ImageCardItem[] | [] = [] 


        if(filteredTopic === 'all-articles') {
            
            cardsData =  articles?.map((article) => {
                
                return ({
                    title: article?.title,
                    content: article?.summary,
                    image: article?.cover_image,
                    $: article?.$,
                    cta: article?.url
                })
            }) as ImageCardItem[] | [] 
            
        } else {

            const filteredAtricles = groupedArticles?.[filteredTopic as groupedArticlesKey] as Article[]

            cardsData = filteredAtricles && filteredAtricles.map((article: any) => {

                return ({
                    title: article?.title,
                    content: article?.summary,
                    image: article?.cover_image,
                    $: article?.$,
                    cta: article?.url
                })

            }) as ImageCardItem[] | [] 

        }

        setCards(cardsData)

        if(cardsData?.length < 12) {

            addPageNumberinURL('1')

        }

    }, [topicFilter, articles])

    return (<>
        {Entry?.title && <div className='pt-16 mb-16 px-8 bg-background-primary dark:bg-white text-center max-w-7xl mx-auto'>
            <h1 className='mx-auto text-gray-900' {...Entry?.$?.title}>{Entry?.title}</h1>
        </div>}
        {Entry?.components && Object.keys(Entry.components)?.length ? (
            <RenderComponents
                components={Entry?.components}
            />
        ) : <></>}
        
        <div className='card-collection mt-8' id='pagination-scroll-anchor'>
            <div className='flex flex-row justify-center mt-16 mb-12'>
                <select 
                    id='topics-filter-select' 
                    className='capitalize min-w-[270px] !border-none focus:!border-none bg-[#F0F3F7] !ring-transparent focus:!ring-transparent !text-[#253143] 
                    text-base rounded-lg block py-1 px-5 dark:placeholder-gray-400 dark:text-white cursor-pointer leading-[38px]'
                    onChange={e => setTopicFiler(e.target.value)}
                    defaultValue={'all-articles'}
                >
                    {articles?.length && <option className='capitalize !text-[#253143] leading-[38px]' value='all-articles'>All Articles {`(${renderArticleCount(articles?.length)})`}</option>}
                    {
                        topicsList 
                        && topicsList.length > 0 
                        && topicsList?.map((topic: string) => <option key={topic} value={topic} className='capitalize !text-[#253143] leading-[38px]'>
                            { textConverter(topic) } { `(${renderArticleCount(groupedArticles && groupedArticles[topic as groupedArticlesKey]?.length)})`}
                        </option>)
                    }
                </select>
            </div>

            <div className={`${ (cards?.length > 1) ? 'mb-0 sm:mb-20' : '' }`}>
                <RenderCardCollection />
            </div>
            {
                cards?.length > 12 && <div className='py-8 px-8 xl:px-0 bg-background-primary dark:bg-transparent text-center max-w-7xl mx-auto'>
                    <Pagination
                        length={cards?.length}
                        dataPerPage={articlesPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </div>
            }
        </div>
    </>)
}

