import { BREAK, dash, WORD } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class WordBreak extends MasterCSSRule {
    static override propName = dash(WORD, BREAK);
    static override unit = '';
}