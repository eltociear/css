import { MasterCSSRule } from '../rule';
import { BACKGROUND, BLEND, dash, MODE } from '../constants/css-property-keyword';

export class BackgroundBlendMode extends MasterCSSRule {
    static override propName = dash(BACKGROUND , BLEND , MODE);
}