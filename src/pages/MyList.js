//page for showing the user's bucket list
import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import DeleteItemButton from '../components/DeleteItemButton';
import { AuthContext } from '../context/auth';
import { List, Grid } from 'semantic-ui-react'
import ItemForm from '../components/ItemForm';
import { FETCH_ITEMS_QUERY } from '../util/graphql';
import EditItemButton from '../components/EditItemButton';
import FavoriteButton from '../components/FavoriteButton';
import CompletedButton from '../components/CompletedButton';


function MyList(props) {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);

    //graphql show items
    const { loading, data } = useQuery(FETCH_ITEMS_QUERY, {
        onError(err) {

        }
    });
    //every time there is a change in data, show again all the items
    useEffect(() => {
        if (data) {
            setItems(data.getItems);
        }
    }, [data]);

    //reloading once deletion is made
    function deleteItemCallback(){
        window.location.reload();
    }

    const listToShow = user ? (
        <Grid>
            <Grid.Row className='page-title'>
                <ItemForm />
            </Grid.Row>
            <Grid.Row className='list-item'>
                <List divided verticalAlign='middle'>
                    {items.map(item => {
                        if (user && user.username === item.username) {
                            return (
                                <List.Item key={item.id}>
                                    <List.Content floated='right' >
                                        <EditItemButton itemId={item.id} callback={deleteItemCallback} />
                                        <CompletedButton itemId={item.id} callback={deleteItemCallback}/>
                                        <DeleteItemButton itemId={item.id} callback={deleteItemCallback} />
                                    </List.Content>
                                    <FavoriteButton user={user} itemId={item.id} favorite={item.favorite}/>
                                    <List.Content >
                                        <List.Description>
                                            {item.body}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>
                            )
                        } 
                    }
                 )}
                </List>
            </Grid.Row>
        </Grid>
    ) : (
            <div>You are not logged in please login or register</div>
        )
    return (
        listToShow
    )
}



export default MyList;

{/* <List.Item key={item.id}>
    <List.Content floated='right' >
        <EditItemButton itemId={item.id} callback={deleteItemCallback} />
        <Icon name='check square' color='green' size='large' />
        <DeleteItemButton itemId={item.id} callback={deleteItemCallback} />
    </List.Content>

    <Icon name='favorite' color='yellow' size='large' />
    <List.Content >
        <List.Description>
            {item.body}
        </List.Description>
    </List.Content>

</List.Item> */}