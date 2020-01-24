//component for the input form to add an item on your list
import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_ITEMS_QUERY} from '../util/graphql';

function ItemForm() {
    
    const { values, onChange, onSubmit } = useForm(createItemCallback, {
        body:''
    });

    //graphql create a new item
    const [createItem, { error }] = useMutation(CREATE_ITEM_MUTATION,{
        variables:values,
        update(proxy, result){
           const data = proxy.readQuery({
                query: FETCH_ITEMS_QUERY
            })
            const new_item = result.data.createItem;
			proxy.writeQuery({
				query: FETCH_ITEMS_QUERY,
				data: { getItems: [new_item, ...data.getItems] }
			});
			values.body = '';
        },
        onError(err){
            //console.log(err)
        }
    } )

  
    function createItemCallback(){
        createItem();
    }

    return (
        <>
        <Form onSubmit={onSubmit}> 
            <h2 className='font'>Create a new item on your list:</h2>
            <Form.Field>
                <Form.Input 
                placeholder='Something great'
                name='body'
                onChange={onChange}
                value={values.body}
                error={error ? true:false}
                />
                <Button type='submit' color='black'>
                    Submit
                </Button>
            </Form.Field>
        </Form>
        {error && (
            <div className="ui error message" >
                <ul className="list-item">
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
        </>
    )
}

const CREATE_ITEM_MUTATION = gql`
    mutation createItem(
        $body: String!
    ){
        createItem(
            body:$body
        ){
            id
            body
            createdAt
            username
            favorite
        }
    }
`

export default ItemForm;