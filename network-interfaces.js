#!/usr/bin/env node

const os = require('os')

let newline, inter, family, field

for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i]

  switch (arg) {
    case '--help':
      console.log('Usage: network-interfaces [options] [arguments]')
      console.log()
      console.log('Arguments:')
      console.log('    interface  Network interface name')
      console.log('    address    Address to retrieve, ip (default) or mac')
      console.log()
      console.log('Options:')
      console.log('    -4         Return IPv4 address (default)')
      console.log('    -6         Return IPv6 address')
      console.log('    -n         Do not output trailing newline')
      console.log()
      console.log('Examples:')
      console.log('    network-interfaces -6 eth0 ip')
      console.log('    network-interfaces -4 -n wlan mac')
      process.exit(0)
      break
    case '-4':
      family = 'IPv4'
      break
    case '-6':
      family = 'IPv6'
      break
    case '-n':
      newline = false
      break
    case 'ip':
      field = arg
      break
    case 'mac':
      field = arg
      break
    default:
      inter = arg
  }
}

const networkInterfaces = os.networkInterfaces()

if (!inter) {
  inter = Object.keys(networkInterfaces)
    .find(i => networkInterfaces[i]
      .some(entry => !entry.internal))
}

if (!family) family = 'IPv4'
if (!field) field = 'ip'

switch (field.toLowerCase()) {
  case 'ip':
    field = 'address'
    break
  case 'mac':
    field = 'mac'
    break
}

const value = networkInterfaces[inter]
  ?.filter(entry => !entry.internal && entry.family === family)
  .map(entry => entry[field])
  .join(os.EOL)

if (value) process.stdout.write(value + (newline === false ? '' : os.EOL))
