import { AUTO, dash, FLOW, GRID } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class GridAutoFlow extends MasterCSSRule {
    static override matches = /^grid-flow:./;
    static override propName = dash(GRID, AUTO, FLOW);
}