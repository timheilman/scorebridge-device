import gql from "graphql-tag";

export const getClubDeviceGql = gql`
  query getClubDevice($clubId: String!, $clubDeviceId: String!) {
    getClubDevice(clubId: $clubId, clubDeviceId: $clubDeviceId) {
      clubId
      clubDeviceId
      email
      name
      table
      createdAt
      updatedAt
    }
  }
`;
