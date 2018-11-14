import * as fetchIntercept from 'fetch-intercept';

fetchIntercept.register({
  request: function (url, config) {
    return [
      `${url}&access_key=MDo5ZjQzZjZjYS0zYzZkLTExZTctODVjZC1lNzY5OWY5Mzg2MjE6NEp5dmw3Y3ZIdEpxU29Ka2diYlhPanBXRFZhbXJyNWVIZ3VJ`,
      config
    ];
  }
});
