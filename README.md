# electron-versions

Get version information about Electron releases.

electron-version downloads the latest versions of Electron and executes them,
fetching the value of `process.versions`.

#### usage

```
$ npx electron-versions
{
  "2.0.17": {
    "process.versions": {
      "http_parser": "2.7.0",
      "node": "8.9.3",
      "v8": "6.1.534.41",
      "uv": "1.15.0",
      "zlib": "1.2.11",
      "ares": "1.10.1-DEV",
      "modules": "57",
      "nghttp2": "1.25.0",
      "openssl": "1.0.2n"
    }
  },
  "3.1.4": {
    "process.versions": {
      "http_parser": "2.8.0",
      "node": "10.2.0",
      "v8": "6.6.346.32",
      "uv": "1.20.3",
      "zlib": "1.2.11",
      "ares": "1.14.0",
      "modules": "64",
      "nghttp2": "1.29.0",
      "napi": "3",
      "openssl": "1.1.0h"
    }
  },
  "4.0.5": {
    "process.versions": {
      "http_parser": "2.8.0",
      "node": "10.11.0",
      "v8": "6.9.427.24-electron.0",
      "uv": "1.23.0",
      "zlib": "1.2.11",
      "ares": "1.14.0",
      "modules": "69",
      "nghttp2": "1.33.0",
      "napi": "3",
      "openssl": "1.1.0",
      "icu": "62.1",
      "unicode": "11.0",
      "cldr": "33.1",
      "tz": "2018e"
    }
  }
}
```
