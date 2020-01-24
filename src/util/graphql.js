//exports graphql mutations used acress components
import gql from 'graphql-tag';

export const FETCH_POSTS_QUERY = gql`
query{
 getPosts{
     id 
     body 
     createdAt 
     username 
     likeCount
     likes{
         username
     }
     commentCount
     comments{
         id 
         username 
         createdAt 
         body
     }
 }
}
`;

export const FETCH_ITEMS_QUERY = gql`
query{
 getItems{
     id 
     body 
     createdAt 
     username,
     favorite
 }
}
`;

export const DELETE_ITEM_MUTATION = gql`
mutation deleteItem($itemId: ID!){
    deleteItem(itemId:$itemId)
}
`;