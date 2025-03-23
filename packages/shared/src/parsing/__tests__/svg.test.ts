import { describe, expect, it } from 'vitest'
import { extractElement, extractSVG, parseSVG, SVGParseResult } from '../svg'

describe('SVG parsing', () => {
  describe('extractElement', () => {
    it('should extract a complete element', () => {
      const content = '<div>Some content</div>'
      const result = extractElement(content, 'div')
      expect(result).toBe(content)
    })

    it('should extract an element with attributes', () => {
      const content = '<div class="test" id="myDiv">Some content</div>'
      const result = extractElement(content, 'div')
      expect(result).toBe(content)
    })

    it('should return null if element is not found', () => {
      const content = '<div>Some content</div>'
      const result = extractElement(content, 'span')
      expect(result).toBeNull()
    })

    it('should extract nested elements correctly', () => {
      const content = '<div><span>Nested</span> content</div>'
      const result = extractElement(content, 'div')
      expect(result).toBe(content)
    })
  })

  describe('extractSVG', () => {
    it('should extract an SVG from content', () => {
      const svg = '<svg width="100" height="100"><circle cx="50" cy="50" r="40" /></svg>'
      const content = `Some text before ${svg} and some text after`
      const result = extractSVG(content)
      expect(result).toBe(svg)
    })

    it('should return null if no SVG is found', () => {
      const content = 'No SVG here, just plain text'
      const result = extractSVG(content)
      expect(result).toBeNull()
    })

    it('should extract SVG with multiple elements and attributes', () => {
      const svg =
        '<svg viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="40" /><rect x="10" y="10" width="30" height="30" /></svg>'
      const content = svg
      const result = extractSVG(content)
      expect(result).toBe(svg)
    })
  })

  describe('parseSVG', () => {
    it('should successfully parse valid SVG', () => {
      const svg =
        '<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toBeDefined()
        expect(result.data.width).toBe('100')
        expect(result.data.height).toBe('100')
        expect(result.data.viewBox).toBe('0 0 100 100')
      }
    })

    it('should sanitize SVG by removing script tags', () => {
      const svg =
        '<svg width="100" height="100"><script>alert("XSS")</script><circle cx="50" cy="50" r="40" /></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).not.toContain('<script>')
        expect(result.data.svg).toContain('<circle')
      }
    })

    it('should sanitize SVG by removing event handlers', () => {
      const svg =
        '<svg width="100" height="100"><circle cx="50" cy="50" r="40" onclick="alert(\'clicked\')" /></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).not.toContain('onclick')
      }
    })

    it('should sanitize malicious URLs in SVG', () => {
      const svg =
        '<svg width="100" height="100"><a href="javascript:alert(\'XSS\')"><text x="10" y="20">Click me</text></a></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).not.toContain('javascript:alert')
        expect(result.data.svg).toContain('about:blank')
      }
    })

    it('should handle SVG with XML namespaces', () => {
      const svg =
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100"><circle cx="50" cy="50" r="40" /></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('xmlns="http://www.w3.org/2000/svg"')
        expect(result.data.svg).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"')
        expect(result.data.width).toBe('100')
        expect(result.data.height).toBe('100')
      }
    })

    it('should detect incomplete SVG', () => {
      const svg = '<svg width="100" height="100"><circle cx="50" cy="50" r="40" />'
      const result = parseSVG(svg)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.message).toBe('Incomplete SVG')
      }
    })

    it('should report when no SVG is found', () => {
      const content = 'No SVG here, just plain text'
      const result = parseSVG(content)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.message).toBe('No SVG found in content')
      }
    })

    it('should handle SVG without size attributes', () => {
      const svg = '<svg><circle cx="50" cy="50" r="40" /></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.width).toBeUndefined()
        expect(result.data.height).toBeUndefined()
        expect(result.data.viewBox).toBeUndefined()
      }
    })

    it('should handle multi-line SVG content', () => {
      const svg = `<svg 
        width="100" 
        height="100" 
        viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="red" />
          <rect
            x="10"
            y="10"
            width="30"
            height="30"
            fill="blue" />
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('<circle')
        expect(result.data.svg).toContain('<rect')
        expect(result.data.width).toBe('100')
        expect(result.data.height).toBe('100')
        expect(result.data.viewBox).toBe('0 0 100 100')
      }
    })

    it('should sanitize multi-line SVG with malicious content', () => {
      const svg = `<svg
        width="100"
        height="100">
          <script>
            alert('XSS attack');
            document.cookie = 'stolen=yes';
          </script>
          <circle
            cx="50"
            cy="50"
            r="40"
            onclick="javascript:alert('click')"
            onmouseover="javascript:alert('hover')" />
          <a 
            href="javascript:
              alert('malicious link');
              fetch('/api/data').then(r => r.json());
            ">
            <text x="10" y="20">Click me</text>
          </a>
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).not.toContain('<script>')
        expect(result.data.svg).not.toContain('alert')
        expect(result.data.svg).not.toContain('onclick')
        expect(result.data.svg).not.toContain('onmouseover')
        expect(result.data.svg).not.toContain('javascript:')
        expect(result.data.svg).toContain('<circle')
        expect(result.data.svg).toContain('<text')
      }
    })

    it('should preserve valid href attributes', () => {
      const svg = `<svg width="100" height="100">
        <a href="https://example.com" target="_blank">
          <text x="10" y="20">Valid Link</text>
        </a>
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('href="https://example.com"')
        expect(result.data.svg).toContain('<text')
      }
    })

    it('should preserve valid xlink:href in use elements', () => {
      const svg = `<svg width="100" height="100" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <circle id="myCircle" cx="50" cy="50" r="40" fill="red" />
        </defs>
        <use xlink:href="#myCircle" x="10" y="10" />
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('xlink:href="#myCircle"')
      }
    })

    it('should handle SVG with valid internal url references', () => {
      const svg = `<svg width="100" height="100">
        <defs>
          <linearGradient id="gradient">
            <stop offset="0%" stop-color="blue" />
            <stop offset="100%" stop-color="red" />
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="80" height="80" fill="url(#gradient)" />
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('fill="url(#gradient)"')
      }
    })

    it('should sanitize malicious xlink:href in use elements', () => {
      const svg = `<svg width="100" height="100" xmlns:xlink="http://www.w3.org/1999/xlink">
        <use xlink:href="https://evil.com/malicious.svg" />
        <use xlink:href="//cdn.evil.com/bad.svg" />
        <use xlink:href="#valid-local-ref" />
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).not.toContain('xlink:href="https://evil.com/malicious.svg"')
        expect(result.data.svg).not.toContain('xlink:href="//cdn.evil.com/bad.svg"')
        expect(result.data.svg).toContain('xlink:href="#valid-local-ref"')
        expect(result.data.svg).toContain('xlink:href="about:blank"')
      }
    })

    it('should sanitize external URL references but preserve internal ones', () => {
      const svg = `<svg width="100" height="100">
        <rect fill="url(https://evil.com/gradient.svg)" x="10" y="10" width="30" height="30" />
        <rect fill="url(//evil.com/gradient)" x="50" y="10" width="30" height="30" />
        <rect fill="url(#valid-gradient)" x="90" y="10" width="30" height="30" />
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).not.toContain('url(https://evil.com/gradient.svg)')
        expect(result.data.svg).not.toContain('url(//evil.com/gradient)')
        expect(result.data.svg).toContain('url(#valid-gradient)')
        expect(result.data.svg).toContain('url(#removed)')
      }
    })

    it('should sanitize dangerous data URLs but preserve valid image data URLs', () => {
      const svg = `<svg width="100" height="100">
        <image href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==" />
        <image href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==" />
        <image href="data:application/javascript;base64,YWxlcnQoMSk=" />
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('data:image/png;base64,')
        expect(result.data.svg).not.toContain('data:text/html')
        expect(result.data.svg).not.toContain('data:application/javascript')
        expect(result.data.svg).toContain('about:blank')
      }
    })

    it('should set wasSanitized flag to true when sanitization occurs', () => {
      const maliciousSvg = `<svg width="100" height="100">
        <script>alert('XSS');</script>
        <circle cx="50" cy="50" r="40" onclick="alert('click')" />
      </svg>`

      const result = parseSVG(maliciousSvg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.wasSanitized).toBe(true)
      }
    })

    it('should set wasSanitized flag to false for clean SVG', () => {
      const cleanSvg = `<svg width="100" height="100">
        <circle cx="50" cy="50" r="40" fill="blue" />
        <rect x="10" y="10" width="30" height="30" fill="red" />
      </svg>`

      const result = parseSVG(cleanSvg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.wasSanitized).toBe(false)
      }
    })

    it('should detect various types of sanitization', () => {
      // Test different sanitization scenarios
      const testCases = [
        {
          name: 'script tags',
          svg: '<svg><script>alert(1)</script><circle r="40" /></svg>',
          shouldSanitize: true,
        },
        {
          name: 'event handlers',
          svg: '<svg><circle r="40" onclick="alert(1)" /></svg>',
          shouldSanitize: true,
        },
        {
          name: 'javascript urls',
          svg: '<svg><a href="javascript:alert(1)">Link</a></svg>',
          shouldSanitize: true,
        },
        {
          name: 'dangerous data urls',
          svg: '<svg><image href="data:text/html,<script>alert(1)</script>" /></svg>',
          shouldSanitize: true,
        },
        {
          name: 'external use references',
          svg: '<svg><use xlink:href="https://example.com/icon.svg#path" /></svg>',
          shouldSanitize: true,
        },
        {
          name: 'clean svg',
          svg: '<svg><circle cx="50" cy="50" r="40" /></svg>',
          shouldSanitize: false,
        },
      ]

      testCases.forEach((testCase) => {
        const result = parseSVG(testCase.svg)

        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.wasSanitized).toBe(testCase.shouldSanitize)
        }
      })
    })

    it('should escape unescaped ampersands', () => {
      const svg = '<svg width="100" height="100"><text>A & B</text></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('A &amp; B')
        expect(result.data.wasSanitized).toBe(true)
      }
    })

    it('should preserve already escaped ampersands', () => {
      const svg = '<svg width="100" height="100"><text>A &amp; B</text></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('A &amp; B')
        // No changes should be made since ampersand was already escaped
        expect(result.data.wasSanitized).toBe(false)
      }
    })

    it('should handle multiple ampersands correctly', () => {
      const svg = '<svg width="100" height="100"><text>A & B & C &amp; D</text></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('A &amp; B &amp; C &amp; D')
        expect(result.data.wasSanitized).toBe(true)
      }
    })

    it('should preserve existing XML entities', () => {
      const svg = '<svg width="100" height="100"><text>A &lt; B &gt; C &amp; D &#169; E</text></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('A &lt; B &gt; C &amp; D &#169; E')
        // No changes since all entities are already properly escaped
        expect(result.data.wasSanitized).toBe(false)
      }
    })

    it('should escape ampersands in attributes', () => {
      const svg = '<svg width="100" height="100"><rect width="10" height="10" data-value="x & y" /></svg>'
      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('data-value="x &amp; y"')
        expect(result.data.wasSanitized).toBe(true)
      }
    })

    it('should handle complex cases with mixed escaped and unescaped ampersands', () => {
      const svg = `<svg width="100" height="100">
        <text>A &amp; B & C</text>
        <text data-params="x=1&y=2&amp;z=3">Mixed &amp; in content too</text>
        <a xlink:href="https://example.com?param1=value1&param2=value2">Link with query params</a>
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.svg).toContain('A &amp; B &amp; C')
        expect(result.data.svg).toContain('data-params="x=1&amp;y=2&amp;z=3"')
        expect(result.data.svg).toContain('https://example.com?param1=value1&amp;param2=value2')
        expect(result.data.wasSanitized).toBe(true)
      }
    })

    it('should handle various XML entity formats', () => {
      const svg = `<svg width="100" height="100">
        <text>
          Standard entities: &amp; &lt; &gt; &quot; &apos;
          Extended entities: &copy; &reg; &trade; &Ouml; &euro;
          Decimal entities: &#169; &#174; &#8364;
          Hex entities: &#x00A9; &#x00AE; &#x20AC;
          Unescaped: A & B
          Complex entity names: &open-quote; &not-equal; &frac12; &my.entity; &my-entity; &my_entity;
        </text>
      </svg>`

      const result = parseSVG(svg)

      expect(result.success).toBe(true)
      if (result.success) {
        // Standard entities preserved
        expect(result.data.svg).toContain('&amp; &lt; &gt; &quot; &apos;')

        // Extended entities preserved
        expect(result.data.svg).toContain('&copy; &reg; &trade; &Ouml; &euro;')

        // Decimal and hex entities preserved
        expect(result.data.svg).toContain('&#169; &#174; &#8364;')
        expect(result.data.svg).toContain('&#x00A9; &#x00AE; &#x20AC;')

        // Unescaped ampersand properly escaped
        expect(result.data.svg).toContain('A &amp; B')

        // Complex entity names preserved
        expect(result.data.svg).toContain(
          '&open-quote; &not-equal; &frac12; &my.entity; &my-entity; &my_entity;',
        )

        expect(result.data.wasSanitized).toBe(true)
      }
    })
  })
})
