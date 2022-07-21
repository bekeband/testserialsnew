
const express = require('express');
const app = express();

const { SerialPort, ReadlineParser, SerialPortMock } = require('serialport')
const { SerialPortStream } = require('@serialport/stream')
const { PacketLengthParser } = require('@serialport/parser-packet-length')

const path = '/dev/example'
SerialPortMock.binding.createPort(path)

// Create a port and enable the echo and recording.
SerialPortMock.binding.createPort('/dev/ROBOT', { echo: true, record: true })

const port = new SerialPortStream({ binding: SerialPortMock.binding, path: '/dev/ROBOT', baudRate: 14400 })

//const port = new SerialPortMock({ path, baudRate: 9600 })
//const port = new SerialPort({ path :'COM1', baudRate: 9600})
const Parser = new ReadlineParser()

const LengthParser = new PacketLengthParser({
  delimiter: 0xbc,
  packetOverhead: 5,
  lengthBytes: 2,
  lengthOffset: 2,
})

port.pipe(LengthParser)
Parser.on('data', console.log)

// ROBOT ONLINE

app.get('/', (req,res) => {

  port.write('ROBOT PLEASE RESPOND\n')
  res.send("Hello");
});

app.listen(process.env.port || 3000);
console.log('Web Server is listening at port '+ (process.env.port || 3000));