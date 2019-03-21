const config = require('config')
const modify = require(config.get('modifyPath'))
const readline = require('readline')
const { spawn } = require('child_process')
const tilebelt = require('@mapbox/tilebelt')

const mbtilesDir = config.get('mbtilesDir')

const zxy = process.argv.slice(2, 5).map(v => parseInt(v))
console.error(`${new Date().toISOString()}: ${zxy.join('/')}`)

const rl = readline.createInterface({ input: process.stdin })
if (zxy[0] === 6) {
  const bbox = tilebelt.tileToBBOX([zxy[1], zxy[2], zxy[0]])
  const tippecanoe = spawn('tippecanoe', [
    '--force',
    `--output=${mbtilesDir}/${zxy.join('-')}.mbtiles`,
    '--simplification=2',
    '--minimum-zoom=6',
    '--maximum-zoom=15',
    '--hilbert',
    `--clip-bounding-box=${bbox.join(',')}`
  ], { stdin: 'pipe', stdout: 'inherit', stderr: 'inherit' })

  rl.on('line', line => {
    rl.pause()
    let f = modify(JSON.parse(line))
    if (f) {
      tippecanoe.stdin.write(JSON.stringify(f) + '\n')
    }
    rl.resume()
  })
  rl.on('close', () => {
    tippecanoe.stdin.end()
    process.stdout.end('\n')
  })
} else {
  rl.on('close', () => {
    process.stdout.end('\n')
  })
}
