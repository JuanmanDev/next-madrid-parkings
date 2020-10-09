import { request, gql } from 'graphql-request';

const query = gql`
  query($city: String!) {
    getCityByName(name: $city) {
      id
      name
      country
      coord {
        lon
        lat
      }
      weather {
        summary {
          title
          description
          icon
        }
        temperature {
          actual
          feelsLike
          min
          max
        }
        wind {
          speed
          deg
        }
        clouds {
          all
          visibility
          humidity
        }
        timestamp
      }
    }
  }
`;

export async function getWeather(newCity?: string) {
  try {
    const data = await request('https://graphql-weather-api.herokuapp.com/', query, {
      city: newCity || 'Madrid, ES',
    });
    return data.getCityByName;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
  return null;
}
