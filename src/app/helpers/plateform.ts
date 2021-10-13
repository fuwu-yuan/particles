export class Plateform {
  public static deviceType = (): DeviceType => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "mobile";
    }
    return "desktop";
  };

  public static deviceName = (useragent: string = navigator.userAgent): DeviceName => {
    let device: DeviceName = "Unknown";
    const ua = {
      "Generic Linux": /Linux/i,
      "Android": /Android/i,
      "BlackBerry": /BlackBerry/i,
      "Bluebird": /EF500/i,
      "Chrome OS": /CrOS/i,
      "Datalogic": /DL-AXIS/i,
      "Honeywell": /CT50/i,
      "iPad": /iPad/i,
      "iPhone": /iPhone/i,
      "iPod": /iPod/i,
      "macOS": /Macintosh/i,
      "Windows": /IEMobile|Windows/i,
      "Zebra": /TC70|TC55/i,
    };
    Object.keys(ua).map(v => useragent.match(ua[v]) && (device = <DeviceName>v));
    // @ts-ignore
    if (device === "macOS") {
      // Check if Apple lie on iPad OS faking useragent with Macintosh
      if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
        device = "iPad"
      }
    }
    return device;
  }
}

type DeviceType = "tablet"|"mobile"|"desktop";
type DeviceName = "Unknown"|"Generic Linux"|"Android"|"BlackBerry"|"Bluebird"|"Chrome OS"|"Datalogic"|"Honeywell"|"iPad"|"iPhone"|"iPod"|"macOS"|"Windows"|"Zebra";
