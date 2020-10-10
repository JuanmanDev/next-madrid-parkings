import { request } from 'umi';
import { TableListParams, TableListItem } from './data.d';

let cacheMadridData: any;

export async function queryRule() {
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
  return { data: cacheMadridData, success: true };
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
