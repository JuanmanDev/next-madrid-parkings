/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { DownCircleOutlined } from '@ant-design/icons';

import { Card, Input, Spin } from 'antd';

import './style.css';

import { withRouter } from 'umi';

import { RouteComponentProps } from 'react-router';

import { getWeather } from './service';

const { Search } = Input;

type TParams = { city?: string };
type RouteParams = RouteComponentProps<TParams>;

export class Weather extends Component<RouteParams, { data: any; city: string; loading: boolean }> {
  history: any;

  unlisten: any;

  constructor(props: RouteParams) {
    super(props);
    this.state = {
      data: [],
      city: (props.location as any).query.city || 'Madrid, ES',
      loading: false,
    };
    this.history = this.props.history;

    this.updateWeather(this.state.city);

    this.unlisten = this.props.history.listen((location: any) => {
      this.updateWeather(location.query.city);
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  async updateWeather(newCity: string) {
    this.setState({ city: newCity, loading: true });

    const data = await getWeather(newCity);

    this.setState({ data, loading: false });
  }

  enterCity(city: String) {
    this.history.push({
      search: `?city=${city}`,
    });
  }

  render() {
    return (
      <PageContainer>
        <div style={{ maxWidth: '750px', margin: '1em auto' }}>
          <Search
            placeholder="City, Couuntry"
            size="large"
            loading={this.state.loading}
            enterButton
            onSearch={this.enterCity.bind(this)}
          />
        </div>
        {this.state.data && this.state.data.name && (
          <Spin spinning={this.state.loading}>
            <div
              className="flex-container"
              style={{ maxWidth: '100%', margin: 'auto', width: '1200px' }}
            >
              <div className="flex-item">
                <Card
                  title={
                    <>
                      <DownCircleOutlined /> Place
                    </>
                  }
                  bordered={false}
                >
                  <p>
                    {this.state.data.name},{this.state.data.country}
                  </p>
                </Card>
              </div>
              <div className="flex-item">
                <Card
                  title={
                    <>
                      <DownCircleOutlined /> Location
                    </>
                  }
                  bordered={false}
                >
                  {this.state.data.coord.lon.toString()}, {this.state.data.coord.lat.toString()}
                </Card>
              </div>
              <div className="flex-item">
                <Card
                  title={
                    <>
                      <DownCircleOutlined /> {this.state.data.weather.summary.title}
                    </>
                  }
                  bordered={false}
                >
                  {this.state.data.weather.summary.description}
                </Card>
              </div>
              <div className="flex-item">
                <Card
                  title={
                    <>
                      <DownCircleOutlined /> Temperature
                    </>
                  }
                  bordered={false}
                >
                  {(this.state.data.weather.temperature.actual - 273.15).toFixed(1).toString()} ºC (
                  {(this.state.data.weather.temperature.feelsLike - 273.15).toFixed(1).toString()}{' '}
                  ºC)
                </Card>
              </div>
              <div className="flex-item">
                <Card
                  title={
                    <>
                      <DownCircleOutlined /> Wind
                    </>
                  }
                  bordered={false}
                >
                  {this.state.data.weather.wind.speed.toString()} km/h
                </Card>
              </div>
            </div>
          </Spin>
        )}
      </PageContainer>
    );
  }
}

export default withRouter(Weather);
