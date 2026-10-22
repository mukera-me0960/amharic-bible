/**
 * Amharic and Ge'ez utility functions for scripture rendering and searching.
 */

// Ge'ez numeral mapping
const GEEZ_ONES = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
const GEEZ_TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];
const GEEZ_HUNDRED = '፻';
const GEEZ_TEN_THOUSAND = '፼';

/**
 * Converts an Arabic number (1-9999) to traditional Ge'ez numeral string.
 */
export function toGeezNumeral(num: number): string {
  if (num <= 0 || !Number.isInteger(num)) return num.toString();

  if (num < 10) {
    return GEEZ_ONES[num];
  }

  if (num < 100) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;
    return GEEZ_TENS[tens] + GEEZ_ONES[ones];
  }

  if (num < 10000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    const hundredsPrefix = hundreds === 1 ? '' : toGeezNumeral(hundreds);
    const remainderStr = remainder > 0 ? toGeezNumeral(remainder) : '';
    return hundredsPrefix + GEEZ_HUNDRED + remainderStr;
  }

  return num.toString();
}

/**
 * Normalizes Amharic text for search by removing diacritical noise and standardizing homophones.
 */
export function normalizeAmharic(text: string): string {
  if (!text) return '';
  return text
    // Replace traditional punctuation with spaces
    .replace(/[፡።፣፤፥፦፧፨\.\,\?\!\;]/g, ' ')
    // Normalize variants of Ha (ሀ, ሐ, ኀ, ኻ)
    .replace(/[ሐኀኻ]/g, 'ሀ')
    .replace(/[ሑኁኹ]/g, 'ሁ')
    .replace(/[ሒኂኺ]/g, 'ሂ')
    .replace(/[ሓኃኻ]/g, 'ሃ')
    .replace(/[ሔኄኼ]/g, 'ሄ')
    .replace(/[ሕኅኽ]/g, 'ህ')
    .replace(/[ሖኆኾ]/g, 'ሆ')
    // Normalize variants of Se (ሰ, ሠ)
    .replace(/[ሠ]/g, 'ሰ')
    .replace(/[ሡ]/g, 'ሱ')
    .replace(/[ሢ]/g, 'ሲ')
    .replace(/[ሣ]/g, 'ሳ')
    .replace(/[ሤ]/g, 'ሴ')
    .replace(/[ሥ]/g, 'ስ')
    .replace(/[ሦ]/g, 'ሶ')
    // Normalize variants of A (አ, ዐ)
    .replace(/[ዐ]/g, 'አ')
    .replace(/[ዑ]/g, 'ኡ')
    .replace(/[ዒ]/g, 'ኢ')
    .replace(/[ዓ]/g, 'ኣ')
    .replace(/[ዔ]/g, 'ኤ')
    .replace(/[ዕ]/g, 'እ')
    .replace(/[ዖ]/g, 'ኦ')
    // Normalize variants of Tsa (ጸ, ፀ)
    .replace(/[ፀ]/g, 'ጸ')
    .replace(/[ፁ]/g, 'ጹ')
    .replace(/[ፂ]/g, 'ጺ')
    .replace(/[ፃ]/g, 'ጻ')
    .replace(/[ፄ]/g, 'ጼ')
    .replace(/[ፅ]/g, 'ጽ')
    .replace(/[ፆ]/g, 'ጾ')
    // Clean multiple spaces
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Truncate long Amharic text gracefully
 */
export function truncateAmharic(text: string, maxLength: number = 80): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
