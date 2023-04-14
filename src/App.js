   import{Box,Button,Container,HStack,Input,VStack}from '@chakra-ui/react'
import TextMessage from './component/TextMessage';
import { onAuthStateChanged,getAuth,GoogleAuthProvider,signInWithPopup,signOut} from "firebase/auth"

import {app} from "./firebase"
import { useEffect, useRef, useState } from 'react';
import {getFirestore,addDoc, collection, serverTimestamp ,onSnapshot,query,orderBy}from "firebase/firestore"
const auth=getAuth(app);
const db=getFirestore(app);
 
const loginHandler=()=>{
     const provider= new GoogleAuthProvider();
     signInWithPopup(auth,provider);
}
const signOutHandler=()=>{
   signOut(auth);
}



function App() {
  const q=query(collection(db,"message"),orderBy("createdAt","asc"))
  const [user,setUser]=useState(false);
  const [message,setMessage]=useState("");
  const [messages,setMessages]=useState([]);
  const scrollBehavior=useRef(null);
 console.log(user);
  const submitHandler=async(e)=>{
    e.preventDefault();
    try {
      await addDoc(collection(db,"message"),{
        text:message,
        uid:user.uid,
        url:user.photoURL,
        createdAt:serverTimestamp()
      })
      setMessage("");
      scrollBehavior.current.scrollIntoView({behavior:"smooth"})
    } catch (error) {
      alert(error);
    }
  
  }

  useEffect(()=>{
   const unsascribe= onAuthStateChanged(auth,(data)=>{
      setUser(data);
    });

    const unsuscribeMessage= onSnapshot(q,(snap)=>{
      setMessages(snap.docs.map((item)=>{
            const id=item.id;
            return{id,...item.data()}
      }))
      
    })
     
      return ()=>{
        unsascribe(); 
        unsuscribeMessage();
      }
    
     

  },[])
  return (
   
    <Box bg={"red.50"}>
      {user ?(
         <Container height={'100vh'} bg={"white"}>
         <VStack   paddingY={"2"}>
          <Button onClick={signOutHandler} colorScheme={"red"} w={"full"}>LogOut</Button>
         </VStack>
         <VStack h={"84%"} w={"full"} overflowY={"auto"} css={{
          "&::-webkit-scrollbar":{
            display:"none",
          }
         }}>
          {
              messages.map((item)=>(
                <TextMessage key={item.id} text={item.text} uri={item.url}  user={item.uid===user.uid?"me":"other"} />
              ))
          }
          <div ref={scrollBehavior}></div>
          </VStack>
        
          <form  onSubmit={submitHandler} style={{width:"100%"}}>
       <HStack>
       <Input value={message} onChange={(e)=>setMessage(e.target.value)} placeholder='Type Here..'/>
         <Button type={"submit"}> send</Button>
       </HStack>
         </form>
       
        
        </Container>
      )
    :<Container >
         <Button   onClick={loginHandler}>SinUp with Google</Button> 
    </Container> 
}
    </Box>
  );
}

export default App;
