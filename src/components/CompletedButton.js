//component to the button saying you completed the item on your list
import React, { useState }from 'react';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_ITEMS_QUERY,DELETE_ITEM_MUTATION } from '../util/graphql';
import MyPopup from '../util/MyPopup';
import {Icon,Modal,Header,Button } from 'semantic-ui-react';

const CompletedButton = ({itemId, callback}) => {
    const [confirmOpen, setConfirmOpen ] = useState(false);

    //graphql delete the item once it is completed
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
    });

    return(
        <>
            <Modal
                trigger={
                    <MyPopup
                        content="Done" >
                        <Icon name='check circle' color='green' link size='large' onClick={() => setConfirmOpen(true)} />
                    </MyPopup>
                }
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                basic
                size='small'
            >
                <Header icon='browser' content='By pressing Done, the item was completed and will be deleted from your list'/>
                <Modal.Content>
                <Button color='green' inverted onClick={deleteItem}>
                    <Icon name='checkmark' /> Done
                </Button>
                </Modal.Content>
            </Modal>
        </>
    )
  
}
   
export default CompletedButton;

