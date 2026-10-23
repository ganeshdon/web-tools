# Free website tools for SEO and performance

Small, dependency-free browser tools from [Billion Web Studio](https://billionwebstudio.com/), a website development company. Everything runs client-side; nothing is sent to a server.

**Live site:** https://ganeshdon.github.io/web-tools/

| Tool | What it does | Live |
| --- | --- | --- |
| SERP snippet preview | Previews how a Google result could show your title tag and meta description on desktop and mobile, measured in pixels, with plain fixes | [Open](https://ganeshdon.github.io/web-tools/serp-snippet-preview/) |
| Core Web Vitals gauges | Interactive LCP, INP and CLS gauges using Google's published thresholds (web.dev), with what to fix for each band | [Open](https://ganeshdon.github.io/web-tools/core-web-vitals-gauges/) |
| Search to enquiry hero | A hero animation in pure HTML, CSS and JS that follows a buyer from a search to a sent enquiry; respects `prefers-reduced-motion` | [Open](https://ganeshdon.github.io/web-tools/search-to-lead-hero/) |

## Run locally

Open any tool's `index.html` in a browser. There is no build step and no dependencies.

## Notes

- Pixel widths in the SERP preview are a guide. Google does not publish a fixed limit and rewrites many titles.
- Core Web Vitals thresholds follow [web.dev](https://web.dev/articles/vitals): LCP 2.5 s / 4 s, INP 200 ms / 500 ms, CLS 0.1 / 0.25. A page passes only when all three are good at the 75th percentile of real visits.

## About

Billion Web Studio builds fast, SEO ready websites that win leads for businesses in the USA, the UK, the UAE, Canada, Australia and India. See the [case studies](https://billionwebstudio.com/case-studies).

## License

MIT
