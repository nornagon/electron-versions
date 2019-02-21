const pacote = require('pacote')
const electronDownload = require('electron-download')
const semver = require('semver')
const extractZip = require('extract-zip')
const tmp = require('tmp')
const rimraf = require('rimraf')
const path = require('path')
const { spawn } = require('child_process')
const os = require('os')

function getExePath() {
  var platform = process.env.npm_config_platform || os.platform()

  switch (platform) {
    case 'darwin':
      return 'Electron.app/Contents/MacOS/Electron'
    case 'freebsd':
    case 'linux':
      return 'electron'
    case 'win32':
      return 'electron.exe'
    default:
      throw new Error('Electron builds are not available on platform: ' + platform)
  }
}

async function main() {
  const x = await pacote.packument('electron')
  const byMajor = {}
  const versions = Object.keys(x.versions).filter(v => semver.satisfies(v, '>= 2'))
  versions.forEach(v => {
    const major = semver.major(v)
    if (!(major in byMajor) || (major in byMajor) && semver.gt(v, byMajor[major])) {
      byMajor[major] = v
    }
  })
  const versionData = await Promise.all(Object.values(byMajor).map(async (v) => {
    const zipPath = await new Promise((resolve, reject) => electronDownload({
      version: v,
      quiet: true,
    }, (err, zipPath) => {
      if (err) reject(err)
      else resolve(zipPath)
    }))
    const tmpDir = tmp.dirSync()
    try {
      await new Promise((resolve, reject) => extractZip(zipPath, { dir: tmpDir.name }, (err) => {
        if (err) reject(err)
        else resolve()
      }))
      const exePath = path.join(tmpDir.name, getExePath())
      return await new Promise((resolve, reject) => {
        const child = spawn(
          exePath,
          ['-e', 'process.stdout.write(JSON.stringify({"process.versions": process.versions}))'],
          { env: { ELECTRON_RUN_AS_NODE: '1' } }
        )
        let stdout = ''
        let stderr = ''
        child.stderr.on('data', (data) => {
          stderr += data.toString('utf8')
        })
        child.stdout.on('data', (data) => {
          stdout += data.toString('utf8')
        })
        child.on('close', (code) => {
          if (code === 0) resolve({electron_version: v, dep_versions: JSON.parse(stdout)})
          else reject(stderr)
        })
      })
    } finally {
      await new Promise(resolve => rimraf(tmpDir.name, err => err ? reject(err) : resolve()))
    }
  }))
  console.log(JSON.stringify(versionData.reduce((m, o) => ({...m, [o.electron_version]: o.dep_versions}), {}), null, 2))
}
main()
