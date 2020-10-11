import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, removeRule } from './service';

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Loading');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('Loaded');
    return true;
  } catch (error) {
    hide();
    message.error('There was a problem');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('Loading');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Loaded data successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Error');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
      tip: 'Unique identifier for intern purposes',
      render: (id, record) => <a href={record['@id']}> id </a>,
      // valueType: 'number',
      // render: (dom, entity) => {
      //   return <a onClick={() => setRow(entity)}>{dom}</a>;
      // },
    },
    {
      title: 'Name',
      dataIndex: 'title',
      sorter: true,
      // valueType: 'textarea',
    },
    {
      title: 'Address',
      dataIndex: 'fullAddress',
      sorter: true,
      hideInForm: true,
      render: (_, record: any) => (
        <div>
          <span> {record.address['street-address']} </span>
          <br />
          <span> {record.address.districtName} </span>
          <span> {record.address.areaName} </span>
          <br />
          <span> {record.address['postal-code']} </span>
          <span> {record.address.locality} </span>
        </div>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sorter: true,
      renderText: (location: any) => ` ${location.latitude}, ${location.longitude}`,
    },
    {
      title: 'Distance',
      dataIndex: 'distance',
      sorter: true,
      // valueType: 'money',
      renderText: (val: number) => `${val ? val.toFixed(2) : '-'} km`,
    },
    {
      title: 'Maps',
      dataIndex: 'location',
      render: (location: any) => (
        <>
          <a
            href={`http://www.google.com/maps/place/${location.latitude},${location.longitude}`}
            target="blank"
          >
            <Button type="primary">See on Google Maps</Button>
          </a>
        </>
      ),
    },
  ];

  let userCoordinates: { latitude: number; longitude: number };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      userCoordinates = position.coords as {
        latitude: number;
        longitude: number;
      };
      actionRef.current?.reload();
    });
  }

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="Madrid Parkings"
        actionRef={actionRef}
        rowKey="key"
        search={false}
        request={(params, sorter, filter) =>
          queryRule({ ...params, sorter, filter, userCoordinates })
        }
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      {/* <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable<TableListItem, TableListItem>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </CreateForm> */}
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
