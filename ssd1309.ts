/**
 * Bits4Bots SSD1309 OLED Extension
 * Based on SSD1306 drivers (Tinkertanker, Adafruit)
 * Extended for SSD1309 with ASCII font support
 * Company: Bits4Bots
 */

//% color=#00CACA icon="\uf26c" block="Bits4Bots OLED"
namespace bits4botsOLED {
    const SSD1309_I2C_ADDR = 0x3C
    let screenBuffer = pins.createBuffer(1025) // 128x64/8 + 1
    let initialized = false

    // 5x8 font (ASCII 0x20 to 0x7F)
    const font: number[][] = [
        [0x00,0x00,0x00,0x00,0x00], // 0x20 space
        [0x00,0x00,0x5F,0x00,0x00], // !
        [0x00,0x07,0x00,0x07,0x00], // "
        [0x14,0x7F,0x14,0x7F,0x14], // #
        [0x24,0x2A,0x7F,0x2A,0x12], // $
        [0x23,0x13,0x08,0x64,0x62], // %
        [0x36,0x49,0x55,0x22,0x50], // &
        [0x00,0x05,0x03,0x00,0x00], // '
        [0x00,0x1C,0x22,0x41,0x00], // (
        [0x00,0x41,0x22,0x1C,0x00], // )
        // ... continue through 0x7F (printable ASCII)
    ]

    function cmd(c: number) {
        let buf = pins.createBuffer(2)
        buf[0] = 0x00
        buf[1] = c
        pins.i2cWriteBuffer(SSD1309_I2C_ADDR, buf)
    }

    function init() {
        if (initialized) return
        screenBuffer[0] = 0x40

        cmd(0xAE) // display off
        cmd(0x20) // set memory addressing mode
        cmd(0x00) // horizontal addressing
        cmd(0xB0) // page start address
        cmd(0xC8) // COM scan direction
        cmd(0x00) // low column
        cmd(0x10) // high column
        cmd(0x40) // start line address
        cmd(0x81) // contrast
        cmd(0x7F)
        cmd(0xA1) // segment remap
        cmd(0xA6) // normal display
        cmd(0xA8) // multiplex
        cmd(0x3F)
        cmd(0xA4) // display follows RAM
        cmd(0xD3) // display offset
        cmd(0x00)
        cmd(0xD5) // display clock divide
        cmd(0xF0)
        cmd(0xD9) // pre-charge
        cmd(0x22)
        cmd(0xDA) // com pins
        cmd(0x12)
        cmd(0xDB) // vcomh
        cmd(0x20)
        cmd(0x8D) // charge pump
        cmd(0x14)
        cmd(0xAF) // display ON
        clear()
        show()
        initialized = true
    }

    //% block="clear OLED"
    export function clear() {
        init()
        for (let i = 1; i < 1025; i++) screenBuffer[i] = 0
    }

    //% block="show OLED"
    export function show() {
        init()
        for (let page = 0; page < 8; page++) {
            cmd(0xB0 + page)
            cmd(0x00)
            cmd(0x10)
            let buf = screenBuffer.slice(page * 128 + 1, 128)
            pins.i2cWriteBuffer(SSD1309_I2C_ADDR, buf)
        }
    }

    //% block="print text %text at x %x y %y"
    export function print(text: string, x: number, y: number) {
        init()
        for (let i = 0; i < text.length; i++) {
            let c = text.charCodeAt(i)
            if (c < 0x20 || c > 0x7F) c = 0x20
            drawChar(x + i * 6, y, font[c - 0x20])
        }
    }

    function drawChar(x: number, y: number, charData: number[]) {
        for (let col = 0; col < 5; col++) {
            let line = charData[col]
            for (let row = 0; row < 8; row++) {
                if (line & (1 << row)) setPixel(x + col, y + row, 1)
                else setPixel(x + col, y + row, 0)
            }
        }
    }

    function setPixel(x: number, y: number, color: number) {
        if (x < 0 || x >= 128 || y < 0 || y >= 64) return
        let page = y >> 3
        let index = 1 + x + page * 128
        let mask = 1 << (y & 7)
        if (color) screenBuffer[index] |= mask
        else screenBuffer[index] &= ~mask
    }
}
