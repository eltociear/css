import { CONTENT, dash, PLACE } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class PlaceContent extends MasterCSSRule {
    static override propName = dash(PLACE, CONTENT);
    override order = -1;
}