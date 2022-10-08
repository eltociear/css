import { ANIMATION } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class Animation extends MasterCSSRule {
    static override symbol = '@'; 
    static override propName = ANIMATION;
    static override unit = '';
    override order = -1;
}