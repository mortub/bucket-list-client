//component to the favorite button - to mark/unmark item as favorite
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button,Icon } from 'semantic-ui-react';
import MyPopup from '../util/MyPopup';

function FavoriteButton({user, itemId,favorite}) {
    const [fav, setFav ] = useState(false);

    useEffect( () => {
        if(favorite === true){
            setFav(true);
        } else{
            setFav(false);
        }
    }, [favorite]);
    
    //graphql mark as favorite item
    const [favoriteItem] = useMutation(FAVORITE_ITEM_MUTATION, {
        variables: {
            itemId: itemId
        },
        onError(err){
            //console.log(err)
        },
    })

    const favoriteButton = user ? (
        fav ? (
             <Icon name='favorite' color='yellow' link size='large' onClick={favoriteItem}/>
        ) : (
            <Icon name='favorite' size='large' link onClick={favoriteItem}/>
        )
    ) : (
         <Button as={ Link } to="/login" color='pink' basic>
            <Icon name='favorite' size='large' />
        </Button>
    );

    return (
            <MyPopup content={fav? "unmark as favorite": "mark as favorite"}>
                {favoriteButton}
           </MyPopup>
    )
}

const FAVORITE_ITEM_MUTATION = gql`
    mutation favoriteItem($itemId: ID!){
        favoriteItem(itemId:$itemId){
            id
            username
            favorite
        }
    }
`;

export default FavoriteButton