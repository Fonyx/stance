
/**
 * Convert a spacious string to a slug string - reversal of spacious
 * @param {*} spacious 
 * @returns 
 */
export function slugify(spacious){
    let slug = spacious.replace(/\s/g, '-');
    return slug
}

/**
 * Convert a slug string to a spacious string - reversal of slugify
 * @param {*} slug 
 * @returns 
 */
export function spacious(slug){
    let spacious = slug.replace(/-/g, '/s');
    return spacious
}

/**
 * Truncates a string to the limit number, indexed from 0, adds ... to end of string if less than limit, else returns original string
 * @param {str} text 
 * @param {str} limit 
 */
export function truncate(text, limit){
    let truncText = text;

    // only override if text is longer than limit
    if(text.length > limit){
        truncText = text.slice(0, limit);
        truncText += '...';
    }

    return truncText;
}