# Third-party software

Dependencies retain their respective licenses. The generated native workspace bundles React and Mozilla PDF.js; they contain no learner records. PDF.js is Apache-2.0 licensed; its license is retained in [licenses/pdfjs-dist-LICENSE](licenses/pdfjs-dist-LICENSE).

`scripts/build-widget.mjs` generates the private app's self-contained resource from reviewed application source and installed dependencies. It compresses the PDF worker and native UI so they need no external CDN. PDF processing uses the original uploaded bytes, disables XFA, and requests no remote font, CMap, or WebAssembly resources. Some complex fonts, scanned pages, encrypted PDFs, and advanced image encodings require a different authorized source workflow.
