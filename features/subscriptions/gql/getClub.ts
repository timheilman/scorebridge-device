import gql from "graphql-tag";

export const getClubGql = gql`
  query getClub($clubId: String!) {
    getClub(clubId: $clubId) {
      name
    }
  }
`;
