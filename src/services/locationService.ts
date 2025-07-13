export interface LocationData {
  lat: number;
  lon: number;
  address: string;
  ip: string;
  country: string;
  region: string;
  city: string;
  timezone: string;
  isp?: string;
}

class LocationService {
  private cache: Map<string, LocationData> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getCurrentLocation(): Promise<LocationData> {
    try {
      // Try multiple reliable APIs in sequence
      const apis = [
        this.tryIpapiCo,
        this.tryIpify,
        this.tryFreeGeoIP,
        this.tryIpInfo
      ];

      for (const api of apis) {
        try {
          console.log(`Trying API: ${api.name}`);
          const location = await api();
          if (location && this.isValidLocation(location)) {
            console.log(`Success with API: ${api.name}`, location);
            this.cache.set('current', location);
            return location;
          }
        } catch (error) {
          console.warn(`API ${api.name} failed:`, error);
          continue;
        }
      }

      // If all APIs fail, try a simple approach
      console.log('All APIs failed, trying simple approach...');
      return await this.trySimpleLocation();
    } catch (error) {
      console.error('All location APIs failed:', error);
      throw error;
    }
  }

  private isValidLocation(location: LocationData): boolean {
    // Check if location data is valid and not obviously wrong
    if (!location.lat || !location.lon) return false;
    
    // Check for reasonable latitude/longitude ranges
    if (location.lat < -90 || location.lat > 90) return false;
    if (location.lon < -180 || location.lon > 180) return false;
    
    // Check for common wrong locations (0,0 or very generic coordinates)
    if (location.lat === 0 && location.lon === 0) return false;
    
    // Accept any real coordinates, even if address is not perfect
    return true;
  }

  async getUserLocation(): Promise<LocationData> {
    // In a real app, this would get the user's actual location from their profile or GPS
    // For demo purposes, we'll use the same IP-based location but with a small offset
    // to simulate that the user is located near the admin but at a different address
    const baseLocation = await this.getCurrentLocation();
    
    // Add small random offset to simulate different user location (about 500 meters)
    const offset = 0.005;
    const userLat = baseLocation.lat + (Math.random() - 0.5) * offset;
    const userLon = baseLocation.lon + (Math.random() - 0.5) * offset;
    
    // Get detailed address for the user location
    const userAddress = await this.getDetailedAddress(userLat, userLon);
    
    return {
      ...baseLocation,
      lat: userLat,
      lon: userLon,
      address: userAddress
    };
  }

  async getLocationWithRetry(maxRetries: number = 3): Promise<LocationData> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const location = await this.getCurrentLocation();
        if (this.isValidLocation(location)) {
          return location;
        }
        console.warn(`Attempt ${attempt}: Invalid location data, retrying...`);
      } catch (error) {
        console.warn(`Attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          console.error('All retry attempts failed');
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    throw new Error('All retry attempts failed');
  }



  private async tryIpify(): Promise<LocationData | null> {
    // First get IP
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    if (!ipResponse.ok) throw new Error('IPify IP failed');
    
    const { ip } = await ipResponse.json();
    
    // Then get location
    const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!locationResponse.ok) throw new Error('IPify location failed');
    
    const data = await locationResponse.json();
    if (!data.latitude || !data.longitude) return null;

    // Get better address using reverse geocoding
    const address = await this.getDetailedAddress(data.latitude, data.longitude);

    return {
      lat: data.latitude,
      lon: data.longitude,
      address: address,
      ip: ip,
      country: data.country_name || 'Unknown',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      timezone: data.timezone || 'UTC',
      isp: data.org
    };
  }

  private async tryIpapiCo(): Promise<LocationData | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch('https://ipapi.co/json/', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('IPAPI.co failed');
      
      const data = await response.json();
      if (!data.latitude || !data.longitude) return null;

      // Get better address using reverse geocoding
      const address = await this.getDetailedAddress(data.latitude, data.longitude);

      return {
        lat: data.latitude,
        lon: data.longitude,
        address: address,
        ip: data.ip,
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        timezone: data.timezone || 'UTC',
        isp: data.org
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async tryFreeGeoIP(): Promise<LocationData | null> {
    const response = await fetch('https://freegeoip.app/json/');
    if (!response.ok) throw new Error('FreeGeoIP failed');
    
    const data = await response.json();
    if (!data.latitude || !data.longitude) return null;

    // Get better address using reverse geocoding
    const address = await this.getDetailedAddress(data.latitude, data.longitude);

    return {
      lat: data.latitude,
      lon: data.longitude,
      address: address,
      ip: data.ip,
      country: data.country_name || 'Unknown',
      region: data.region_name || 'Unknown',
      city: data.city || 'Unknown',
      timezone: data.time_zone || 'UTC',
      isp: data.isp
    };
  }

  private async tryIpInfo(): Promise<LocationData | null> {
    const response = await fetch('https://ipinfo.io/json');
    if (!response.ok) throw new Error('IPInfo failed');
    
    const data = await response.json();
    if (!data.loc) return null;

    const [lat, lon] = data.loc.split(',').map(Number);
    if (!lat || !lon) return null;

    // Get better address using reverse geocoding
    const address = await this.getDetailedAddress(lat, lon);

    return {
      lat: lat,
      lon: lon,
      address: address,
      ip: data.ip || 'Unknown',
      country: data.country || 'Unknown',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      timezone: data.timezone || 'UTC',
      isp: data.org || 'Unknown'
    };
  }

  private async trySimpleLocation(): Promise<LocationData> {
    // Try the most basic and reliable approach
    try {
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) throw new Error('Simple API failed');
      
      const data = await response.json();
      console.log('Simple API response:', data);
      
      if (data.latitude && data.longitude) {
        return {
          lat: data.latitude,
          lon: data.longitude,
          address: `${data.city || 'Unknown'}, ${data.region || 'Unknown'}, ${data.country_name || 'Unknown'}`,
          ip: data.ip || 'Unknown',
          country: data.country_name || 'Unknown',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          timezone: data.timezone || 'UTC',
          isp: data.org || 'Unknown'
        };
      }
      
      throw new Error('No location data in response');
    } catch (error) {
      console.error('Simple location failed:', error);
      
      // Last resort: try browser geolocation
      return await this.tryBrowserGeolocation();
    }
  }

  private async tryBrowserGeolocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Browser geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            // Get address from coordinates
            const address = await this.getDetailedAddress(lat, lon);
            
            resolve({
              lat: lat,
              lon: lon,
              address: address,
              ip: 'Browser GPS',
              country: 'Unknown',
              region: 'Unknown',
              city: 'Unknown',
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
              isp: 'Browser GPS'
            });
          } catch (error) {
            reject(new Error('Unable to get address from coordinates'));
          }
        },
        (error) => {
          reject(new Error('Browser geolocation failed: ' + error.message));
        },
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }



  private getDefaultLocation(): LocationData {
    return {
      lat: 25.2048,
      lon: 55.2708,
      address: 'Sheikh Zayed Road, Dubai, United Arab Emirates',
      ip: 'Unknown',
      country: 'United Arab Emirates',
      region: 'Dubai',
      city: 'Dubai',
      timezone: 'Asia/Dubai',
      isp: 'Unknown'
    };
  }

  async getDetailedAddress(lat: number, lon: number): Promise<string> {
    try {
      // Use only the most reliable reverse geocoding service
      const address = await this.tryNominatim(lat, lon);
      if (address && address.length > 5) {
        return this.formatAddress(address);
      }
      
      // If no address found, return coordinates
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }

  private formatAddress(address: string): string {
    // Clean and format the address
    let formatted = address
      .replace(/,\s*,/g, ',') // Remove double commas
      .replace(/^\s*,\s*/, '') // Remove leading comma
      .replace(/\s*,\s*$/, '') // Remove trailing comma
      .trim();
    
    // If address is too long, take the most important parts
    const parts = formatted.split(', ');
    if (parts.length > 4) {
      // Take street, city, region, country
      return `${parts[0]}, ${parts[parts.length - 3]}, ${parts[parts.length - 1]}`;
    }
    
    return formatted;
  }

  private async tryNominatim(lat: number, lon: number): Promise<string> {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1&accept-language=en`
    );
    
    if (!response.ok) throw new Error('Nominatim failed');
    
    const data = await response.json();
    
    if (data.display_name) {
      // Format the address better
      const parts = data.display_name.split(', ');
      if (parts.length >= 3) {
        // Take the most relevant parts (street, city, country)
        return `${parts[0]}, ${parts[parts.length - 3]}, ${parts[parts.length - 1]}`;
      }
      return data.display_name;
    }
    
    throw new Error('No address data');
  }



  getCachedLocation(): LocationData | null {
    const cached = this.cache.get('current');
    if (cached && Date.now() - (cached as any).timestamp < this.CACHE_DURATION) {
      return cached;
    }
    return null;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const locationService = new LocationService(); 