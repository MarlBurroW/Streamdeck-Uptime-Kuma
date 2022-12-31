export function statusImage(text, info = "", backgroundColor = "#777777") {
  const svgXml = `
    <svg width="100" height="100" viewBox="0 0 100 100"  xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text 
        dominant-baseline="middle" 
        stroke-width="1"  
        stroke="#000000" 
        font-size="22" 
        font-weight="800" 
        fill="white" 
        text-anchor="middle" 
        x="50%" 
        y="65" 
        class="text">${text ? text : ""}</text>

      <text 
        dominant-baseline="middle" 
        stroke-width="1"  
        stroke="#000000" 
        font-size="15" 
        font-weight="800" 
        fill="white" 
        text-anchor="middle" 
        x="50%" 
        y="85" 
        class="text">${info ? info : ""}</text>
    </svg>
    `;

  return (
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgXml)))
  );
}
