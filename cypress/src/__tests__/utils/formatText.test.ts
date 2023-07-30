import formatText from '../../utils/formatText';
// NOTE: This test will fail due to this error:
// `'formatText' is declared but its value is never read`
// until `formatText` is used in this file.

describe('formatText', () => {
    it('should format string input with an underscore', () => {
        const input = "foo_bar";
        const expected = "foo bar";
        const result = formatText(input);

        expect(result).toBe(expected);
    });

    it('should format string input with multiple underscores', () => {
        const input = "foo_bar_baz";
        const expected = "foo bar baz";
        const result = formatText(input);

        expect(result).toBe(expected);
    });

    it('should format string input with a colon', () => {
        const input = "foo:bar";
        const expected = "foo: bar";
        const result = formatText(input);

        expect(result).toBe(expected);
    });

    it('should format string input with multiple underscores', () => {
        const input = "foo:bar:baz";
        const expected = "foo: bar: baz";
        const result = formatText(input);

        expect(result).toBe(expected);
    });

    it('should format string input with multiple underscores and multiple colons', () => {
        const input = "foo:bar_foo:bar_baz";
        const expected = "foo: bar foo: bar baz";
        const result = formatText(input);

        expect(result).toBe(expected);
    });

    it('should not modify the input if it contains no underscores or colons', () => {
        const input = 'foo bar baz';
        const result = formatText(input);
        expect(result).toEqual(input);
    });

    it('should handle empty string input and return an empty string', () => {
        const input = '';
        const expected = '';
        const result = formatText(input);
        expect(result).toEqual(expected);
    });

    it('should handle string with symbols and return the same string', () => {
        const input = '[]!@#$%';
        const result = formatText(input);
        expect(result).toEqual(input);
    });
});