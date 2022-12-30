export function serviceUpImage(text, fontSize = 22) {
  const svgXml = `
    <svg width="100" height="100" viewBox="0 0 100 100"  xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#2bbc5e"/>
      <text 
        dominant-baseline="middle" 
        stroke-width="1"  
        stroke="#000000" 
        font-size="${fontSize}" 
        font-weight="800" 
        fill="white" 
        text-anchor="middle" 
        x="50%" 
        y="80" 
        class="text">${text ? text : ""}</text>
    </svg>
    `;

  return (
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgXml)))
  );
}

export function serviceDownImage(text, fontSize = 22) {
  const svgXml = `
   <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="red"/>
      <text 
        dominant-baseline="middle" 
        stroke-width="1"  
        stroke="#000000" 
        font-size="${fontSize}" 
        font-weight="800" 
        fill="white" 
        text-anchor="middle" 
        x="50%" 
        y="80" 
        class="text">${text ? text : ""}</text>
    </svg>
    `;

  return (
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgXml)))
  );
}

export function serviceUnknownImage(text, fontSize = 22) {
  const svgXml = `
     <svg width="100" height="100" viewBox="0 0 100 100"  xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#777777"/>
      <text 
        dominant-baseline="middle" 
        stroke-width="1"  
        stroke="#000000" 
        font-size="${fontSize}" 
        font-weight="800" 
        fill="white" 
        text-anchor="middle" 
        x="50%" 
        y="80" 
        class="text">${text ? text : ""}</text>
    </svg>
    `;

  return (
    "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgXml)))
  );
}
