//home page
import React, {useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid , Transition} from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';


function Home() {
    const [posts, setPosts] = useState([]);
	const { user } = useContext(AuthContext);
	const { loading, data } = useQuery(FETCH_POSTS_QUERY,{
        onError(err){
            
        }
    });
	useEffect(() => {
		if (data) {
			setPosts(data.getPosts);
		}
    }, [data]);
    
    return (
        <Grid columns={3}>
            <Grid.Row className='page-title'>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
               {loading? (
                   <h1>Loading posts...</h1>
               ):(
                  <Transition.Group>
                      {
                         posts && posts.map(post => {
                           return (
                             <Grid.Column key={post.id}>
                                 <PostCard post={post} />
                              </Grid.Column>
                             )
                         })
                      }
                  </Transition.Group>
               )}
            </Grid.Row>
        </Grid>
    )
}

export default Home;