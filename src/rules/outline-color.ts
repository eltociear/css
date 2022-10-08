import { COLOR, dash, OUTLINE } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class OutlineColor extends MasterCSSRule {
    static override propName = dash(OUTLINE, COLOR);
    static override colorStarts = 'outline:';
    static override colorful = true;
}