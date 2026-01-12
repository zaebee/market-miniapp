import { validators, sanitizers } from '../../src/middlewares/validation';

describe('Validation Utilities', () => {
  describe('validators.isEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validators.isEmail('test@example.com')).toBe(true);
      expect(validators.isEmail('user.name@example.co.uk')).toBe(true);
      expect(validators.isEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validators.isEmail('invalid')).toBe(false);
      expect(validators.isEmail('invalid@')).toBe(false);
      expect(validators.isEmail('@example.com')).toBe(false);
      expect(validators.isEmail('user@')).toBe(false);
    });
  });

  describe('validators.isUrl', () => {
    it('should validate correct URLs', () => {
      expect(validators.isUrl('https://example.com')).toBe(true);
      expect(validators.isUrl('http://example.com/path')).toBe(true);
      expect(validators.isUrl('https://sub.example.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validators.isUrl('not a url')).toBe(false);
      // Note: validator.js accepts domain names and various protocols
    });
  });

  describe('validators.isPositiveInt', () => {
    it('should validate positive integers', () => {
      expect(validators.isPositiveInt(0)).toBe(true);
      expect(validators.isPositiveInt(1)).toBe(true);
      expect(validators.isPositiveInt(100)).toBe(true);
      expect(validators.isPositiveInt('42')).toBe(true);
    });

    it('should reject negative numbers and non-integers', () => {
      expect(validators.isPositiveInt(-1)).toBe(false);
      expect(validators.isPositiveInt(1.5)).toBe(false);
      expect(validators.isPositiveInt('invalid')).toBe(false);
      expect(validators.isPositiveInt(null)).toBe(false);
      expect(validators.isPositiveInt(undefined)).toBe(false);
    });
  });

  describe('validators.isLength', () => {
    it('should validate string length', () => {
      expect(validators.isLength('hello', 1, 10)).toBe(true);
      expect(validators.isLength('test', 4, 4)).toBe(true);
      expect(validators.isLength('', 0, 5)).toBe(true);
    });

    it('should reject strings outside length range', () => {
      expect(validators.isLength('hello', 1, 3)).toBe(false);
      expect(validators.isLength('hi', 5, 10)).toBe(false);
    });
  });

  describe('validators.isRequired', () => {
    it('should validate required fields', () => {
      expect(validators.isRequired('value')).toBe(true);
      expect(validators.isRequired(123)).toBe(true);
      expect(validators.isRequired(true)).toBe(true);
      expect(validators.isRequired({})).toBe(true);
      expect(validators.isRequired([1, 2, 3])).toBe(true);
    });

    it('should reject null, undefined, and empty values', () => {
      expect(validators.isRequired(null)).toBe(false);
      expect(validators.isRequired(undefined)).toBe(false);
      expect(validators.isRequired('')).toBe(false);
      expect(validators.isRequired('   ')).toBe(false);
      expect(validators.isRequired([])).toBe(false);
    });
  });

  describe('validators type guards', () => {
    it('should handle non-string inputs safely', () => {
      expect(validators.isEmail(123 as any)).toBe(false);
      expect(validators.isUrl(null as any)).toBe(false);
      expect(validators.isPhone(undefined as any)).toBe(false);
      expect(validators.isLength(123 as any, 1, 10)).toBe(false);
    });
  });
});

describe('Sanitization Utilities', () => {
  describe('sanitizers.escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizers.escapeHtml('<script>alert("xss")</script>'))
        .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');

      expect(sanitizers.escapeHtml('<div>Test</div>'))
        .toBe('&lt;div&gt;Test&lt;&#x2F;div&gt;');
    });

    it('should handle ampersands and quotes', () => {
      expect(sanitizers.escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
      expect(sanitizers.escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
      expect(sanitizers.escapeHtml("'single'")).toBe('&#x27;single&#x27;');
    });
  });

  describe('sanitizers.trim', () => {
    it('should remove leading and trailing whitespace', () => {
      expect(sanitizers.trim('  hello  ')).toBe('hello');
      expect(sanitizers.trim('\n\ttest\n')).toBe('test');
    });

    it('should preserve internal whitespace', () => {
      expect(sanitizers.trim('  hello world  ')).toBe('hello world');
    });
  });

  describe('sanitizers.normalizeEmail', () => {
    it('should normalize email addresses', () => {
      const normalized = sanitizers.normalizeEmail('Test.User@Example.COM');
      // validator.js normalizeEmail keeps dots for non-Gmail addresses
      expect(normalized?.toLowerCase()).toBe('test.user@example.com');
    });
  });

  describe('sanitizers.sanitizeObject', () => {
    it('should sanitize all string fields in an object', () => {
      const input = {
        name: '  John  ',
        title: '<script>alert("xss")</script>',
        age: 30,
        nested: {
          value: '  nested  ',
        },
      };

      const result = sanitizers.sanitizeObject(input);

      expect(result.name).toBe('John');
      expect(result.title).toContain('&lt;script&gt;');
      expect(result.age).toBe(30);
      expect(result.nested.value).toBe('nested');
    });

    it('should handle arrays', () => {
      const input = {
        items: ['  item1  ', '<b>item2</b>'],
      };

      const result = sanitizers.sanitizeObject(input);

      expect(result.items[0]).toBe('item1');
      expect(result.items[1]).toContain('&lt;b&gt;');
    });

    it('should respect sanitization options', () => {
      const input = {
        text: '  <b>hello</b>  ',
      };

      const resultWithTrim = sanitizers.sanitizeObject(input, {
        escapeHtml: false,
        trim: true,
      });
      expect(resultWithTrim.text).toBe('<b>hello</b>');

      const resultWithEscape = sanitizers.sanitizeObject(input, {
        escapeHtml: true,
        trim: false,
      });
      expect(resultWithEscape.text).toContain('&lt;b&gt;');
    });
  });
});
