import { request } from 'umi';
import { TableListParams, TableListItem } from './data.d';

let cacheMadridData: any;
let distanceCalculated: boolean = false;

export async function queryRule(info: any) {
  const { userCoordinates, sorter } = info;
  if (!cacheMadridData) {
    const data = await request(
      'https://idehodikxi.execute-api.eu-west-3.amazonaws.com/default/getMadridDatosFromEU',
    );

    data['@graph'].forEach(
      (parking: {
        address: {
          [x: string]: string;
          districtName: string;
          district: string;
          areaName: string;
          area: string;
          locality: string;
        };
        fullAddress: string;
      }) => {
        // eslint-disable-next-line no-param-reassign
        parking.address.districtName = parking.address.district['@id'].substring(
          parking.address.district['@id'].lastIndexOf('/') + 1,
        );
        // eslint-disable-next-line no-param-reassign
        parking.address.areaName = parking.address.area['@id'].substring(
          parking.address.area['@id'].lastIndexOf('/') + 1,
        );
        // eslint-disable-next-line no-param-reassign
        parking.fullAddress =
          unescape(parking.address['street-address']) +
          unescape(parking.address.districtName) +
          unescape(parking.address.areaName) +
          unescape(parking.address['postal-code']) +
          unescape(parking.address.locality);
      },
    );
    cacheMadridData = data['@graph'];
  }
  if (!distanceCalculated && userCoordinates) {
    distanceCalculated = true;
    calculateDistance(userCoordinates);
  }

  // ORDERING
  if (sorter) {
    const keySorter = Object.keys(sorter)[0];
    if (keySorter) {
      let sortFunction;
      if (sorter[keySorter] === 'ascend') {
        sortFunction = (a: any, b: any) => a[keySorter].localeCompare(b[keySorter]);
      } else {
        sortFunction = (a: any, b: any) => b[keySorter].localeCompare(a[keySorter]);
      }
      cacheMadridData.sort(sortFunction);
    }
  }

  return { data: cacheMadridData, success: true };
}

function calculateDistance(userCoordinates: { latitude: number; longitude: number }) {
  // https://www.geodatasource.com/developers/javascript
  function distance(lat1: number, lon1: number, lat2: number, lon2: number, unit: 'M' | 'K' | 'N') {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    }
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') {
      dist *= 1.609344;
    }
    if (unit === 'N') {
      dist *= 0.8684;
    }
    return dist;
  }

  cacheMadridData.forEach((parking: any) => {
    // eslint-disable-next-line no-param-reassign
    parking.distance = distance(
      userCoordinates.latitude,
      userCoordinates.longitude,
      parking.location.latitude,
      parking.location.longitude,
      'K',
    );
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListItem) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
