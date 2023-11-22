'use client'

import { useState } from 'react'
import MenuButton from 'websites/components/MenuButton'
import links from '../links'
import Link from 'websites/components/Link'
import Portal from 'websites/components/Portal'
import clsx from 'clsx'
import { IconArrowUpRight, IconBrandDiscord, IconBrandGithub, IconBrandX, IconChevronRight, IconLanguage, IconMessages, IconSelector, IconVersions } from '@tabler/icons-react'
import ThemeSelect from 'websites/components/ThemeSelect'
import ThemeIcon from 'websites/components/ThemeIcon'
import { useThemeService } from '@master/css.react'
import DocVersionSelect from './DocVersionSelect'
import version from '~/version'
import LanguageSelect from 'websites/components/LanguageSelect'
import { nameOfLocale } from 'websites/i18n.config.mjs'

export default function DocMenuButton({ dict, ...props }: any) {
    const [opened, setOpened] = useState(false)
    const themeService = useThemeService()
    const t = (text: string) => dict?.[text] || text
    return (
        <>
            <MenuButton {...props} opened={opened} onClick={() => setOpened(!opened)} />
            {opened &&
                <Portal>
                    <div className="fixed @fade|.3s bd:blur(25) bg:base/.9 bottom:0 overflow-y:auto overscroll-behavior:contain pb:80 pt:20 top:49 top:61@lg w:full z:1050">
                        {links.map(({ Icon, disabled, fullName, ...eachLink }: any) =>
                            <Link className={clsx('flex ai:center w:full', { 'fg:dim': disabled })} {...eachLink} disabled={disabled} key={eachLink.name} onClick={!disabled && (() => setOpened(false))}>
                                <Icon className={clsx('fill:dim/.2 ml:20 mr:12', disabled ? 'fg:dim' : 'fg:fade')} stroke="1" width="26" height="26" />
                                <div className={clsx('flex ai:center bb:1|divider flex:1 h:48', { 'fg:major': !disabled })}>
                                    {t(fullName || eachLink.name)}
                                    {!disabled && <IconChevronRight className="fg:dim ml:auto mr:12" stroke="1.3" />}
                                </div>
                            </Link>
                        )}
                        <div className='font:14 m:40|20|10|20'>{t('Community')}</div>
                        <Link className="flex ai:center w:full" href="https://github.com/master-co/css" onClick={() => setOpened(false)}>
                            <IconBrandGithub className="fg:fade fill:dim/.2 ml:20 mr:12" stroke="1" width="26" height="26" />
                            <div className="flex ai:center bb:1|divider fg:major flex:1 h:48">
                                GitHub
                                <IconArrowUpRight className="fg:dim ml:auto mr:12" stroke="1.3" />
                            </div>
                        </Link>
                        <Link className="flex ai:center w:full" href="https://github.com/master-co/css/discussions" onClick={() => setOpened(false)}>
                            <IconMessages className="fg:fade fill:dim/.2 ml:20 mr:12" stroke="1" width="26" height="26" />
                            <div className="flex ai:center bb:1|divider fg:major flex:1 h:48">
                                {t('Discussions')}
                                <IconArrowUpRight className="fg:dim ml:auto mr:12" stroke="1.3" />
                            </div>
                        </Link>
                        <Link className="flex ai:center w:full" href="https://discord.com/invite/sZNKpAAAw6" onClick={() => setOpened(false)}>
                            <IconBrandDiscord className="fg:fade fill:dim/.2 ml:20 mr:12" stroke="1" width="26" height="26" />
                            <div className="flex ai:center bb:1|divider fg:major flex:1 h:48">
                                Discord
                                <IconArrowUpRight className="fg:dim ml:auto mr:12" stroke="1.3" />
                            </div>
                        </Link>
                        <Link className="flex ai:center w:full" href="https://twitter.com/mastercorg" onClick={() => setOpened(false)}>
                            <IconBrandX className="fg:fade fill:dim/.2 ml:20 mr:12" stroke="1" width="26" height="26" />
                            <div className="flex ai:center bb:1|divider fg:major flex:1 h:48">
                                Twitter
                                <IconArrowUpRight className="fg:dim ml:auto mr:12" stroke="1.3" />
                            </div>
                        </Link>
                        <div className='font:14 m:40|20|10|20'>{t('System')}</div>
                        <label className="flex ai:center w:full">
                            <IconVersions className="fg:fade fill:dim/.2 ml:20 mr:12" stroke="1" width="26" height="26" />
                            <div className="flex ai:center bb:1|divider fg:major flex:1 h:48">
                                {t('Version')}
                                <div className='flex rel ai:center ml:auto'>
                                    <div className="capitalize fg:fade ml:auto mr:12">{version}</div>
                                    <DocVersionSelect version={version} />
                                    <IconSelector className="fg:dim mr:12" stroke="1.3" />
                                </div>
                            </div>
                        </label>
                        <label className="flex ai:center w:full">
                            <IconLanguage className="fg:fade fill:dim/.2 ml:20 mr:12" stroke="1" width="26" height="26" />
                            <div className="flex ai:center bb:1|divider fg:major flex:1 h:48">
                                {t('Language')}
                                <div className='flex rel ai:center ml:auto'>
                                    <LanguageSelect locale={props.locale}>
                                        {(currentLocale: keyof typeof nameOfLocale) =>
                                            <div className="capitalize fg:fade ml:auto mr:12">{nameOfLocale[currentLocale]}</div>
                                        }
                                    </LanguageSelect>
                                    <IconSelector className="fg:dim mr:12" stroke="1.3" />
                                </div>
                            </div>
                        </label>
                        <label className="flex ai:center w:full">
                            <ThemeIcon className="fg:fade fill:dim/.2 ml:20 mr:12" stroke="1" width="26" height="26" />
                            <div className="flex ai:center bb:1|divider fg:major flex:1 h:48">
                                {t('Theme')}
                                <div className='flex rel ai:center ml:auto'>
                                    <div className="capitalize fg:fade ml:auto mr:12">{themeService?.value}</div>
                                    <ThemeSelect />
                                    <IconSelector className="fg:dim mr:12" stroke="1.3" />
                                </div>
                            </div>
                        </label>
                    </div>
                </Portal>
            }
        </>
    )
}