//component for delete button- to delete an item
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import { Icon, Confirm } from 'semantic-ui-react';
import { FETCH_ITEMS_QUERY,DELETE_ITEM_MUTATION } from '../util/graphql';
import MyPopup from '../util/MyPopup';

function DeleteItemButton({itemId,callback}) {
    const [confirmOpen, setConfirmOpen ] = useState(false);

    //graphql to delete an item
    const [deleteItem] = useMutation(DELETE_ITEM_MUTATION, {
        variables:{
            itemId,
        },
        update(proxy){
            setConfirmOpen(false);
            const data = proxy.readQuery({
                query: FETCH_ITEMS_QUERY
            });
            data.getItems = data.getItems.filter(item => item.id !== itemId);
            proxy.writeQuery({ query: FETCH_ITEMS_QUERY, data });
            if (callback) callback();
        },
        onError(err){
            
        }
    })
    return(
        <>
            <MyPopup
            content="Delete item" >       
                <Icon name='trash' link color='red'  size='large' onClick={() => setConfirmOpen(true)}/>      
            </MyPopup>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deleteItem}
            />
        </>
    )
}

export default DeleteItemButton;