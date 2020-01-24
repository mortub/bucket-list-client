//component to the edit button - to edit an existing item 
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useForm } from '../util/hooks';
import { Icon, Modal, Header, Form, Button } from 'semantic-ui-react';
import { FETCH_ITEMS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

function EditItemButton({itemId,callback}) {
    const [openInput, setOpenInput ] = useState(false);
    const { values, onChange, onSubmit } = useForm(updateItemCallback, {
        body:''
    });

    let body = values.body;
    const [updateItem, { error }] = useMutation(UPDATE_ITEM_MUTATION, {
        variables:{
            body,
            itemId
            
        },
        update(proxy){
            setOpenInput(false);
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

    function updateItemCallback(){
        updateItem();
    }
    return(
        <>
            <Modal
                trigger={
                    <MyPopup
                        content="Update item" >
                        <Icon name='pencil' color='blue' link size='large' onClick={() => setOpenInput(true)} />
                    </MyPopup>
                }
                open={openInput}
                onClose={() => setOpenInput(false)}
                basic
                size='small'
            >
                <Header icon='browser' content='Edit the item:' />
                <Modal.Content>
                    <Form onSubmit={onSubmit}>
                        <Form.Field>
                            <Form.Input
                                placeholder='Something to do...'
                                name='body'
                                onChange={onChange}
                                value={values.body}
                                error={error ? true : false}
                            />
                            <Button color='green' type='submit'inverted>
                                 <Icon name='checkmark' /> Done
                             </Button>
                        </Form.Field>
                    </Form>
                    {error && (
                        <div className="ui error message" style={{ marginBottom: 20 }}>
                            <ul className="list">
                                <li>{error.graphQLErrors[0].message}</li>
                            </ul>
                        </div>
                    )}
                </Modal.Content>
            </Modal>
        </>
    )
}

const UPDATE_ITEM_MUTATION = gql`
    mutation updateItem($itemId: ID!, $body: String!){
        updateItem(itemId:$itemId, body:$body){
            id
            username
            createdAt
            body
        }
    }
`;


export default EditItemButton;