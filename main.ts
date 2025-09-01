// Bits4Bots Robotics Extension
// Author: Bits4Bots
// Credits: Adapted from TM1637, OLED SSD1309, and common micro:bit robotics examples
// License: MIT

namespace bits4bots {

    // --------------------
    // TT Motor Driver
    // --------------------
    // Assume 2-pin control per motor
    //% block="set motor %motor | direction %dir"
    //% motor.shadow="dropdown"
    //% motor.options="Left,Right"
    //% dir.shadow="dropdown"
    //% dir.options="Forward,Backward,Stop"
    //% color=#ff6666
    export function motor(motor: string, dir: string) {
        if (motor == "Left") {
            if (dir == "Forward") {
                pins.digitalWritePin(DigitalPin.P0, 1)
                pins.digitalWritePin(DigitalPin.P1, 0)
            } else if (dir == "Backward") {
                pins.digitalWritePin(DigitalPin.P0, 0)
                pins.digitalWritePin(DigitalPin.P1, 1)
            } else {
                pins.digitalWritePin(DigitalPin.P0, 0)
                pins.digitalWritePin(DigitalPin.P1, 0)
            }
        } else if (motor == "Right") {
            if (dir == "Forward") {
                pins.digitalWritePin(DigitalPin.P8, 1)
                pins.digitalWritePin(DigitalPin.P12, 0)
            } else if (dir == "Backward") {
                pins.digitalWritePin(DigitalPin.P8, 0)
                pins.digitalWritePin(DigitalPin.P12, 1)
            } else {
                pins.digitalWritePin(DigitalPin.P8, 0)
                pins.digitalWritePin(DigitalPin.P12, 0)
            }
        }
    }

    // --------------------
    // Servo Control
    // --------------------
    //% block="set servo at pin %pin | angle %angle"
    //% angle.min=0 angle.max=180
    //% color=#66ccff
    export function servo(pin: AnalogPin, angle: number) {
        pins.servoWritePin(pin, angle)
    }

    // --------------------
    // PIR Motion Sensor
    // --------------------
    //% block="PIR motion detected on pin %pin"
    //% color=#66ff66
    export function pirDetected(pin: DigitalPin): boolean {
        return pins.digitalReadPin(pin) == 1
    }

    // --------------------
    // Traffic Light Control
    // --------------------
    //% block="set traffic light %light | state %onoff"
    //% light.shadow="dropdown"
    //% light.options="Red,Yellow,Green"
    //% onoff.shadow="toggleOnOff"
    //% color=#ffcc00
    export function trafficLight(light: string, onoff: boolean) {
        if (light == "Red") pins.digitalWritePin(DigitalPin.P13, onoff ? 1 : 0)
        else if (light == "Yellow") pins.digitalWritePin(DigitalPin.P14, onoff ? 1 : 0)
        else if (light == "Green") pins.digitalWritePin(DigitalPin.P15, onoff ? 1 : 0)
    }

}
