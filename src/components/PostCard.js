//component for the card showed for each post on the home page
import React, { useContext } from 'react';
import {Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../util/MyPopup';
import AddItemButton from './AddItemButton';

function PostCard(props){
    const { user } = useContext(AuthContext);
    const {body, createdAt, id, username, likeCount, commentCount, likes} = props.post;

    function deletePostCallback(){
        window.location.reload();
    }

    return(
        <Card fluid className='card' >
            <Card.Content>
                <AddItemButton postId={id} />
                <Image
                    floated='right'
                    size='mini'
                    src='https://i.pinimg.com/originals/3a/73/f3/3a73f327c2579aee5c9df17028bff9e1.jpg'
                />
                <h2 className='font'>{username}</h2>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }}/>
                <MyPopup content="Comment on post">
                    <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                        <Button color='blue' basic>
                            <Icon name='comments' />
                        </Button>
                        <Label basic color='blue' pointing='left'>
                            {commentCount}
                        </Label>
                    </Button>
                </MyPopup>
                {user && user.username === username && <DeleteButton postId={id} callback={deletePostCallback}/>}
            </Card.Content>
        </Card>
    )
}

export default PostCard