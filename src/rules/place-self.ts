import { dash, PLACE, SELF } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class PlaceSelf extends MasterCSSRule {
    static override propName = dash(PLACE, SELF);
    override order = -1;
}