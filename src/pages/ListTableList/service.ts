import { request } from 'umi';
import { TableListParams, TableListItem } from './data.d';

export async function queryRule() {
  const data = await request(
    'https://idehodikxi.execute-api.eu-west-3.amazonaws.com/default/getMadridDatosFromEU',
  );
  return { data: data['@graph'], success: true };
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
