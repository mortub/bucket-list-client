//page for seeing a single post a user published
import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Card, Button, Icon, Label, Image, Form } from 'semantic-ui-react';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import MyPopup from '../util/MyPopup';


function SinglePost(props){
     const postId = props.match.params.postId;
     const { user } = useContext(AuthContext);
     const commentInputRef = useRef(null);
     const [comment, setComment] = useState('');

     //graphql show posts
    const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
        variables: {
          postId
        },
        onError(err){

        }
      });
      //graphql submit a comment on post
      const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION,{
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        variables:{
            postId,
            body: comment
        }
    });

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error.</p>

    
    //refresh page on delete
    function deletePostCallback(){
        props.history.push('/');
    }

    let postMarkup;
    if(!data.getPost){
        postMarkup = <p className='loading'>Loading...</p>
    } else {
        const {id, body, createdAt, username, comments, likes, likeCount, commentCount} = data.getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image 
                        src='https://i.pinimg.com/originals/3a/73/f3/3a73f327c2579aee5c9df17028bff9e1.jpg'
                        size='small'
                        float='right'
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                       <Card fluid>
                           <Card.Content>
                               <Card.Header>{username}</Card.Header>
                               <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                               <Card.Description>{body}</Card.Description>
                           </Card.Content>
                           <hr/>
                           <Card.Content extra>
                               <LikeButton user={user} post={{ id, likeCount, likes }}/>
                                <MyPopup content="Comment on post">
                                    <Button
                                        as="div"
                                        labelPosition="right"
                                    >
                                        <Button basic color="blue">
                                            <Icon name="comments" />
                                        </Button>
                                        <Label basic color="blue" pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>
                                </MyPopup>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                           </Card.Content>
                       </Card>{user && (
                           <Card fluid>
                               <Card.Content>
                               <p>Post a comment</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input
                                        type="text"
                                        placeholder="Comment..."
                                        name="comment"
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        ref={commentInputRef}
                                        />
                                        <Button type="submit" className= "ui button black" disabled={comment.trim() === ''}
                                        onClick={submitComment} >
                                        Submit
                                        </Button>
                                    </div>
                                </Form>
                               </Card.Content>
                           </Card>
                       )}
                       {comments.map(comment => (
                        <Card fluid key={comment.id}>
                            <Card.Content>
                                {user && user.username === comment.username && (
                                    <DeleteButton postId={id} commentId={comment.id} />
                                )}
                                <Card.Header>{comment.username}</Card.Header>
                                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{comment.body}</Card.Description>
                            </Card.Content>
                        </Card>
                       ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body:String!){
        createComment(postId:$postId,body:$body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId:ID!){
        getPost(postId:$postId){
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

export default SinglePost;