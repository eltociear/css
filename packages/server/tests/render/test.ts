import { render } from '../../src'

test('basic', () => {
    expect(
        render('<html class="bg:white"><div class="text:center"></div></html>').html
    ).toEqual(
        '<html class="bg:white"><head><style id="master">.bg\\:white{background-color:rgb(255 255 255)}.text\\:center{text-align:center}</style></head><div class="text:center"></div></html>'
    )
})