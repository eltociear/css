import { testCSS } from '../src/utils/test-css'

test('display', () => {
    testCSS('flex', '.flex{display:flex}')
    testCSS('flex@sm', '@media (min-width:768px){.flex\\@sm{display:flex}}')
})