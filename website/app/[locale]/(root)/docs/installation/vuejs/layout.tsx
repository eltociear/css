import Tabs, { Tab, TabBadge } from 'websites-shared/components/Tabs'
import { queryDictionary } from 'websites-shared/dictionaries';
import DocLayout from '~/layouts/doc'
import LogoSvg from 'websites-shared/images/frameworks/vuejs.svg'

export default async function Layout(props: any) {
    const $ = await queryDictionary(props.params.locale)
    return (
        /* @ts-expect-error server component */
        <DocLayout {...props}
            metadata={{
                title: 'Set up Master CSS in Vue.js',
                description: 'Guide to setting up Master CSS in your Vue.js project.',
                category: 'Installation'
            }}
            backOnClickCategory='/docs/installation'
            icon={{
                Element: LogoSvg,
                class: 'w:64'
            }}
        >
            <Tabs className="mb:30">
                <Tab href='/docs/installation/vuejs'>{$('Progressive Rendering')}</Tab>
                <Tab href='/docs/installation/vuejs/runtime-rendering'>{$('Runtime Rendering')} <TabBadge>{$('Recommanded')}</TabBadge></Tab>
                <Tab href='/docs/installation/vuejs/static-extraction'>{$('Static Extraction')}</Tab>
            </Tabs>
            {props.children}
        </DocLayout >
    )
}