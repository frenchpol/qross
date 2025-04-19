const createGPXString = (path: Array<{ coordinates: [number, number]; altitude: number | null; timestamp: number }>, name: string, pois: { coordinates: [number, number]; name: string; comment: string }[]): string => {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="QROSS Tracker"
  xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${name}</name>
    <time>${new Date().toISOString()}</time>
  </metadata>`;

  // Add waypoints (POIs) first
  const waypoints = pois
    .map(({ coordinates: [lon, lat], name, comment }) => `  <wpt lat="${lat.toFixed(6)}" lon="${lon.toFixed(6)}">
    <name>${name}</name>
    <desc>${comment}</desc>
    <sym>Flag, Blue</sym>
  </wpt>`)
    .join('\n');

  // Add track points with proper formatting
  const trackPoints = path
    .map(({ coordinates: [lon, lat], altitude, timestamp }) => `      <trkpt lat="${lat.toFixed(6)}" lon="${lon.toFixed(6)}">
        ${altitude !== null ? `<ele>${altitude.toFixed(1)}</ele>` : ''}
        <time>${new Date(timestamp).toISOString()}</time>
      </trkpt>`)
    .join('\n');

  const track = `
  <trk>
    <name>${name}</name>
    <desc>Track recorded by QROSS Tracker</desc>
    <trkseg>
${trackPoints}
    </trkseg>
  </trk>`;

  const footer = `
</gpx>`;

  return `${header}\n${waypoints}\n${track}${footer}`;
};

export const downloadGPXFile = (path: Array<{ coordinates: [number, number]; altitude: number | null; timestamp: number }>, name: string, pois: { coordinates: [number, number]; name: string; comment: string }[] = []) => {
  const gpxContent = createGPXString(path, name, pois);
  const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  const sanitizedName = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  link.href = url;
  link.download = `${sanitizedName}_${date}.gpx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};