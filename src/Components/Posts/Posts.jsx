import React, { useState, useCallback, useRef,memo } from 'react'
import Post from './Post'
import useGetPosts from '../../hooks/useGetPosts'


function Posts({userLogin}) {

  const [isIntersecting, setIsIntersecting] = useState(false)
  //custome hook
  const { userPosts } = useGetPosts(isIntersecting)


  const observer = useRef()
  const lastRef = useCallback(node => {

    if (observer.current) observer.current.disconnect() // stop previous ref
    observer.current = new IntersectionObserver(entries => { // take the last current ref
      if (entries[0].isIntersecting) {  // if the last document not Visible mean no more data on firebase then stop making new pull request
        setIsIntersecting(entries[0].isIntersecting) // will send this to useGetPost
      }
    })
    if (node) observer.current.observe(node)
  }, [])

 
  const renderPost = useCallback((userPosts.map(({post,id }) => {
    return (
      <Post ref={lastRef} key={id} postId={id} userLogin={userLogin} postUser={post.username} imageUrl={post.imageUrl} caption={post.caption} type={post.type} />
    )
  })
  ), [userPosts])


  
  return (
    <>
      {renderPost}
    </>
  )
}

export default memo(Posts)
