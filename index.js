const config = require('config')
const { spawn } = require('child_process')

// config
const srcPath = config.get('srcPath')

const prefilter = spawn('tippecanoe', [
  '--force',
  '--output=dummy.mbtiles',
  '--simplification=2',
  '--maximum-zoom=6',
  '--full-detail=26',
  '--no-feature-limit',
  '--no-tile-size-limit',
  '--prefilter=node prefilter.js $1 $2 $3',
  srcPath
], { stdio: 'inherit' })
