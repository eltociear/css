import { ANIMATION, dash, DURATION } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class AnimationDuration extends MasterCSSRule {
    static override matches = /^\@duration:./;
    static override propName = dash(ANIMATION, DURATION);
    static override unit = 'ms';
}