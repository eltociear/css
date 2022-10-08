import { TRANSITION } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class Transition extends MasterCSSRule {
    static override symbol = '~'; 
    static override propName = TRANSITION;
    override order = -1;
}