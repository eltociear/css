import { testProp } from './css'

test('outline', () => {
    testProp('outline:current', 'outline-color:currentColor')
    testProp('outline:transparent', 'outline-color:transparent')
    testProp('outline:black', 'outline-color:rgb(0 0 0)')
    testProp('outline:2|black', 'outline:0.125rem rgb(0 0 0) solid')
    testProp('outline-offset:1', 'outline-offset:0.0625rem')
    testProp('outline:1', 'outline-width:0.0625rem')
    testProp('outline:dashed|black', 'outline:dashed #000000')
    testProp('outline:solid', 'outline-style:solid')
    testProp('outline:1rem|solid', 'outline:1rem solid')
    testProp('outline:thick|double|black', 'outline:thick double #000000')
    testProp('outline:none', 'outline-style:none')
    testProp('outline:unset', 'outline:unset')
    testProp('outline:inherit', 'outline:inherit') 
    testProp('outline:initial', 'outline:initial')
    testProp('outline:revert', 'outline:revert')
    testProp('outline:revert-layer', 'outline:revert-layer')
    testProp('outline:auto', 'outline-style:auto')
    testProp('outline:auto|1', 'outline:auto 0.0625rem')
})
