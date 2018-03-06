const presetThemesContext = require.context(
  "../preset-themes/",
  false,
  /.*\.json/
);

const defaultTheme = presetThemesContext("./default.json");

export const presetThemes = presetThemesContext
  .keys()
  .map((filename, idx) => ({ idx, filename, ...presetThemesContext(filename) }))
  .sort(({ filename: a }, { filename: b }) => a.localeCompare(b));

export const colorToCSS = color => {
  const { h, s, l, a } = color;
  return typeof a === "undefined"
    ? `hsl(${h}, ${s}%, ${l}%)`
    : `hsla(${h}, ${s}%, ${l}%, ${a * 0.01})`;
};

// Utility to ensure normal & consistent colors
export const normalizeThemeColor = (data, defaultColor) => {
  const { h, s, l, a } = data || defaultColor;
  return {
    h: Math.floor(h),
    s: Math.floor(s),
    l: Math.floor(l),
    a
  };
};

export const normalizeThemeColors = (colors = {}) => {
  const out = {};
  const { colors: defaultColors } = defaultTheme;
  Object.keys(defaultColors).forEach(name => {
    out[name] = normalizeThemeColor(colors[name], defaultColors[name]);
  });
  return out;
};

// Utility to ensure normal properties and values in app theme state
export const normalizeTheme = (data = {}) => {
  const theme = {
    colors: normalizeThemeColors(data.colors, defaultTheme.colors),
    images: { headerURL: "" }
  };
  const images = data.images ? data.images : {};
  if (images.headerURL) {
    theme.images.headerURL = images.headerURL;
  }
  return theme;
};
