import { MasterCSSMediaFeatureRule } from './interfaces/media-feature-rule';
import { MasterCSSMedia } from './interfaces/media';
import { getCssPropertyText } from './utils/get-css-property-text';
import { parseValue } from './utils/parse-value';
import { PRIORITY_SELECTORS } from './constants/priority-selectors';
import { START_SYMBOL } from './constants/start-symbol';
import { GROUP } from './constants/css-property-keyword';
import { MasterCSSConfig } from './interfaces/config';
import { MasterCSS } from './css';
import { CssPropertyInfo } from './interfaces/css-property-info';

const MATCHES = 'matches';
const SEMANTICS = 'semantics';
const SYMBOL = 'symbol';
const WIDTH = 'width';
const MAX_WIDTH = 'max-' + WIDTH;
const MIN_WIDTH = 'min-' + WIDTH;
const SCROLLBAR = 'scrollbar';
const SEARCH = 'search';
const METER = 'meter';
const PROGRESS = 'progress';
const RESIZER = 'resizer';
const SLIDER = 'slider';
const SLIDER_THUMB = SLIDER + '-thumb';
const SLIDER_RUNNABLE_TRACK = SLIDER + '-runnable-track';
const MOTION = 'motion';
const REDUCE = 'reduce';
const REDUCED_MOTION = REDUCE + 'd-' + MOTION;
const PSEUDO_PREFIX = '::';
const SCROLLBAR_PSEUDO = PSEUDO_PREFIX + SCROLLBAR;
const SLIDER_THUMB_PSEUDO = PSEUDO_PREFIX + SLIDER_THUMB;
const SLIDER_RUNNABLE_TRACK_PSEUDO = PSEUDO_PREFIX + SLIDER_RUNNABLE_TRACK;
const SEARCH_PSEUDO = PSEUDO_PREFIX + SEARCH;
const METER_PSEUDO = PSEUDO_PREFIX + METER;
const RESIZER_PSEUDO = PSEUDO_PREFIX + RESIZER;
const PROGRESS_PSEUDO = PSEUDO_PREFIX + PROGRESS;
const WEBKIT_PSEUDO_PREFIX = PSEUDO_PREFIX + '-webkit-';

const PX = 'px';
const REM = 'rem';

const selectorSymbols = ['!', '*', '>', '+', '~', ':', '[', '@', '_'];
const semanticSuffixes = [...selectorSymbols, undefined, '.'];
const scrollbarPseudoRegexp = new RegExp(SCROLLBAR_PSEUDO, 'g');
const searchPseudoRegexp = new RegExp(SEARCH_PSEUDO, 'g');
const meterPseudoRegexp = new RegExp(METER_PSEUDO, 'g');
const sliderRunnableTrackPseudoRegexp = new RegExp(SLIDER_RUNNABLE_TRACK_PSEUDO, 'g');
const sliderThumbPseudoRegexp = new RegExp(SLIDER_THUMB_PSEUDO, 'g');
const resizerPseudoRegexp = new RegExp(RESIZER_PSEUDO, 'g');
const progressPseudoRegexp = new RegExp(PROGRESS_PSEUDO, 'g');
const selectorSplitRegexp = /(\\'(?:.*?)[^\\]\\')(?=[*_>~+,)])|(\[[^=]+='(?:.*?)[^\\]'\])/;
const transformSelectorUnderline = (selector: string) => selector.split(selectorSplitRegexp)
    .map((eachToken, i) => i % 3 ? eachToken : eachToken.replace(/\_/g, ' '))
    .join('');

export interface RuleMatching {
    origin: 'matches' | 'semantics' | 'symbol';
    value?: string;
}

export class MasterCSSRule {

    readonly prefix: string;
    readonly symbol: string;
    readonly token: string;
    readonly prefixSelector: string;
    readonly suffixSelector: string;
    readonly important: boolean;
    readonly media: MasterCSSMedia;
    readonly at: Record<string, string> = {};
    readonly direction: string;
    readonly colorScheme: string;
    readonly unitToken: string;
    readonly hasWhere: boolean;
    readonly prioritySelectorIndex: number = -1;
    readonly natives: { unit: string, value: string | Record<string, string | number>, text: string, theme: string, cssRule?: CSSRule }[] = [];

    static id: string;
    static propName: string;
    static matches: RegExp;
    static colorStarts: string;
    static symbol: string;
    static unit = REM;
    static colorful: boolean;
    static rootSize: number = 16;

    static match(
        name: string,
        colorNames: string[]
    ): RuleMatching {
        /** 
         * STEP 1. matches
         */
        if (this.matches && this.matches.test(name)) {
            return { origin: MATCHES };
        }
        /** 
         * STEP 2. color starts
         */
        // TODO: 動態 new Regex 效能問題待優化
        if (this.colorStarts
            && (
                name.match('^' + this.colorStarts + '(?:(?:#|(rgb|hsl)\\(.*\\))((?!\\|).)*$|(?:transparent|current))')
                || colorNames.length
                && name.match('^' + this.colorStarts + '(' + colorNames.join('|') + ')')
                && name.indexOf('|') === -1
            )
        ) {
            return { origin: MATCHES };
        }
        /** 
         * STEP 3. symbol
         */
        if (this.symbol && name.startsWith(this.symbol)) {
            return { origin: SYMBOL };
        }
        /**
         * STEP 4. key full name
         */
        if (this.propName && name.startsWith(this.propName + ':')) {
            return { origin: MATCHES };
        }
    };

    constructor(
        public readonly name: string,
        { breakpoints, mediaQueries, semantics }: MasterCSSConfig,
        values: Record<string, string | number>,
        colorsThemesMap: Record<string, Record<string, Record<string, string>>>,
        relationThemesMap: Record<string, string[]>,
        colorSchemes: string[],
        public readonly matching: RuleMatching,
        css: MasterCSS
    ) {
        const TargetRule = this.constructor as typeof MasterCSSRule;
        let { id, unit, propName, colorful, rootSize } = TargetRule;
        let token = name;

        // 防止非色彩 style 的 token 被解析
        if (!colorful) {
            colorsThemesMap = null;
        }

        // 1. value / selectorToken
        let value: string | Record<string, string | number>, prefixToken: string, suffixToken: string, valueTokens: (string | { value: string })[];
        if (matching.origin === SEMANTICS) {
            suffixToken = token.slice(matching.value.length);
            value = semantics[matching.value];
        } else {
            let valueToken: string;
            if (matching.origin === MATCHES) {
                if (id === GROUP) {
                    let i = 0;
                    for (; i < token.length; i++) {
                        if (token[i] === '{' && token[i - 1] !== '\\') {
                            break;
                        }
                    }

                    prefixToken = token.slice(0, i);
                    valueToken = token.slice(i);
                } else {
                    const indexOfColon = token.indexOf(':');
                    this.prefix = token.slice(0, indexOfColon + 1);
                    if (this.prefix.includes('(')) {
                        this.prefix = undefined;
                        valueToken = token;
                    } else {
                        valueToken = token.slice(indexOfColon + 1);
                    }
                }
            } else if (matching.origin === SYMBOL) {
                this.symbol = token[0];
                valueToken = token.slice(1);
            }

            valueTokens = [];
            let currentValueToken = '';
            let i = 0;
            (function analyze(end?, depth?, func: string = '') {
                let varIndex: number;
                let isString = false;
                if (end) {
                    if (end === ')' && currentValueToken.slice(-1) === '$') {
                        varIndex = currentValueToken.length - 1;
                    } else if (end === '\'') {
                        isString = true;
                    }

                    currentValueToken += valueToken[i++];
                }

                for (; i < valueToken.length; i++) {
                    const val = valueToken[i];
                    if (val === end) {
                        currentValueToken += val;
                        if (isString) {
                            let count = 0;
                            for (let j = currentValueToken.length - 2; ; j--) {
                                if (currentValueToken[j] !== '\\') {
                                    break;
                                }
                                count++;
                            }
                            if (count % 2) {
                                continue;
                            }
                        }

                        if (varIndex !== undefined) {
                            currentValueToken = currentValueToken.slice(0, varIndex) + currentValueToken.slice(varIndex).replace(/\$\((.*)\)/, 'var(--$1)');
                        }

                        if (!depth) {
                            if (isString) {
                                valueTokens.push(currentValueToken);
                            } else {
                                valueTokens.push({ value: currentValueToken });
                            }

                            func = '';
                            currentValueToken = '';
                        }

                        break;
                    } else if (!isString && val in START_SYMBOL) {
                        analyze(START_SYMBOL[val], depth === undefined ? 0 : depth + 1, func);
                    } else if (val === '|' && end !== '}' && (!isString || func === 'path')) {
                        if (!end) {
                            valueTokens.push({ value: currentValueToken });
                            currentValueToken = '';
                        } else {
                            currentValueToken += ' ';
                        }
                    } else {
                        if (!end) {
                            if (val === '.') {
                                if (isNaN(+valueToken[i + 1])) {
                                    break;
                                } else if (valueToken[i - 1] === '-') {
                                    currentValueToken += '0';
                                }
                            } else if (val === ',') {
                                valueTokens.push({ value: currentValueToken }, ',');
                                currentValueToken = '';
                                continue;
                            } else if (
                                val === '#'
                                && (currentValueToken || valueTokens.length && valueToken[i - 1] !== '|')
                                || selectorSymbols.includes(val)
                            ) {
                                break;
                            }

                            func += val;
                        }

                        currentValueToken += val;
                    }
                }
            })();

            if (currentValueToken) {
                valueTokens.push({ value: currentValueToken });
            }

            suffixToken = valueToken.slice(i);
        }

        // ::scrollbar -> ::-webkit-scrollbar
        if (suffixToken.includes(SCROLLBAR_PSEUDO)) {
            suffixToken = suffixToken.replace(scrollbarPseudoRegexp, WEBKIT_PSEUDO_PREFIX + SCROLLBAR);
        }
        // ::search -> ::-webkit-search
        if (suffixToken.includes(SEARCH_PSEUDO)) {
            suffixToken = suffixToken.replace(searchPseudoRegexp, WEBKIT_PSEUDO_PREFIX + SEARCH);
        }
        // ::slider-thumb -> ::-webkit-slider-thumb
        if (suffixToken.includes(SLIDER_THUMB_PSEUDO)) {
            suffixToken = suffixToken.replace(sliderThumbPseudoRegexp, WEBKIT_PSEUDO_PREFIX + SLIDER_THUMB);
        }
        // ::slider-runnable-track -> ::-webkit-slider-runnable-track
        if (suffixToken.includes(SLIDER_RUNNABLE_TRACK_PSEUDO)) {
            suffixToken = suffixToken.replace(sliderRunnableTrackPseudoRegexp, WEBKIT_PSEUDO_PREFIX + SLIDER_RUNNABLE_TRACK);
        }
        // ::meter -> ::-webkit-meter
        if (suffixToken.includes(METER_PSEUDO)) {
            suffixToken = suffixToken.replace(meterPseudoRegexp, WEBKIT_PSEUDO_PREFIX + METER);
        }
        // ::resizer -> ::-webkit-resizer
        if (suffixToken.includes(RESIZER_PSEUDO)) {
            suffixToken = suffixToken.replace(resizerPseudoRegexp, WEBKIT_PSEUDO_PREFIX + RESIZER);
        }
        // ::progress -> ::-webkit-progress
        if (suffixToken.includes(PROGRESS_PSEUDO)) {
            suffixToken = suffixToken.replace(progressPseudoRegexp, WEBKIT_PSEUDO_PREFIX + PROGRESS);
        }
        // :first -> :first-child
        if (suffixToken.includes(':first')) {
            suffixToken = suffixToken.replace(/:first(?![a-z-])/g, ':first-child');
        }
        // :last -> :last-child
        if (suffixToken.includes(':last')) {
            suffixToken = suffixToken.replace(/:last(?![a-z-])/g, ':last-child');
        }
        // :even -> :nth-child(2n)
        if (suffixToken.includes(':even')) {
            suffixToken = suffixToken.replace(/:even(?![a-z-])/g, ':nth-child(2n)');
        }
        // :odd -> :nth-child(odd)
        if (suffixToken.includes(':odd')) {
            suffixToken = suffixToken.replace(/:odd(?![a-z-])/g, ':nth-child(odd)');
        }
        // :nth( -> :nth-child(
        if (suffixToken.includes(':nth(')) {
            suffixToken = suffixToken.replace(/:nth\(/g, ':nth-child(');
        }

        // 2. !important
        if (suffixToken[0] === '!') {
            this.important = true;
            suffixToken = suffixToken.slice(1);
        }

        // 3. prefix selector
        this.prefixSelector = prefixToken
            ? transformSelectorUnderline(prefixToken)
            : '';

        // 4. suffix selector
        const suffixTokens = suffixToken.split('@');
        let suffixSelector = suffixTokens[0];
        if (suffixSelector) {
            suffixSelector = transformSelectorUnderline(suffixSelector);
            this.hasWhere = suffixSelector.includes(':where(');
            for (let i = 0; i < PRIORITY_SELECTORS.length; i++) {
                if (suffixSelector.includes(PRIORITY_SELECTORS[i])) {
                    this.prioritySelectorIndex = i;
                    break;
                }
            }
        }
        this.suffixSelector = suffixSelector;

        // 5. atTokens
        for (let i = 1; i < suffixTokens.length; i++) {
            const atToken = suffixTokens[i];
            if (atToken) {
                if (colorSchemes.includes(atToken)) {
                    this.colorScheme = atToken;
                } else if (
                    atToken === 'rtl'
                    || atToken === 'ltr'
                ) {
                    this.direction = atToken;
                } else {
                    let type: string;
                    let queryText;

                    const underscoreIndex = atToken.indexOf('_');
                    if (underscoreIndex !== -1) {
                        type = atToken.slice(0, underscoreIndex);
                        queryText = atToken.slice(underscoreIndex);
                    } else {
                        const leftBracketIndex = atToken.indexOf('(');
                        if (leftBracketIndex !== -1) {
                            type = atToken.slice(0, leftBracketIndex);
                            queryText = atToken.slice(leftBracketIndex);
                        }
                    }

                    if (!type) {
                        type = 'media';
                        const queryTexts = [];

                        this.media = {
                            token: atToken,
                            features: {}
                        };
                        const typeOrFeatureTokens = atToken.split('&');
                        for (const typeOrFeatureToken of typeOrFeatureTokens) {
                            if (
                                typeOrFeatureToken === 'all'
                                || typeOrFeatureToken === 'print'
                                || typeOrFeatureToken === 'screen'
                                || typeOrFeatureToken === 'speech'
                            ) {
                                this.media.type = typeOrFeatureToken;
                            } else if (typeOrFeatureToken === '🖨') {
                                this.media.type = 'print';
                            } else {
                                if (typeOrFeatureToken === 'landscape' || typeOrFeatureToken === 'portrait') {
                                    queryTexts.push('(orientation:' + typeOrFeatureToken + ')');
                                } else if (typeOrFeatureToken === MOTION || typeOrFeatureToken === REDUCED_MOTION) {
                                    queryTexts.push('(prefers-' + REDUCED_MOTION + ':'
                                        + (typeOrFeatureToken === MOTION ? 'no-preference' : REDUCE)
                                        + ')');
                                } else if (mediaQueries && typeOrFeatureToken in mediaQueries) {
                                    queryTexts.push(mediaQueries[typeOrFeatureToken]);
                                } else {
                                    const feature: MasterCSSMediaFeatureRule = {
                                        token: typeOrFeatureToken
                                    }
                                    let featureName = '';
                                    let extremumOperator = '';
                                    let correction = 0;
                                    if (typeOrFeatureToken.startsWith('<=')) {
                                        extremumOperator = '<=';
                                        featureName = MAX_WIDTH;
                                    } else if (typeOrFeatureToken.startsWith('>=') || breakpoints[typeOrFeatureToken]) {
                                        extremumOperator = '>=';
                                        featureName = MIN_WIDTH;
                                    } else if (typeOrFeatureToken.startsWith('>')) {
                                        extremumOperator = '>';
                                        featureName = MIN_WIDTH;
                                        correction = .02;
                                    } else if (typeOrFeatureToken.startsWith('<')) {
                                        extremumOperator = '<';
                                        featureName = MAX_WIDTH;
                                        correction = -.02;
                                    }
                                    switch (featureName) {
                                        case MAX_WIDTH:
                                        case MIN_WIDTH:
                                            const conditionUnitValueToken
                                                = extremumOperator
                                                    ? typeOrFeatureToken.replace(extremumOperator, '')
                                                    : typeOrFeatureToken;
                                            const breakpoint = breakpoints[conditionUnitValueToken];
                                            if (breakpoint) {
                                                Object.assign(feature, parseValue(breakpoint, PX));
                                            } else {
                                                Object.assign(feature, parseValue(conditionUnitValueToken, PX));
                                            }
                                            if (feature.unit === PX) {
                                                feature.value += correction;
                                            }
                                            this.media.features[featureName] = feature;
                                            queryTexts.push('(' + featureName + ':' + (feature.value + feature.unit) + ')');
                                            break;
                                    }
                                }
                            }
                        }

                        queryText = '';
                        if (this.media.type) {
                            queryText = this.media.type;
                        }
                        if (queryTexts.length) {
                            queryText += (queryText ? ' and ' : '') + queryTexts.join(' and ');
                        }
                    }

                    if (queryText) {
                        this.at[type] = (type in this.at
                            ? this.at[type] + ' and '
                            : '')
                            + queryText.replace(/\_/g, ' ');
                    }
                }
            }
        }

        // 6. order
        if (this.order === undefined) {
            // @ts-ignore
            this.order = 0;
        }

        // 7. value
        const insertNewNative = (theme: string, bypassWhenUnmatchColor: boolean) => {
            let newValue: string | Record<string, string | number>, newUnit: string;

            const generateCssText = (
                propertiesText: string,
                theme: string
            ) => {
                let prefixText = '';
                if (this.prefixSelector) {
                    prefixText += this.prefixSelector;
                }
                if (this.direction) {
                    prefixText += '[dir=' + this.direction + '] ';
                }

                let cssText = 
                    (theme ? '.' + theme + ' ' : '')
                    + prefixText
                    + '.'
                    + CSS.escape(this.name)
                    + this.suffixSelector
                    + (relationThemesMap
                        ? Object
                            .entries(relationThemesMap)
                            .filter(() => !this.getThemeProps)
                            .map(([theme, classNames]) => classNames.reduce((a, className) => a + ', ' + ((!colorful && theme) ? '.' + theme + ' ' : '') + prefixText + '.' + CSS.escape(className) + this.suffixSelector, ''))
                            .join('')
                        : '')
                    + '{'
                    + propertiesText
                    + '}';
            
                for (const key of Object.keys(this.at).sort((a, b) => b === 'supports' ? -1 : 1)) {
                    cssText = '@' + key + ' ' + this.at[key] + '{' + cssText + '}';
                }
            
                return cssText;
            };

            const newValueTokens: string[] = [];
            if (valueTokens) {
                let uv;

                for (const eachValueToken of valueTokens) {
                    if (typeof eachValueToken === 'string') {
                        newValueTokens.push(eachValueToken);
                    } else {
                        uv = parseValue(eachValueToken.value, unit, colorsThemesMap, values, rootSize, theme, bypassWhenUnmatchColor);
                        if (!uv)
                            return;
    
                        newValueTokens.push(uv.value + uv.unit);
                    }
                }
    
                if (newValueTokens.length === 1) {
                    if (uv) {
                        newValue = uv.value;
                        newUnit = uv.unit;
                    } else {
                        newValue = newValueTokens[0];
                    }
                } else {
                    newValue = newValueTokens.reduce((previousVal, currentVal, i) => previousVal + currentVal + ((currentVal === ',' || valueTokens[i + 1] === ',' || i === valueTokens.length - 1) ? '' : ' '), '');
                }

                if (typeof newValue !== 'object') {
                    // 7. parseValue
                    if (this.parseValue) {
                        newValue = this.parseValue(newValue);
                    }

                    // 8. transform value
                    if (colorful && newValue === 'current') {
                        newValue = 'currentColor';
                    } else if (values && newValue in values) {
                        newValue = values[newValue].toString();
                    }

                    const propertyInfo = { unit: newUnit, value: newValue, important: this.important };
                    if (this.getThemeProps) {
                        const themeProps = this.getThemeProps(propertyInfo, css);
                        for (const theme in themeProps) {
                            this.natives.push({ 
                                unit: newUnit, 
                                value: newValue, 
                                text: generateCssText(
                                    Object
                                        .entries(themeProps[theme])
                                        .map(([propertyName, propertyValue]) => getCssPropertyText(propertyName, {
                                            important: this.important,
                                            unit: '',
                                            value: propertyValue
                                        }))
                                        .join(';'),
                                    theme
                                ), 
                                theme 
                            });
                        }
                        return;
                    } else if (this.getProps) {
                        newValue = this.getProps(propertyInfo);
                        console.log(newValue, propertyInfo);
                    }
                }
            } else {
                newValue = value;
            }

            this.natives.push({ 
                unit: newUnit, 
                value: newValue, 
                text: generateCssText(
                    typeof newValue === 'object'
                        ? Object
                            .entries(newValue)
                            .map(([propertyName, propertyValue]) => getCssPropertyText(propertyName, {
                                ...(typeof propertyValue === 'object' 
                                    ? propertyValue
                                    : { unit: '', value: propertyValue }),
                                important: this.important
                            }))
                            .join(';')
                        : getCssPropertyText(propName, { unit: newUnit, value: newValue, important: this.important }),
                    theme
                ), 
                theme 
            });
        };

        if (this.getThemeProps) {
            insertNewNative(undefined, false);
        } else if (this.colorScheme) {
            insertNewNative(this.colorScheme, false);
        } else if (colorful) {
            for (const eachTheme of colorSchemes) {
                insertNewNative(eachTheme, true);
            }
        } else {
            insertNewNative('', false);
        }
        
        console.log(this);
    }
}

export interface MasterCSSRule {
    readonly order?: number;

    parseValue(value: string): string;
    getProps(propertyInfo: CssPropertyInfo): Record<string, any>;
    getThemeProps(propertyInfo: CssPropertyInfo, css: MasterCSS): Record<string, Record<string, string>>;
}

if (typeof window !== 'undefined') {
    window.MasterCSSRule = MasterCSSRule;
}

declare global {
    interface Window {
        MasterCSSRule: typeof MasterCSSRule;
    }
}