import { graphql } from '$houdini';

export const _houdini_load = graphql`
  query Room($roomId: ID!) {
    room(id: $roomId) {
      id
      users {
        id
        name
        is_online
      }
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