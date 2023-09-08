import gql from "graphql-tag";

export const setTableNumberGql = gql`
  mutation updateClubDevice($input: UpdateClubDeviceInput!) {
    updateClubDevice(input: $input) {
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
