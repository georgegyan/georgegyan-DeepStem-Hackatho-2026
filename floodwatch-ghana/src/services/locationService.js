const ACCRA = {
  lat: 5.6037,
  lng: -0.1870,
};

export const getCurrentLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(ACCRA);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        resolve(ACCRA);
      }
    );
  });
};

export default getCurrentLocation;