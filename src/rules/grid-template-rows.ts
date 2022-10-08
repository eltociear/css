import { CONTENT, dash, GRID, MAX, MIN, ROWS, TEMPLATE } from '../constants/css-property-keyword';
import { MasterCSSRule } from '../rule';

export class GridTemplateRows extends MasterCSSRule {
    static override propName = dash(GRID, TEMPLATE, ROWS);
}