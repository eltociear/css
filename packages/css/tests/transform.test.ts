import { testProp } from '../src/utils/test-css'

test('transform', () => {
    testProp('translate(16)', 'transform:translate(1rem)')
})