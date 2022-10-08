import { MIN_WIDTH } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class MinWidth extends MasterCSSRule {
    static override matches = /^min-w:./;
    static override propName = MIN_WIDTH;
}