//component for button to add a post as an item on your list
import React, {useContext} from 'react';
import { Icon} from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import MyPopup from '../util/MyPopup';
import { FETCH_ITEMS_QUERY} from '../util/graphql';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/auth';


function AddItemButton({postId}) {
    const { user} = useContext(AuthContext);
    //graphql add item from post id
    const [addItem] = useMutation(ADD_ITEM_MUTATION,{
        variables:{
            postId,
        },
        onError(err){
           
        },
        update(proxy, result){
            const data = proxy.readQuery({
                query: FETCH_ITEMS_QUERY
            });
            const new_item = result.data.addItem;
            proxy.writeQuery({ 
                query: FETCH_ITEMS_QUERY,
                 data: { getItems: [new_item, ...data.getItems] }
                });
        }
    } );

    toast.configure({
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true
    });

   const notify = () => {
        toast("Item added");
   }

        
    
    return (
        <MyPopup content='Add to my list'>
            <Icon name='add circle' size='large' link color='blue' onClick={() => {
                if(user){
                    addItem();
                    notify();
                }
                
                }}/>           
        </MyPopup>
    )
}

const ADD_ITEM_MUTATION = gql`
    mutation addItem($postId:ID!){
        addItem(postId:$postId){
            id
            username
            createdAt
            favorite
            body
        }
    }
`;


export default AddItemButton;



