class Gis {
  constructor(){};

  private static EARTH_RADIUS: number = 6371; //! KM
  
  /**
   * @param {Array} start Expected [lon, lat]
   * @param {Array} end Expected [lon, lat]
   * @return {number} Distance in meters.
   */
  public static calculateDistance = (
    start: Array<number>,
    end: Array<number>
  ): number => {
    const lat1 = start[0];
    const lon1 = start[1];
    const lat2 = end[0];
    const lon2 = end[1];
  
    return this.sphericalCosines(lat1, lon1, lat2, lon2);
  };
  
  /**
   * @param {number} lat1 Start Latitude
   * @param {number} lon1 Start Longitude
   * @param {number} lat2 End Latitude
   * @param {number} lon2 End Longitude
   * @return {number} Distance in meters.
   */
  private static sphericalCosines = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const longDiff = this.toRad(lon2 - lon1);
  
    lat1 = this.toRad(lat1);
    lat2 = this.toRad(lat2);
  
    const distance =
      Math.acos(
        Math.sin(lat1) * Math.sin(lat2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.cos(longDiff)
      ) * this.EARTH_RADIUS;
  
    return distance;
  };
  
  /**
   * @param {Array} coord Expected [lon, lat]
   * @param {number} bearing Bearing in degrees.
   * 0° - North
   * 90° - East
   * 180° - South
   * 270° - West
   * @param {number} distance Distance in meters
   * @return {Array} Lon-lat coordinates.
   */
  public static coordMetersAway = (
    coord: Array<number>,
    bearing: number,
    distance: number
  ): Array<number> => {
    /**
     * φ is latitude, λ is longitude,
     * θ is the bearing (clockwise from north),
     * δ is the angular distance d/R;
     * d being the distance travelled, R the earth’s radius*
     **/
    const δ = Number(distance) / this.EARTH_RADIUS; // angular distance in radians
    const θ = this.toRad(Number(bearing));
    const φ1 = this.toRad(coord[1]);
    const λ1 = this.toRad(coord[0]);
  
    const φ2 = Math.asin(
      Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ)
    );
  
    let λ2 =
      λ1 +
      Math.atan2(
        Math.sin(θ) * Math.sin(δ) * Math.cos(φ1),
        Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
      );
    // normalise to -180..+180°
    λ2 = ((λ2 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  
    return [this.toDeg(λ2), this.toDeg(φ2)];
  };
  
  /**
   * @param {Array} start Expected [lon, lat]
   * @param {Array} end Expected [lon, lat]
   * @return {number} Bearing in degrees.
   */
  public static getBearing = (
    start: Array<number>,
    end: Array<number>
  ): number => {
    const startLat = this.toRad(start[1]);
    const startLong = this.toRad(start[0]);
    const endLat = this.toRad(end[1]);
    const endLong = this.toRad(end[0]);
    let dLong = endLong - startLong;
  
    const dPhi = Math.log(
      Math.tan(endLat / 2.0 + Math.PI / 4.0) /
        Math.tan(startLat / 2.0 + Math.PI / 4.0)
    );
  
    if (Math.abs(dLong) > Math.PI) {
      dLong = dLong > 0.0 ? -(2.0 * Math.PI - dLong) : 2.0 * Math.PI + dLong;
    }
  
    return (this.toDeg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  };
  
  private static toDeg = (n: number): number => (n * 180) / Math.PI;
  
  private static toRad = (n: number): number => (n * Math.PI) / 180;
}

export default Gis;
