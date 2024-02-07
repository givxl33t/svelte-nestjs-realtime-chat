import { graphql } from '$houdini';

export const _houdini_load = graphql`
  query Room($roomId: ID!) {
    room(id: $roomId) {
      id
      messages {
        id
        text
        createdAt
        user {
          id
          name
        }
      }
    }
  }
`;

/** @type { import('./$houdini').RoomVariables } */
export const _RoomVariables = (event: any) => {
  const roomId = event.params.roomId;

  return {
    roomId
  };
}